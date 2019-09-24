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

  ngOnDestroy(): void {
    console.log('ngOnDestory');
    this.unsubscribe.next();
    this.unsubscribe.complete();
    throw new Error("Method not implemented.");
  }

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
    var ddMMyyyy = this.datePipe.transform(new Date(), "dd-MM-yyyy hh:MM:ss ");
    var idInquilino: string;
    try {
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
                  if (this.inquilinoLocal.tipo == 'Inquilino') {
                    this.inquilinoLocal.visita = null;
                  } else {
                    this.inquilinoLocal.visita = '1';
                  }
                  this.flag = false;
                  console.log('Inicia inserción');
                  this.idUsuario = await this.busquedaServ.addBusquedaInquilino(this.inquilinoLocal);
                  console.log('Inicia inserción id' + this.idUsuario);
                  console.log('Fecha format' + ddMMyyyy.toString());
                  if (this.inquilinoIdLocal.entra == 'true') {
                    console.log('Entra a checar fecha y hora');
                    this.visitaLocal.checkIn = ddMMyyyy.toString();
                    this.visitaLocal.checkOut = '0';
                  } else {
                    this.visitaLocal.checkIn = '0';
                    this.visitaLocal.checkOut = '0';
                  }

                  this.visitaLocal.idDepto = this.inquilinoLocal.idDepto;
                  this.visitaLocal.idUsuario = this.idUsuario;
                  console.log('ID de departamento' + this.inquilinoLocal.idDepto);
                  /**
                   * Se había solicitado que no se generará con depto y torre pero se incluye para visualización posterior en la pantalla de visitas.
                   */
                  //this.inquilinoLocal.depto = null;
                  //this.inquilinoLocal.torre = null;

                  this.inquilinos = [];
                  //this.visitaDepto.addVisita(this.visitaLocal);
                  //this.router.navigate(["/menu"]).then(() => window.location.reload());
                });
              });
            //this.router.navigate(["/menu"]);
          }
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
    this.router.navigate(["/menu"]).then(() => window.location.reload());
  }

}
