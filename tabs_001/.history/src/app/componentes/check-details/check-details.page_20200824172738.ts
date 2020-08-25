import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "../../servicios/auth.service";
import { BusquedaService } from "../../servicios/busqueda.service";
import { ChangeDetectionStrategy } from '@angular/compiler/src/core';
import { Observable, Subject } from "rxjs";
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { NavController, LoadingController, AlertController } from "@ionic/angular";
import { InquilinoInterface } from 'src/app/models/inquilino.interface';
import { VisitaInterface } from 'src/app/models/visita.interface';
import { VisitaService } from "../../servicios/visita.service";
import { map, takeUntil } from "rxjs/operators";
import { DatePipe } from '@angular/common';




@Component({
  selector: 'app-check-details',
  templateUrl: './check-details.page.html',
  styleUrls: ['./check-details.page.scss'],
  providers: [DatePipe]
})
export class CheckDetailsPage implements OnDestroy, OnInit {


  inquilinoLocal: InquilinoInterface = {} as InquilinoInterface;
  visitaVisitaLocal: VisitaInterface = {} as VisitaInterface;
  idInquilino = null;


  constructor(
  public authServices: AuthService, 
  public router: Router, 
  public alertController: AlertController, 
  private datePipe: DatePipe,
  public busquedaServ: BusquedaService, 
  public route: ActivatedRoute, 
  private nav: NavController, 
  private loadingController: LoadingController,
  public visitaDepto: VisitaService) { }
  public inquilinoDetalle: any = [];
  private unsubscribe: Subject<void> = new Subject();
  public visitaLocal = {} as VisitaInterface;

  ngOnInit() {
    this.idInquilino = this.route.snapshot.params['id'];
    if (this.idInquilino) {
      this.loadInquilino();
    }
  }

  async loadInquilino() {
    const loading = await this.loadingController.create({
      message: 'Loading ...'
    });
    await loading.present();
    console.log("==this.idInquilino=="+this.idInquilino)

    await this.busquedaServ.getBusquedaInquilinoId(this.idInquilino).then(resInquilino => {
      this.inquilinoLocal = resInquilino.data() as InquilinoInterface;      
      this.inquilinoLocal.id = resInquilino.id;
    });
    console.log("==this.idInquilino=="+this.inquilinoLocal.nombre)
    await this.visitaDepto.getVisitaVisita(this.idInquilino).then(regVisitaVisita => {
      regVisitaVisita.forEach(resVisitaVisita => {
        this.visitaVisitaLocal = resVisitaVisita.data() as VisitaInterface;
        this.visitaVisitaLocal.id = resVisitaVisita.id;
      });
    });

    console.log("==this.idInquilino=="+this.inquilinoLocal.nombre);
    console.log("==this.visitaLocal.id=="+this.visitaVisitaLocal.id);
    this.inquilinoLocal.checkIn = this.visitaVisitaLocal.checkIn;
    this.inquilinoLocal.checkOut = this.visitaVisitaLocal.checkOut;
    loading.dismiss();
  }


