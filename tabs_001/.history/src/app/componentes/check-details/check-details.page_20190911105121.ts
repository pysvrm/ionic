import { Component, OnInit } from '@angular/core';
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
export class CheckDetailsPage implements OnInit {


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
    console.log("==Inicio checkin==")
    this.visitaDepto.getVisitaVisitaCheckIn(this.idInquilino).snapshotChanges().pipe(takeUntil(this.unsubscribe)).subscribe(visitaDetallesCheckIn => {
      visitaDetallesCheckIn.map(visitaDetallesCheckInRes => {

        const dataVisita: VisitaInterface = visitaDetallesCheckInRes.payload.doc.data() as VisitaInterface;
        if (visitaDetallesCheckIn.length > 0) {

          if (dataVisita.status == "0" && dataVisita.checkIn != "0") {
            this.checkInAlert();
            this.visitaDepto.addVisita(this.visitaLocal);
          } else if (dataVisita.status == "0" && dataVisita.checkIn == "0") {
            //Dejar Hacer ChekIn
            
            this.busquedaServ.getBusquedaInquilinoId(this.idInquilino).snapshotChanges().forEach(inquilinoDetalleRes => {
              this.inquilinoLocal = inquilinoDetalleRes.payload.data() as InquilinoInterface;
              
              this.visitaDepto.getVisitaVisita(this.idInquilino).snapshotChanges().pipe(takeUntil(this.unsubscribe)).subscribe(visitaDetalles => {
                visitaDetalles.map(deptoDetalle => {
                  const data: VisitaInterface = deptoDetalle.payload.doc.data() as VisitaInterface;
                  console.log("data:::::::"+data.id);
                  this.inquilinoLocal.checkIn = data.checkIn;
                  this.inquilinoLocal.checkOut = data.checkOut;
                  this.inquilinoLocal.idDepto = data.idDepto;
                  this.visitaLocal.checkIn = ddMMyyyy.toString();
                  this.visitaLocal.checkOut = '0';
                  this.visitaLocal.idDepto = this.inquilinoLocal.idDepto;
                  this.visitaLocal.idUsuario = this.idInquilino;
                  this.visitaDepto.updateVisita(data.id, this.visitaLocal);
                  this.router.navigate(["/menu"]).then(() => window.location.reload());
                });
              });
            });
          }
        } else {

          this.busquedaServ.getBusquedaInquilinoId(this.idInquilino).snapshotChanges().forEach(inquilinoDetalleRes => {
            this.inquilinoLocal = inquilinoDetalleRes.payload.data() as InquilinoInterface;
            this.visitaLocal.checkIn = ddMMyyyy.toString();
            this.visitaLocal.checkOut = "0";
            this.visitaLocal.status = "0";
            this.inquilinoLocal.visita = "1";
            this.visitaLocal.idDepto = this.inquilinoLocal.idDepto;
            this.visitaLocal.idUsuario = this.idInquilino;
            this.visitaDepto.addVisita(this.visitaLocal);
          });
        }
      });
    });
    console.log('CheckOut' + this.idInquilino);

  } 


  async checkOutVisita() {
    this.idInquilino = this.route.snapshot.params['id'];
    var ddMMyyyy = this.datePipe.transform(new Date(), "dd-MM-yyyy hh:mm:ss ");
    this.visitaDepto.getVisitaVisitaCheckIn(this.idInquilino).snapshotChanges().pipe(takeUntil(this.unsubscribe)).subscribe(visitaDetallesCheckOut => {
      visitaDetallesCheckOut.map(visitaDetallesCheckOutRes => {

        const dataVisita: VisitaInterface = visitaDetallesCheckOutRes.payload.doc.data() as VisitaInterface;

        if (visitaDetallesCheckOut.length > 0) {

          this.busquedaServ.getBusquedaInquilinoId(this.idInquilino).snapshotChanges().forEach(inquilinoDetalleRes => {
            this.inquilinoLocal = inquilinoDetalleRes.payload.data() as InquilinoInterface;

            this.visitaDepto.getVisitaVisita(this.idInquilino).snapshotChanges().pipe(takeUntil(this.unsubscribe)).subscribe(visitaDetalles => {
              visitaDetalles.map(deptoDetalle => {

                const data: VisitaInterface = deptoDetalle.payload.doc.data() as VisitaInterface;
                this.inquilinoLocal.checkIn = data.checkIn;
                this.inquilinoLocal.checkOut = data.checkOut;
                this.inquilinoLocal.idDepto = data.idDepto;
                this.inquilinoLocal.visita = "0";
                this.visitaLocal.checkIn = data.checkIn.toString();
                this.visitaLocal.checkOut = ddMMyyyy.toString();
                this.visitaLocal.idDepto = this.inquilinoLocal.idDepto;
                this.visitaLocal.idUsuario = this.idInquilino;

                this.visitaDepto.updateVisita(deptoDetalle.payload.doc.id.toString(), this.visitaLocal);
                this.busquedaServ.updateBusquedaInqquilino(this.idInquilino, this.inquilinoLocal);
                //this.router.navigate(["/menu"]).then(() => window.location.reload());
              });
            });

          });
        } else if (visitaDetallesCheckOut.length <= 0) {
          console.log('Existe un checkin sin checkout ');
          this.checkOutAlert();
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
