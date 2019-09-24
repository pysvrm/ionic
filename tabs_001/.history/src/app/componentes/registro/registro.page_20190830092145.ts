import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { Observable,Subscription, SubscriptionLike, Subject} from "rxjs";
import { map, takeUntil } from "rxjs/operators";
import { AuthService } from "../../servicios/auth.service";
import { BusquedaService } from "../../servicios/busqueda.service";
import { DeptoService } from "../../servicios/depto.service";
import { VisitaService } from "../../servicios/visita.service";
import { InquilinoInterface } from '../../models/inquilino.interface'
import { deptoInterface } from '../../models/depto.interface'
import { NavController, LoadingController, AlertController } from "@ionic/angular";

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})


export class RegistroPage implements OnDestroy,OnInit{

  public inquilinoLocal = {} as InquilinoInterface;
  public inquilinoIdLocal = {} as InquilinoInterface;
  public deptoLocal = {} as deptoInterface;
  private inquilinosCollection: AngularFirestoreCollection<InquilinoInterface>;
  private subscription: SubscriptionLike;
  public inquilinos: any = [];
  private unsubscribe: Subject<void> = new Subject();
  public validaTamanio: string;

  constructor(public authServices: AuthService, public router: Router,
    public busquedaServ: BusquedaService, public deptoServ: DeptoService,
    private loadingController: LoadingController, public alertController: AlertController) {
    this.inquilinos = [];

  }

  ngOnInit() {
    this.inquilinos = [];
  }

  ngOnDestroy(){
    //this.subscription.unsubscribe();
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  async registraVisitaInquilino() {
    let date: Date = new Date();
    try {
      //this.subscription = 
      await this.busquedaServ.getBusquedaInquilinoNombre(this.inquilinoLocal.nombre, this.inquilinoLocal.apellido)
      .snapshotChanges().pipe(takeUntil(this.unsubscribe))
      .subscribe(inquilinoDetalleRes => {
        console.log('Detalle inquilinoDetalleRes::' + inquilinoDetalleRes.length);
        this.validaTamanio = inquilinoDetalleRes.length.toString();
        this.inquilinoIdLocal = inquilinoDetalleRes. as InquilinoInterface;
        console.log('validaTamanio::' + this.validaTamanio);
      });
      console.log('validaTamanio::' + this.validaTamanio);
    } catch (error) {
      console.log('Error' + error);
    }


  }


  async presentAlert() {
    const alert = await this.alertController.create({
      header: '¡Error!',
      subHeader: 'Registro duplicado',
      message: 'Ya existe un usuario con este nombre.',
      buttons: ['OK']
    });

    await alert.present();
  }

  backMenu() {
    this.router.navigate(["/menu"]);
  }

}
