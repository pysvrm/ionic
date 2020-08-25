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
  selector: 'app-check-consulta-usuarios',
  templateUrl: './check-consulta-usuarios.page.html',
  styleUrls: ['./check-consulta-usuarios.page.scss'],
})
export class CheckConsultaUsuariosPage implements OnDestroy, OnInit {
 
  public  inquilinos : any =[];
  public  panelListaInquilinos : any =[];
  public inquilinosCollection:AngularFirestoreCollection<InquilinoInterface>;
  private unsubscribe: Subject<void> = new Subject();

  constructor(public authServices: AuthService, 
              public router: Router, 
              public busquedaServ: BusquedaService,
              public inquilonoServ: InquilinoService) { }

  public ngOnInit() {
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

  public  backMenu() {
    try {
      this.router.navigate(["/menu"]);
    } catch (e) {
      console.log('Imprime Error' + e);
    }
    
  }

  public ngOnDestroy() {
    console.log('ngOnDestory');
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
