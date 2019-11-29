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

  idInquilino = null;


  constructor(
    public authServices: AuthService, public router: Router, public alertController: AlertController, private datePipe: DatePipe,
    public busquedaServ: BusquedaService, public route: ActivatedRoute, private nav: NavController, private loadingController: LoadingController,
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
    this.busquedaServ.getBusquedaInquilinoId(this.idInquilino).snapshotChanges().forEach(inquilinoDetalleRes => {
      loading.dismiss();
      this.inquilinoLocal = inquilinoDetalleRes.payload.data() as InquilinoInterface;
      this.visitaDepto.getVisitaVisita(this.idInquilino).snapshotChanges().pipe(takeUntil(this.unsubscribe)).subscribe(visitaDetalles => {
        visitaDetalles.map(deptoDetalle => {
          const data: VisitaInterface = deptoDetalle.payload.doc.data() as VisitaInterface;
          this.inquilinoLocal.checkIn = data.checkIn;
          this.inquilinoLocal.checkOut = data.checkOut;
        });
      });
    });
  }


  async checkInVisita() {
    this.idInquilino = this.route.snapshot.params['id'];
    var ddMMyyyy = this.datePipe.transform(new Date(), "dd-MM-yyyy hh:mm:ss ");
    var registro: Number;
    console.log("==Inicio checkin==")
    this.visitaDepto.getVisitaVisitaCheckIn(this.idInquilino).snapshotChanges().pipe(takeUntil(this.unsubscribe)).subscribe(visitaDetallesCheckIn => {
      registro = visitaDetallesCheckIn.length;
      visitaDetallesCheckIn.map(visitaDetallesCheckInRes => {
        const dataVisita: VisitaInterface = visitaDetallesCheckInRes.payload.doc.data() as VisitaInterface;
        if (registro > 0) {
          console.log('Registro::' + registro);


          if (dataVisita.checkIn == '0' && (dataVisita.checkOut == '0')) {
            console.log("== Registra el checkin 0-0 ==");
            this.busquedaServ.getBusquedaInquilinoId(this.idInquilino).snapshotChanges().pipe(takeUntil(this.unsubscribe)).forEach(inquilinoDetalleRes => {
              this.inquilinoLocal = inquilinoDetalleRes.payload.data() as InquilinoInterface;
              this.visitaDepto.getVisitaVisita(this.idInquilino).snapshotChanges().pipe(takeUntil(this.unsubscribe)).subscribe(visitaDetalles => {
                visitaDetalles.map(deptoDetalle => {
                  const data: VisitaInterface = deptoDetalle.payload.doc.data() as VisitaInterface;
                  this.visitaLocal.id = deptoDetalle.payload.doc.id;
                  console.log("data:::::01" + deptoDetalle.payload.doc.id);
                  this.inquilinoLocal.checkIn = data.checkIn;
                  this.inquilinoLocal.checkOut = data.checkOut;
                  this.inquilinoLocal.idDepto = data.idDepto;
                  this.visitaLocal.fechaRegistro = new Date();
                  this.visitaLocal.checkIn = ddMMyyyy.toString();
                  this.visitaLocal.checkOut = '0';
                  this.visitaLocal.status = "1";
                  this.visitaLocal.idDepto = this.inquilinoLocal.idDepto;
                  this.visitaLocal.idUsuario = this.idInquilino;
                  //this.visitaDepto.updateVisita(this.visitaLocal.id, this.visitaLocal);
                  //this.backCheck();
                });
              });
            });
          } else if (dataVisita.checkIn != '0' && (dataVisita.checkOut == '0')) {
            console.log("==Ya existe una visita con un checkIn 1-0 ==");
            this.checkInAlert();
          } else if (dataVisita.checkIn != '0' && (dataVisita.checkOut != '0')) {
            console.log("==Se crea un nuevo registro de visita checkIn 1-1 ==");
            this.busquedaServ.getBusquedaInquilinoId(this.idInquilino).snapshotChanges().pipe(takeUntil(this.unsubscribe)).forEach(inquilinoDetalleRes => {
              this.inquilinoLocal = inquilinoDetalleRes.payload.data() as InquilinoInterface;
              this.visitaDepto.getVisitaVisita(this.idInquilino).snapshotChanges().pipe(takeUntil(this.unsubscribe)).subscribe(visitaDetalles => {
                visitaDetalles.map(deptoDetalle => {
                  const data: VisitaInterface = deptoDetalle.payload.doc.data() as VisitaInterface;
                  this.visitaLocal.id = deptoDetalle.payload.doc.id;
                  console.log("data:::::02" + deptoDetalle.payload.doc.id);
                  this.inquilinoLocal.checkIn = data.checkIn;
                  this.inquilinoLocal.checkOut = data.checkOut;
                  this.inquilinoLocal.idDepto = data.idDepto;
                  this.visitaLocal.fechaRegistro = new Date();
                  this.visitaLocal.checkIn = ddMMyyyy.toString();
                  this.visitaLocal.checkOut = '0';
                  this.visitaLocal.status = "1";
                  this.visitaLocal.idDepto = this.inquilinoLocal.idDepto;
                  this.visitaLocal.idUsuario = this.idInquilino;
                  //this.visitaDepto.addVisita(this.visitaLocal);
                  //this.backCheck();
                  //this.visitaDepto.addVisita( this.visitaLocal);
                });
              });
            });
          }
        } else {
          console.log("==Se crea un nuevo registro de visita checkIn 1-1 ==");
        }
      });
    });
    //this.router.navigate(["/menu"]).then(() => window.location.reload());
    
  }


  async checkOutVisita() {
    console.log('Inicia checkOutVisita()');
    this.idInquilino = this.route.snapshot.params['id'];
    var ddMMyyyy = this.datePipe.transform(new Date(), "dd-MM-yyyy hh:mm:ss ");
    var registro: Number;
    var flagSalida = true;

    this.visitaDepto.getVisitaVisitaCheckIn(this.idInquilino)
    
    this.visitaDepto.getVisitaVisitaCheckIn(this.idInquilino).snapshotChanges().pipe(takeUntil(this.unsubscribe)).subscribe(visitaDetallesCheckOut => {
      console.log('Inicia Busqueda Escucha'+visitaDetallesCheckOut.length);
      visitaDetallesCheckOut.map(visitaDetallesCheckOutRes => {
        registro = visitaDetallesCheckOut.length;
        console.log('registro'+registro);
        const dataVisita: VisitaInterface = visitaDetallesCheckOutRes.payload.doc.data() as VisitaInterface;
        if (registro > 0) {
          console.log('Registro::' + registro);
          if (dataVisita.checkIn == '0' && (dataVisita.checkOut == '0')) {
            console.log("== No puede registrar checkout sin Checkin ==");
            if(flagSalida == true){
              this.checkOutAlert();
              //flagSalida = false;
            }
          } else if (dataVisita.checkIn != '0' && (dataVisita.checkOut == '0')) {
            console.log("==Registrar checkOut ==");
            this.busquedaServ.getBusquedaInquilinoId(this.idInquilino).snapshotChanges().pipe(takeUntil(this.unsubscribe)).forEach(inquilinoDetalleRes => {
              this.inquilinoLocal = inquilinoDetalleRes.payload.data() as InquilinoInterface;
              this.visitaDepto.getVisitaVisita(this.idInquilino).snapshotChanges().pipe(takeUntil(this.unsubscribe)).subscribe(visitaDetalles => {
                visitaDetalles.map(deptoDetalle => {
                  const data: VisitaInterface = deptoDetalle.payload.doc.data() as VisitaInterface;
                  this.visitaLocal.id = deptoDetalle.payload.doc.id;
                  console.log("data:::::" + deptoDetalle.payload.doc.id);
                  this.inquilinoLocal.checkIn = data.checkIn;
                  this.inquilinoLocal.checkOut = data.checkOut;
                  this.inquilinoLocal.idDepto = data.idDepto;
                  this.inquilinoLocal.visita = '0';
                  this.visitaLocal.checkIn = data.checkIn;
                  this.visitaLocal.checkOut = ddMMyyyy.toString();
                  this.visitaLocal.status = "0";
                  this.visitaLocal.idDepto = this.inquilinoLocal.idDepto;
                  this.visitaLocal.idUsuario = this.idInquilino;
                  this.visitaDepto.updateVisita(this.visitaLocal.id, this.visitaLocal);
                  this.busquedaServ.updateBusquedaInqquilino(this.idInquilino, this.inquilinoLocal);
                  flagSalida = false;
                  this.router.navigate(["/menu"]);
                });
              });
            });
          } else if (dataVisita.checkIn != '0' && (dataVisita.checkOut != '0')) {
            console.log("==Manda Error porque se debe registrar un nuevo checkin con una nueva visita 1-1 ==");
            if(flagSalida == true){
              this.checkOutAlert();
              //flagSalida = false;
            }
          }
        }
      });
    });
    //this.router.navigate(["/menu"]).then(() => window.location.reload());
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