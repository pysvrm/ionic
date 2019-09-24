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
  selector: 'app-check-historico',
  templateUrl: './check-historico.page.html',
  styleUrls: ['./check-historico.page.scss'],
})
export class CheckHistoricoPage implements OnInit {

  inquilinoLocal: InquilinoInterface = {
    id: '',
    nombre: '',
    apellido: '',
    email: '',
    foto: '',
    idDepto: '',
    identificacion: '',
    telefono: '',
    tipo: '',
    visita: '',
    confianza: '',
    checkIn: '',
    checkOut: '',
    entra: ''
  };

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
      console.log("idInquilino==>" + this.idInquilino);
      console.log("inquilinoDetalleRes==>" + inquilinoDetalleRes);
      this.inquilinoLocal = inquilinoDetalleRes.payload.data() as InquilinoInterface;
      console.log('Nombre==>' + this.inquilinoLocal.nombre);
      console.log('Torre==>' + this.inquilinoLocal.torre);

      this.visitaDepto.getVisitaVisita(this.idInquilino).snapshotChanges().pipe(takeUntil(this.unsubscribe)).subscribe(visitaDetalles => {
        visitaDetalles.map(deptoDetalle => {
          console.log('Inicio obtener visita');
          const data: VisitaInterface = deptoDetalle.payload.doc.data() as VisitaInterface;
          console.log('data.chekIn' + data.checkIn);
          console.log('data.chekOut' + data.checkOut);
          this.inquilinoLocal.checkIn = data.checkIn;
          this.inquilinoLocal.checkOut = data.checkOut;
        });
      });
    });
  }

  backMenu() {
    this.router.navigate(["/menu"]);
  }

}
