import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { Observable, Subject } from "rxjs";
import { map, takeUntil } from "rxjs/operators";
import { AuthService } from "../../servicios/auth.service";
import { BusquedaService } from "../../servicios/busqueda.service";
import { DeptoService } from "../../servicios/depto.service";
import { VisitaService } from "../../servicios/visita.service";
import { InquilinoInterface } from '../../models/inquilino.interface'
import { deptoInterface } from '../../models/depto.interface'
import { NavController, LoadingController, AlertController } from "@ionic/angular";
import { VisitaInterface } from 'src/app/models/visita.interface';
import { DatePipe } from '@angular/common';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  providers: [DatePipe]
})


export class RegistroPage implements OnInit, OnDestroy {

 

  public inquilinoLocal = {} as InquilinoInterface;
  public inquilinoIdLocal = {} as InquilinoInterface;
  public deptoLocal = {} as deptoInterface;
  public visitaLocal = {} as VisitaInterface;
  public idUsuario: string;
  private inquilinosCollection: AngularFirestoreCollection<InquilinoInterface>;
  public inquilinos: any = [];
  private unsubscribe: Subject<void> = new Subject();
  public flag: boolean = true;


  constructor(public authServices: AuthService, public router: Router,
    public busquedaServ: BusquedaService, public deptoServ: DeptoService,
    private loadingController: LoadingController, public alertController: AlertController,
    public visitaDepto: VisitaService, private datePipe: DatePipe) {
    this.inquilinos = [];

  }

  ngOnInit() {
    this.inquilinos = [];
  }

  async registraVisitaInquilino() {
    var ddMMyyyy = this.datePipe.transform(new Date(), "dd-MM-yyyy hh:mm:ss ");
    var idInquilino: string;
    try {
      this.busquedaServ.getBusquedaInquilinoNombre(this.inquilinoLocal.nombre, this.inquilinoLocal.apellido).then(res => {
        console.log('Entra a validar=>'+res);
        if(res.docs.length == 0){
          //no documents found
        }else{
          //you got some documents
          res.forEach(shop => {
            console.log("id====>"+shop.id);
            console.log("Objeto====>"+shop.data());
            this.inquilinoLocal = shop.data() as InquilinoInterface;
            console.log("inquilino local::"+this.inquilinoLocal.email);
          })
        }
      }).catch(err => {
        console.log('something went wrong '+ err)
      });
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
    //this.router.navigate(["/menu"]).then(() => window.location.reload());
    this.router.navigate(["/menu"]);
  }

  ngOnDestroy() {
    console.log('ngOnDestory');
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
