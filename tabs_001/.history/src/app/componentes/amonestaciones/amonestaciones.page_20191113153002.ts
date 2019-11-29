import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router,ActivatedRoute } from "@angular/router";
import { AuthService } from "../../servicios/auth.service";
import { BusquedaService } from "../../servicios/busqueda.service";
import { ChangeDetectionStrategy } from '@angular/compiler/src/core';
import { Observable, Subject } from "rxjs";
import {InquilinoInterface} from '../../models/inquilino.interface'
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { map, takeUntil } from "rxjs/operators";
import { ServiciosInterface } from 'src/app/models/servicios.interface';
import { AmonestacionesInterface } from 'src/app/models/amonestacion.interface';
import { AmonestacionesService } from 'src/app/servicios/amonestaciones.service';
import { EmailComposer } from '@ionic-native/email-composer/ngx';


@Component({
  selector: 'app-amonestaciones',
  templateUrl: './amonestaciones.page.html',
  styleUrls: ['./amonestaciones.page.scss'],
  providers: [EmailComposer]
})
export class AmonestacionesPage implements OnDestroy, OnInit {
 
  public amonestacionesLocal = {} as AmonestacionesInterface;
  public amonestacionesConsulta = {} as AmonestacionesInterface;
  public idInquilino = null;
  public inquilinos : any =[];
  public panelListaInquilinos : any =[];
  public inquilinosCollection:AngularFirestoreCollection<InquilinoInterface>;
  private unsubscribe: Subject<void> = new Subject();

  constructor(public authServices: AuthService, public router: Router,public route: ActivatedRoute, 
    public busquedaServ: BusquedaService, public amonestacionesService: AmonestacionesService,
    private emailComposer: EmailComposer) { }


    ngOnInit() {
      this.idInquilino = this.route.snapshot.params['id'];
    }

  backMenu() {
    this.router.navigate(["/menu"]);
  }

  registraAmonestacion() {
  console.log('Inicia registro de amonestacion');  
    let email = {
      to: 'vladimir.rodriguez@ferromex.mx',
      cc: 'vrodriguezmtz@hotmail.com',
      bcc: ['john@doe.com', 'jane@doe.com'],
      attachments: [
        'file://img/logo.png',
        'res://icon.png',
        'base64:icon.png//iVBORw0KGgoAAAANSUhEUg...',
        'file://README.pdf'
      ],
      subject: 'Cordova Icons',
      body: 'How are you? Nice greetings from Leipzig',
      isHtml: true
    };
    
    this.emailComposer.isAvailable().then((available: boolean) =>{
      if(available) {
        
      }
    });
    this.emailComposer.open(email);
    this.amonestacionesService.addAmonestaciones(this.amonestacionesLocal);
  }

  actualizaAmonestacion() {
    this.amonestacionesService.getBusquedaAmonestacionesId(this.amonestacionesLocal.id).then(regAmon =>{
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
