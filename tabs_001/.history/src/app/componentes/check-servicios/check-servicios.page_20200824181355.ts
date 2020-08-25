import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "../../servicios/auth.service";
import { BusquedaService } from "../../servicios/busqueda.service";
import { InquilinoService  } from "../../servicios/inquilino.service";
import { ChangeDetectionStrategy } from '@angular/compiler/src/core';
import { Observable, Subject } from "rxjs";
import {InquilinoInterface} from '../../models/inquilino.interface'
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { map, takeUntil } from "rxjs/operators";
import { ServiciosInterface } from 'src/app/models/servicios.interface';

@Component({
  selector: 'app-check-servicios',
  templateUrl: './check-servicios.page.html',
  styleUrls: ['./check-servicios.page.scss'],
})
export class CheckServiciosPage implements OnDestroy, OnInit {

  public  inquilinos : any =[];
  public  panelListaInquilinos : any =[];
  public inquilinosCollection:AngularFirestoreCollection<InquilinoInterface>;
  private unsubscribe: Subject<void> = new Subject();
  

  constructor(public authServices: AuthService,
              public router: Router,
              public inquilonoServ: InquilinoService
              ) { }

  ngOnInit() {
    try {
      this.inquilinos =[];
      this.inquilonoServ.buscaInquilinoTipo().snapshotChanges().pipe(takeUntil(this.unsubscribe)).subscribe(inquilinos => {
        inquilinos.map(inquilino => {
          const data: InquilinoInterface = inquilino.payload.doc.data() as InquilinoInterface;
          data.id = inquilino.payload.doc.id;
          console.log(data);
          console.log(data.id);
          this.inquilinos.push(data);
          this.panelListaInquilinos.push(data);
        });
      });
    } catch (error) {
      console.log('Imprime Error' + error);
    }
  }


  addVisita(inquilino : InquilinoInterface){
    return this.inquilinosCollection.add(inquilino);
  }

  getItems(ev: any) {
    const val = ev.target.value;
    if (val && val.trim() != '') {  
      this.panelListaInquilinos = this.panelListaInquilinos.filter((item) => {      
        return (item.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
    
  }

  onCancel(ev: any) {
    try {
      ev = ''
      this.panelListaInquilinos = this.inquilinos;
    } catch (error) {
      console.log('Imprime Error' + error);
    }
  }

  backMenu() {
    this.router.navigate(["/menu"]);
  }

  ngOnDestroy() {
    console.log('ngOnDestory');
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}

