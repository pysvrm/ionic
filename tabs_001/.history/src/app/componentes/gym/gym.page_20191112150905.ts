import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "../../servicios/auth.service";
import { BusquedaService } from "../../servicios/busqueda.service";
import { GymService } from "../../servicios/gym.service";
import { ChangeDetectionStrategy } from '@angular/compiler/src/core';
import { Observable, Subject } from "rxjs";
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { NavController, LoadingController, AlertController } from "@ionic/angular";
import { InquilinoInterface } from 'src/app/models/inquilino.interface';
import { VisitaInterface } from 'src/app/models/visita.interface';
import { VisitaService } from "../../servicios/visita.service";
import { map, takeUntil } from "rxjs/operators";
import { DatePipe } from '@angular/common';
import { GymInterface } from 'src/app/models/gym.interface';
import { DeptoService } from 'src/app/servicios/depto.service';
import { deptoInterface } from 'src/app/models/depto.interface';

@Component({
  selector: 'app-gym',
  templateUrl: './gym.page.html',
  styleUrls: ['./gym.page.scss'],
  providers: [DatePipe]
})
export class GymPage implements OnDestroy, OnInit {


  inquilinoLocal: InquilinoInterface = {} as InquilinoInterface;
  visitaVisitaLocal: VisitaInterface = {} as VisitaInterface;
  deptoLocal: deptoInterface = {} as deptoInterface;
  idInquilino = null;


  constructor(
    public authServices: AuthService, public router: Router, public alertController: AlertController,
    private datePipe: DatePipe,    public busquedaServ: BusquedaService, public route: ActivatedRoute, 
    private nav: NavController, private loadingController: LoadingController,
    public visitaDepto: GymService, public deptoService: DeptoService) { }

  public inquilinoDetalle: any = [];
  private unsubscribe: Subject<void> = new Subject();
  public visitaLocal = {} as VisitaInterface;
  public dataVisita: GymInterface;


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
    console.log("==this.idInquilino=="+this.inquilinoLocal.nombre);

    

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
        await this.visitaDepto.getVisitaVisitaCheckIn(this.idInquilino).then(async resReg => {
      if(resReg.size!=0){
        await this.visitaDepto.getVisitaVisita(this.idInquilino).then(regVisitaVisita => {
          regVisitaVisita.forEach(resVisitaVisita => {
            this.visitaVisitaLocal = resVisitaVisita.data() as VisitaInterface;
            this.visitaVisitaLocal.id = resVisitaVisita.id;
          });
        });
        console.log('registro undefined' + registro);
        resReg.forEach(async resVisitUnit => {
           this.dataVisita = resVisitUnit.data() as GymInterface;
        });
      }else{
        this.dataVisita = {} as GymInterface;
        this.dataVisita.checkIn ="1";
        this.dataVisita.checkOut ="1";
      }
      
    });    
        await this.busquedaServ.getBusquedaInquilinoId(this.idInquilino).then(resInquilino => {
          this.inquilinoLocal = resInquilino.data() as InquilinoInterface;
          this.inquilinoLocal.id = resInquilino.id;
        });
       
        await this.visitaDepto.getVisitaVisita(this.inquilinoLocal.id).then(async regVisitaVisita => {
          if(regVisitaVisita.size !=0){
            regVisitaVisita.forEach(resVisitaVisita => {
              this.visitaVisitaLocal = resVisitaVisita.data() as GymInterface;
              this.visitaVisitaLocal.id = resVisitaVisita.id;
            });
          }else{
            await this.deptoService.getBusquedaDeptoId(this.inquilinoLocal.id).then(regDepto=>{
              this.deptoLocal = regDepto.data() as deptoInterface;
              console.log('regDepto.data()'+regDepto.data());
              this.visitaVisitaLocal.idDepto = regDepto.id; 
            });
          }
          
        });
        
        this.inquilinoLocal.checkIn = this.visitaVisitaLocal.checkIn;
        this.inquilinoLocal.checkOut = this.visitaVisitaLocal.checkOut;

        if (this.dataVisita.checkIn == '0' && (this.dataVisita.checkOut == '0')) {
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
          this.visitaDepto.updateVisita(this.visitaLocal.id, this.visitaLocal);
          this.backCheck();
        } else if (this.dataVisita.checkIn != '0' && (this.dataVisita.checkOut == '0')) {
          console.log("==Ya existe una visita con un checkIn 1-0 ==");
          this.checkInAlert();
        } else if (this.dataVisita.checkIn != '0' && (this.dataVisita.checkOut != '0')) {
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
          this.visitaDepto.addVisita(this.visitaLocal);
          this.busquedaServ.updateBusquedaInqquilino(this.idInquilino, this.inquilinoLocal);
          this.backCheck();
        }
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
          this.visitaDepto.updateVisita(this.visitaLocal.id, this.visitaLocal);
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
