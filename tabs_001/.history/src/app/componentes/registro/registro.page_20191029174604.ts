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

      if (registrosUsuario > 0) {
        this.presentAlert();
      } else {
        console.log("Generar Registro");
        await this.deptoServ.getBusquedaDeptoAsync(this.inquilinoLocal.torre, this.inquilinoLocal.depto).then(resDept => {
          console.log('Entra a validar=>' + resDept);
          registrosUsuario = resDept.docs.length;
          resDept.forEach(resDeptUnit => {
            this.deptoLocal = resDeptUnit.data() as deptoInterface;
            console.log('resDeptUnit.data()' + resDeptUnit.id);
            this.deptoLocal.id = resDeptUnit.id;
          });
        });

        if (this.inquilinoLocal.entra == "1") {
          this.visitaLocal.checkIn = ddMMyyyy.toString();
          this.visitaLocal.checkOut = "0";
          this.visitaLocal.fechaRegistro = new Date();
          this.inquilinoLocal.visita = "1";
        } else if (this.inquilinoLocal.entra == "0") {
          this.visitaLocal.checkIn = "0";
          this.visitaLocal.checkOut = "0";
          this.visitaLocal.status = "0";
          this.inquilinoLocal.visita = "0";
        }
    
        console.log("this.deptoLocal.id"+this.deptoLocal.id);
        this.idUsuario = await this.busquedaServ.addBusquedaInquilino(this.inquilinoLocal);
        this.visitaLocal.idDepto = this.deptoLocal.id;
        this.visitaLocal.idUsuario = this.idUsuario;
        this.inquilinos = [];
        this.visitaDepto.addVisita(this.visitaLocal);

        if(this.inquilinoLocal.tipo =="Inquilino"){
          this.deptoLocal.torre= this.inquilinoLocal.torre;
          this.deptoLocal.depto = this.inquilinoLocal.depto;
          this.deptoLocal.idPropietario = this.idUsuario;
          this.deptoServ.updateDepartamento(this.deptoLocal);
        }

        this.router.navigate(["/menu"]);
        }

      
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