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



@Component({
  selector: 'app-amonestaciones',
  templateUrl: './amonestaciones.page.html',
  styleUrls: ['./amonestaciones.page.scss'],
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
    public busquedaServ: BusquedaService, public amonestacionesService: AmonestacionesService) { }


    ngOnInit() {
      this.idInquilino = this.route.snapshot.params['id'];
    }

  backMenu() {
    this.router.navigate(["/menu"]);
  }

  registraVisitaInquilino() {
    this.amonestacionesService.addAmonestaciones(this.amonestacionesLocal);
  }

  actualizarVisitaInquilino() {
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
