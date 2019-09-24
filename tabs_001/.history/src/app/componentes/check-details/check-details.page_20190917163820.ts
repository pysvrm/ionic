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
export class CheckDetailsPage implements OnInit, OnDestroy {


  inquilinoLocal: InquilinoInterface = {} as InquilinoInterface;

  idInquilino = null;


  constructor(public authServices: AuthService, public router: Router, public alertController: AlertController, private datePipe: DatePipe,
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
          } else if (dataVisita.checkIn != '0' && (dataVisita.checkOut == '0')) {
            console.log("==Ya existe una visita con un checkIn 1-0 ==");
            this.checkInAlert();
          } else if (dataVisita.checkIn != '0' && (dataVisita.checkOut != '0')) {
            console.log("==Se crea un nuevo registro de visita checkIn 1-1 ==");
          }
        } else {
          console.log("==Se crea un nuevo registro de visita checkIn 1-1 ==");
        }
      });
    });
    //this.router.navigate(["/menu"]).then(() => window.location.reload());

  }


  async checkOutVisita() {
    this.idInquilino = this.route.snapshot.params['id'];
    var ddMMyyyy = this.datePipe.transform(new Date(), "dd-MM-yyyy hh:mm:ss ");
    var registro: Number;
    await this.visitaDepto.getVisitaVisitaCheckIn(this.idInquilino).snapshotChanges().pipe(takeUntil(this.unsubscribe)).subscribe(visitaDetallesCheckOut => {
      visitaDetallesCheckOut.map(visitaDetallesCheckOutRes => {
        registro = visitaDetallesCheckOut.length;
        const dataVisita: VisitaInterface = visitaDetallesCheckOutRes.payload.doc.data() as VisitaInterface;
        if (registro > 0) {
          console.log('Registro::' + registro);
          if (dataVisita.checkIn == '0' && (dataVisita.checkOut == '0')) {
            console.log("== No puede registrar checkout sin Checkin ==");
            this.checkOutAlert();
          } else if (dataVisita.checkIn != '0' && (dataVisita.checkOut == '0')) {
            console.log("==Registrar checkOut ==");

          } else if (dataVisita.checkIn != '0' && (dataVisita.checkOut != '0')) {
            console.log("==Manda Error porque se debe registrar un nuevo checkin con una nueva visita 1-1 ==");
            this.checkOutAlert();
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
    this.router.navigate(["/check"]);
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
