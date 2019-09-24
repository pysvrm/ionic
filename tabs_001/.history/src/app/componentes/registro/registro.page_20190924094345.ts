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

    var promise1 = Promise.resolve(123);
  promise1.then(function(value) {
      
        this.busquedaServ.getBusquedaInquilinoNombre(this.inquilinoLocal.nombre, this.inquilinoLocal.apellido)
          .snapshotChanges().pipe(takeUntil(this.unsubscribe)).subscribe(inquilinoDetalleRes => {
            console.log('Detalle inquilinoDetalleRes::' + inquilinoDetalleRes.length);
            if (inquilinoDetalleRes.length > 0) {
              if (this.flag) {
                console.log('Ya existe un registro para ese usuario::' + this.inquilinoIdLocal.id);
                this.presentAlert();
                this.inquilinos = [];
                this.flag = true;
              }
  
            } else {
              this.deptoServ.getBusquedaDepto(this.inquilinoLocal.torre, this.inquilinoLocal.depto)
                .snapshotChanges().subscribe(deptoDetalleRes => {
                  deptoDetalleRes.map(async deptoDetalle => {
                    const data: deptoInterface = deptoDetalle.payload.doc.data() as deptoInterface;
                    this.inquilinoLocal.idDepto = deptoDetalle.payload.doc.id;
                    if (this.inquilinoLocal.entra == "1") {
                     
                      this.visitaLocal.checkIn = ddMMyyyy.toString();
                      this.visitaLocal.checkOut = "0";
                      this.visitaLocal.fechaRegistro = new Date();
                      this.inquilinoLocal.visita = "1";
  
                    } else if (this.inquilinoLocal.entra == "0") {
                     
                      this.visitaLocal.checkIn = "0";
                      this.visitaLocal.checkOut = "0";
                      this.visitaLocal.status ="0";
                      this.inquilinoLocal.visita = "0";
                    }
                    
                    this.flag = false;
                    this.idUsuario = await this.busquedaServ.addBusquedaInquilino(this.inquilinoLocal);
                    this.visitaLocal.idDepto = this.inquilinoLocal.idDepto;
                    this.visitaLocal.idUsuario = this.idUsuario;
                    /**
                     * Se había solicitado que no se generará con depto y torre pero se incluye para visualización posterior en la pantalla de visitas.
                     */
                    //this.inquilinoLocal.depto = null;
                    //this.inquilinoLocal.torre = null;
  
                    this.inquilinos = [];
                    this.visitaDepto.addVisita(this.visitaLocal);
                    this.router.navigate(["/menu"]).then(() => window.location.reload());
                  });
                });
              //this.router.navigate(["/menu"]);
            }
          });
      console.log(value);
    });
    
  

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
