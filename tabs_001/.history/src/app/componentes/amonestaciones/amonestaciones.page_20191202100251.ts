import { Component, OnInit, OnDestroy, ɵConsole } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "../../servicios/auth.service";
import { BusquedaService } from "../../servicios/busqueda.service";
import { ChangeDetectionStrategy } from '@angular/compiler/src/core';
import { Observable, Subject } from "rxjs";
import { InquilinoInterface } from '../../models/inquilino.interface'
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { map, takeUntil } from "rxjs/operators";
import { ServiciosInterface } from 'src/app/models/servicios.interface';
import { AmonestacionesInterface } from 'src/app/models/amonestacion.interface';
import { AmonestacionesService } from 'src/app/servicios/amonestaciones.service';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-amonestaciones',
  templateUrl: './amonestaciones.page.html',
  styleUrls: ['./amonestaciones.page.scss'],
  providers: [EmailComposer, DatePipe]
})
export class AmonestacionesPage implements OnDestroy, OnInit {
  public inquilinoLocal: InquilinoInterface = {} as InquilinoInterface;
  public amonestacionesLocal = {} as AmonestacionesInterface;
  public amonestacionesConsulta = {} as AmonestacionesInterface;
  public idInquilino = null;
  public inquilinos: any = [];
  public panelListaInquilinos: any = [];
  public inquilinosCollection: AngularFirestoreCollection<InquilinoInterface>;
  private unsubscribe: Subject<void> = new Subject();

  constructor(public authServices: AuthService, public router: Router, public route: ActivatedRoute,
    public busquedaServ: BusquedaService, public amonestacionesService: AmonestacionesService,
    private emailComposer: EmailComposer, private datePipe: DatePipe) { }


  ngOnInit() {
    this.idInquilino = this.route.snapshot.params['id'];
  }

  backMenu() {
    this.router.navigate(["/menu"]);
  }

  async registraAmonestacion() {
    var ddMMyyyy = this.datePipe.transform(new Date(), "dd-MM-yyyy hh:mm:ss ");
    await this.busquedaServ.getBusquedaInquilinoId(this.idInquilino).then(resInquilino => {
      this.inquilinoLocal = resInquilino.data() as InquilinoInterface;
      this.inquilinoLocal.id = resInquilino.id;
    });
    this.amonestacionesLocal.idUsuario = this.inquilinoLocal.id;

    console.log("this.inquilinoLocal.email::" + this.inquilinoLocal.email);
    if (this.amonestacionesLocal.acuerdo == undefined) {
      this.amonestacionesLocal.acuerdo = "Sin acuerdo";
    }
    let email = {
      to: this.inquilinoLocal.email,
      cc: 'admidecondominios@gmail.com',
      attachments: [
      ],
      subject: 'Amonestación Lerdo de tejada de estatus:' + this.amonestacionesLocal.tipo,
      body: "<br> Reporte:" + this.amonestacionesLocal.descripcion
        + "<br> Acuerdo:" + this.amonestacionesLocal.acuerdo,
      isHtml: true
    }
    console.log('Inicia registro de amonestacion');
    this.emailComposer.open(email);
    this.amonestacionesService.addAmonestaciones(this.amonestacionesLocal);
  }

  async actualizaAmonestacion() {
    console.log("this.amonestacionesLocal.id::" + this.amonestacionesLocal.id);
    await this.amonestacionesService.getBusquedaAmonestacionesId(this.amonestacionesLocal.id).then(regAmon => {
      this.amonestacionesConsulta = regAmon.data() as AmonestacionesInterface;
      this.amonestacionesLocal.id = regAmon.id;
    });
    this.amonestacionesService.updateAmonestaciones(this.amonestacionesLocal.id, this.amonestacionesLocal);
  }

  ngOnDestroy() {
    console.log('ngOnDestory');
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