  async checkInVisita() {
    this.idInquilino = this.route.snapshot.params['id'];
    var ddMMyyyy = this.datePipe.transform(new Date(), "dd-MM-yyyy hh:mm:ss "); 
    var registro: Number;
    
    await this.visitaDepto.getVisitaVisitaCheckIn(this.idInquilino).then(resReg => { 
      
      if((resReg).empty){
        console.log('Sin registro en la Bd'); 
        this.busquedaServ.getBusquedaInquilinoId(this.idInquilino).then(resInquilino => {
          this.inquilinoLocal = resInquilino.data() as InquilinoInterface;
          this.inquilinoLocal.id = resInquilino.id;
        });
        console.log('RegistroBusquedaInquilino::'+ this.inquilinoLocal.email);
        console.log('IdDepartamento::'+ this.inquilinoLocal.idDepto);
          this.inquilinoLocal.visita ='1';
          this.inquilinoLocal.idDepto = this.inquilinoLocal.idDepto;
          this.visitaLocal.fechaRegistro = new Date();
          this.visitaLocal.checkIn = ddMMyyyy.toString();
          this.visitaLocal.checkOut = '0';
          this.visitaLocal.status = "1";
          this.visitaLocal.idDepto = this.inquilinoLocal.idDepto;
          this.visitaLocal.idUsuario = this.idInquilino;
          this.visitaDepto.agregarVisita(this.visitaLocal);
          this.backCheck();
      }else{
        console.log('Con registro en la Bd');
        resReg.forEach(async resVisitUnit => {
          console.log('::Inicio CheckIn::'+resVisitUnit);
          const dataVisita: VisitaInterface = resVisitUnit.data() as VisitaInterface;
          this.busquedaServ.getBusquedaInquilinoId(this.idInquilino).then(resInquilino => {
            this.inquilinoLocal = resInquilino.data() as InquilinoInterface;
            this.inquilinoLocal.id = resInquilino.id;
          });
          
          await this.visitaDepto.getVisitaVisita(this.inquilinoLocal.id).then(regVisitaVisita => {
            regVisitaVisita.forEach(resVisitaVisita => {
              this.visitaVisitaLocal = resVisitaVisita.data() as VisitaInterface;
              this.visitaVisitaLocal.id = resVisitaVisita.id;
            });
          });
          
          this.inquilinoLocal.checkIn = this.visitaVisitaLocal.checkIn;
          this.inquilinoLocal.checkOut = this.visitaVisitaLocal.checkOut;
          
          if (dataVisita.checkIn == '0' && (dataVisita.checkOut == '0')) {
            this.inquilinoLocal.checkIn = this.visitaVisitaLocal.checkIn;
            this.inquilinoLocal.checkOut = this.visitaVisitaLocal.checkOut;
            this.inquilinoLocal.visita ='1';
            this.inquilinoLocal.idDepto = this.visitaVisitaLocal.idDepto;
            this.visitaLocal.fechaRegistro = new Date();
            this.visitaLocal.checkIn = ddMMyyyy.toString();
            this.visitaLocal.checkOut = '0';
            this.visitaLocal.status = "1";
            this.visitaLocal.idDepto = this.inquilinoLocal.idDepto;
            this.visitaLocal.idUsuario = this.idInquilino;
            this.visitaDepto.actualizarVisita(this.visitaLocal.id, this.visitaLocal);
            this.backCheck();
          } else if (dataVisita.checkIn != '0' && (dataVisita.checkOut == '0')) {
            console.log("==Ya existe una visita con un checkIn 1-0 ==");
            this.checkInAlert();
          } else if (dataVisita.checkIn != '0' && (dataVisita.checkOut != '0')) {
            this.inquilinoLocal.checkIn = this.visitaVisitaLocal.checkIn;
            this.inquilinoLocal.checkOut = this.visitaVisitaLocal.checkOut;
            this.inquilinoLocal.visita ='1';
            this.inquilinoLocal.idDepto = this.visitaVisitaLocal.idDepto;
            this.visitaLocal.fechaRegistro = new Date();
            this.visitaLocal.checkIn = ddMMyyyy.toString();
            this.visitaLocal.checkOut = '0';
            this.visitaLocal.status = "1";
            this.visitaLocal.idDepto = this.inquilinoLocal.idDepto;
            this.visitaLocal.idUsuario = this.idInquilino;
            console.log("::Inserta visita::");
            this.visitaDepto.agregarVisita(this.visitaLocal);
            this.busquedaServ.updateBusquedaInqquilino(this.idInquilino, this.inquilinoLocal);
            this.backCheck();
          }
  
        });
      }
    });
  }

