import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "../../servicios/auth.service";
import { BusquedaService } from "../../servicios/busqueda.service";
import { ChangeDetectionStrategy } from '@angular/compiler/src/core';
import { Observable, Subject } from "rxjs";
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { NavController, LoadingController } from "@ionic/angular";
import { InquilinoInterface } from 'src/app/models/inquilino.interface';
import { VisitaInterface } from 'src/app/models/visita.interface';
import { VisitaService } from "../../servicios/visita.service";
import { map, takeUntil } from "rxjs/operators";



@Component({
  selector: 'app-check-details',
  templateUrl: './check-details.page.html',
  styleUrls: ['./check-details.page.scss'],
})
export class CheckDetailsPage implements OnInit {


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
    visita: ''
  };

  idInquilino = null;


  constructor(public authServices: AuthService, public router: Router,
  
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

  ngOnDestroy(): void {
    console.log('ngOnDestory');
    this.unsubscribe.next();
    this.unsubscribe.complete();
    throw new Error("Method not implemented.");
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
          console.log('data.chekIn'+ data.chekIn);
          console.log('data.chekOut'+ data.chekOut);
          this.inquilinoLocal.checkIn = data.chekIn;
          this.inquilinoLocal.checkOut = data.chekOut;
        });
      });
    });
  }


  async checkInVisita() {
    this.idInquilino = this.route.snapshot.params['id'];
    console.log('CheckIn'+this.idInquilino);
    
  }

  async checkOutVisita() {
    this.idInquilino = this.route.snapshot.params['id'];


    this.visitaDepto.getVisitaVisitaCheckIn(this.idInquilino).snapshotChanges().pipe(takeUntil(this.unsubscribe)).subscribe(visitaDetallesCheckIn => {
      visitaDetallesCheckIn.map(visitaDetallesCheckInRes => {
        console.log('Inicio obtener visita');
        const data: VisitaInterface = visitaDetallesCheckInRes.payload.doc.data() as VisitaInterface;
        
        if(data.chekIn != '' && (data.chekOut != '')){
          console.log('Se puede hacer el '+ data.chekIn);

        }
        
     
      });
    });


    this.visitaDepto.addVisita(this.visitaLocal);
    console.log('CheckOut'+this.idInquilino);
    
  }

  async saveInquilino() {
    const loading = await this.loadingController.create({
      message: 'Loading ...'
    });
    await loading.present();
    if (this.idInquilino) {
      loading.dismiss();
      this.busquedaServ.updateBusquedaInqquilino(this.inquilinoLocal, this.idInquilino);
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
}
