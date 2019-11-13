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
import { GymService } from 'src/app/servicios/gym.service';
import { GymInterface } from 'src/app/models/gym.interface';


@Component({
  selector: 'app-gym',
  templateUrl: './gym.page.html',
  styleUrls: ['./gym.page.scss'],
  providers: [DatePipe]
})
export class GymPage implements OnDestroy, OnInit {


  inquilinoLocal: InquilinoInterface = {} as InquilinoInterface;
  visitaGymVisitaLocal: GymInterface = {} as GymInterface;
  idInquilino = null;


  constructor(
  public authServices: AuthService, public router: Router, public alertController: AlertController, private datePipe: DatePipe,
  public busquedaServ: BusquedaService, public route: ActivatedRoute, private nav: NavController, private loadingController: LoadingController,
  public gymService: GymService) { }
  public inquilinoDetalle: any = [];
  private unsubscribe: Subject<void> = new Subject();
  public visitaGymLocal = {} as GymInterface;



  ngOnInit() {
    this.idInquilino = this.route.snapshot.params['id'];
    if (this.idInquilino) {
      this.loadInquilino();
    }
  }

  ngOnDestroy() {
    console.log('ngOnDestory');
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  async loadInquilino() {
    const loading = await this.loadingController.create({
      message: 'Loading ...'
    });
    await loading.present();
    console.log("==this.idInquilino==" + this.idInquilino)

    await this.busquedaServ.getBusquedaInquilinoId(this.idInquilino).then(resInquilino => {
      this.inquilinoLocal = resInquilino.data() as InquilinoInterface;
      this.inquilinoLocal.id = resInquilino.id;
    });

    console.log("==this.idInquilino==" + this.inquilinoLocal.nombre)
    await this.gymService.getVisitaVisitaGym(this.idInquilino).then(regVisitaVisita => {
      regVisitaVisita.forEach(resVisitaVisitaGym => {
        this.visitaGymVisitaLocal = resVisitaVisitaGym.data() as GymInterface;
        this.visitaGymVisitaLocal.id = resVisitaVisitaGym.id;
      });
    });

    console.log("==this.idInquilino==" + this.inquilinoLocal.nombre);
    console.log("==this.visitaLocal.id==" + this.visitaGymVisitaLocal.id);
    this.inquilinoLocal.checkIn = this.visitaGymVisitaLocal.checkIn;
    this.inquilinoLocal.checkOut = this.visitaGymVisitaLocal.checkOut;
    loading.dismiss();
  }

  async checkInVisita() {
    console.log("==Inicio check in GYM==");
    this.idInquilino = this.route.snapshot.params['id'];
    var ddMMyyyy = this.datePipe.transform(new Date(), "dd-MM-yyyy hh:mm:ss "); 
    var registro: Number;
  
    await this.gymService.getVisitaVisitaGymCheckIn(this.idInquilino).then(resReg => {
      console.log('resReg==>'+resReg);
      resReg.forEach(async resVisitUnit => {
        const dataVisita: GymInterface = resVisitUnit.data() as GymInterface;
          this.busquedaServ.getBusquedaInquilinoId(this.idInquilino).then(resInquilino => {
          this.inquilinoLocal = resInquilino.data() as InquilinoInterface;
          this.inquilinoLocal.id = resInquilino.id;
        });

        await this.gymService.getVisitaVisitaGym(this.inquilinoLocal.id).then(regVisitaVisita => {
          regVisitaVisita.forEach(resVisitaVisita => {
            this.visitaGymVisitaLocal = resVisitaVisita.data() as VisitaInterface;
            this.visitaGymVisitaLocal.id = resVisitaVisita.id;
          });
        });
        
        console.log("==dataVisita.checkIn =="+dataVisita.checkIn);

        this.inquilinoLocal.checkIn = this.visitaGymVisitaLocal.checkIn;
        this.inquilinoLocal.checkOut = this.visitaGymVisitaLocal.checkOut;

        if (dataVisita.checkIn == '0' && (dataVisita.checkOut == '0')) {
          this.inquilinoLocal.checkIn = this.visitaGymVisitaLocal.checkIn;
          this.inquilinoLocal.checkOut = this.visitaGymVisitaLocal.checkOut;
          this.inquilinoLocal.visita ='1';
          this.inquilinoLocal.idDepto = this.visitaGymVisitaLocal.idDepto;
          this.visitaGymLocal.fechaRegistro = new Date();
          this.visitaGymLocal.checkIn = ddMMyyyy.toString();
          this.visitaGymLocal.checkOut = '0';
          this.visitaGymLocal.status = "1";
          this.visitaGymLocal.idDepto = this.inquilinoLocal.idDepto;
          this.visitaGymLocal.idUsuario = this.idInquilino;
          this.gymService.updateVisitaGym(this.visitaGymLocal.id, this.visitaGymLocal);
          this.backCheck();
        } else if (dataVisita.checkIn != '0' && (dataVisita.checkOut == '0')) {
          console.log("==Ya existe una visita con un checkIn 1-0 ==");
          this.checkInAlert();
        } else if (dataVisita.checkIn != '0' && (dataVisita.checkOut != '0')) {
          this.inquilinoLocal.checkIn = this.visitaGymVisitaLocal.checkIn;
          this.inquilinoLocal.checkOut = this.visitaGymVisitaLocal.checkOut;
          this.inquilinoLocal.visita ='1';
          this.inquilinoLocal.idDepto = this.visitaGymVisitaLocal.idDepto;
          this.visitaGymLocal.fechaRegistro = new Date();
          this.visitaGymLocal.checkIn = ddMMyyyy.toString();
          this.visitaGymLocal.checkOut = '0';
          this.visitaGymLocal.status = "1";
          this.visitaGymLocal.idDepto = this.inquilinoLocal.idDepto;
          this.visitaGymLocal.idUsuario = this.idInquilino;
          this.gymService.addVisitaGym(this.visitaGymLocal);
          this.busquedaServ.updateBusquedaInqquilino(this.idInquilino, this.inquilinoLocal);
          this.backCheck();
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

}