  async checkOutVisita() {
    console.log('Inicia checkOutVisita()');
    this.idInquilino = this.route.snapshot.params['id'];
    var ddMMyyyy = this.datePipe.transform(new Date(), "dd-MM-yyyy hh:mm:ss ");
    var registro: Number;
    var flagSalida = true;

    this.visitaDepto.getVisitaVisitaCheckIn(this.idInquilino).then(resReg => {
      console.log('registro' + registro);
      resReg.forEach(async resVisitUnit => {
        const dataVisita: VisitaInterface = resVisitUnit.data() as VisitaInterface;
        if (dataVisita.checkIn == '0' && (dataVisita.checkOut == '0')) {
          console.log("== No puede registrar checkout sin Checkin ==");
        } else if (dataVisita.checkIn != '0' && (dataVisita.checkOut == '0')) {
          console.log("==Registrar checkOut ==");
          await this.busquedaServ.getBusquedaInquilinoId(this.idInquilino).then(resInquilino => {
            this.inquilinoLocal = resInquilino.data() as InquilinoInterface;
            this.inquilinoLocal.id = resInquilino.id;
          });
          console.log("==Registrar checkOut 02==");
          await this.visitaDepto.getVisitaVisita(this.idInquilino).then(resVisitaVisita => {
            resVisitaVisita.forEach(resVisitaVisita => {
              this.visitaVisitaLocal = resVisitaVisita.data() as VisitaInterface;
              this.visitaLocal.id = resVisitaVisita.id;
              console.log("==Registrar checkOut 02.1=="+resVisitaVisita.id);
            });
          });
          console.log("==Registrar checkOut 03==");
          this.inquilinoLocal.checkIn = this.visitaVisitaLocal.checkIn;
          this.inquilinoLocal.checkOut = this.visitaVisitaLocal.checkOut;
          this.inquilinoLocal.visita ='0';
          this.inquilinoLocal.idDepto = this.visitaVisitaLocal.idDepto;
          this.inquilinoLocal.visita = '0';
          this.visitaLocal.checkIn = this.visitaVisitaLocal.checkIn;
          this.visitaLocal.checkOut = ddMMyyyy.toString();
          this.visitaLocal.status = "0";
          this.visitaLocal.idDepto = this.inquilinoLocal.idDepto;
          this.visitaLocal.idUsuario = this.idInquilino;
          this.visitaDepto.actualizarVisita(this.visitaLocal.id, this.visitaLocal);
          this.busquedaServ.updateBusquedaInqquilino(this.idInquilino, this.inquilinoLocal);
          this.router.navigate(["/menu"]);
        } else if (dataVisita.checkIn != '0' && (dataVisita.checkOut != '0')) {
          console.log("==Manda Error porque se debe registrar un nuevo checkin con una nueva visita 1-1 ==");
          this.checkOutAlert();
        }
      });
    });
  }

  async saveInquilino() {
    const loading = await this.loadingController.create({
      message: 'Loading ...'
    });
    await loading.present();
    if (this.idInquilino) {
      loading.dismiss();
      this.busquedaServ.updateBusquedaInqquilino(this.idInquilino, this.inquilinoLocal);
      this.nav.navigateForward('/')
    } else {

      loading.dismiss();
      this.busquedaServ.addBusquedaInquilino(this.inquilinoLocal);
      this.nav.navigateForward('/')
    }
  }
  backCheck() {
    this.router.navigate(["/menu"]);
  }


  async checkInAlert() {
    const alert = await this.alertController.create({
      header: '¡Error!',
      subHeader: 'Entrada invalida',
      message: 'Ya existe una visita',
      buttons: ['OK']
    });

    await alert.present();
  }

  async checkOutAlert() {
    const alert = await this.alertController.create({
      header: '¡Error!',
      subHeader: 'Salida invalida',
      message: 'Aún no existe una entrada valida.',
      buttons: ['OK']
    });

    await alert.present();
  }

  ngOnDestroy() {
    console.log('ngOnDestory');
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
