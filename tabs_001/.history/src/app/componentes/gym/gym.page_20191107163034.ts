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
  selector: 'app-gym',
  templateUrl: './gym.page.html',
  styleUrls: ['./gym.page.scss'],
  providers: [DatePipe]
})
export class GymPage implements OnDestroy, OnInit {


  inquilinoLocal: InquilinoInterface = {} as InquilinoInterface;
  visitaVisitaLocal: VisitaInterface = {} as VisitaInterface;
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
    await this.visitaDepto.getVisitaVisita(this.idInquilino).then(regVisitaVisita => {
      regVisitaVisita.forEach(resVisitaVisita => {
        this.visitaVisitaLocal = resVisitaVisita.data() as VisitaInterface;
        this.visitaVisitaLocal.id = resVisitaVisita.id;
      });
    });

    console.log("==this.idInquilino==" + this.inquilinoLocal.nombre);
    console.log("==this.visitaLocal.id==" + this.visitaVisitaLocal.id);
    this.inquilinoLocal.checkIn = this.visitaVisitaLocal.checkIn;
    this.inquilinoLocal.checkOut = this.visitaVisitaLocal.checkOut;
    loading.dismiss();
  }


}
