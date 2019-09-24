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
    var registrosUsuario: number;
    this.inquilinoIdLocal = null;
    try {
      await this.busquedaServ.getBusquedaInquilinoNombre(this.inquilinoLocal.nombre, this.inquilinoLocal.apellido).then(resReg => {
        console.log('Entra a validar=>' + resReg);
        registrosUsuario = resReg.docs.length;
        resReg.forEach(resRegUnit => {
          this.inquilinoIdLocal = resRegUnit.data() as InquilinoInterface;
          console.log('resRegUnit.id=>' + resRegUnit.id);
          this.inquilinoIdLocal.id = resRegUnit.id;
        });
      });



      if(registrosUsuario>0){
        this.presentAlert();
      }else{
        console.log("Generar Registro");
        await this.deptoServ.getBusquedaDeptoAsync(this.inquilinoLocal.torre, this.inquilinoLocal.depto).then(resDept => {
          console.log('Entra a validar=>' + resDept);
          registrosUsuario = resDept.docs.length;
          resDept.forEach(resDeptUnit => {
            this.deptoLocal = resDeptUnit.data() as deptoInterface;
            
            this.deptoLocal.id = resDeptUnit.id;
          });
        });








      }
      console.log("inquilino local 02::" + this.inquilinoIdLocal.id);
      console.log("inquilino local 03::" + this.deptoLocal.id);
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
