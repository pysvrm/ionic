import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "../../servicios/auth.service";
import { BusquedaService } from "../../servicios/busqueda.service";
import { ChangeDetectionStrategy } from '@angular/compiler/src/core';
import { Observable, Subject } from "rxjs";
import {InquilinoInterface} from '../../models/inquilino.interface'
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { map, takeUntil } from "rxjs/operators";

@Component({
  selector: 'app-check-historico',
  templateUrl: './check-historico.page.html',
  styleUrls: ['./check-historico.page.scss'],
})
export class CheckHistoricoPage implements OnInit {

  inquilinoLocal: InquilinoInterface = {} as InquilinoInterface;
  idInquilino = null;


  constructor(public authServices: AuthService, public router: Router, 
    public busquedaServ: BusquedaService) { }

  
    public  inquilinos : any =[];
    public  panelListaInquilinos : any =[];
    public inquilinosCollection:AngularFirestoreCollection<InquilinoInterface>;
    private unsubscribe: Subject<void> = new Subject();

  ngOnInit() {
    try {
      this.inquilinos =[];
      this.busquedaServ.getBusquedaVisitaAll().snapshotChanges().pipe(takeUntil(this.unsubscribe)).subscribe(inquilinos => {
        inquilinos.map(inquilino => {
          const data: InquilinoInterface = inquilino.payload.doc.data() as InquilinoInterface;
          data.id = inquilino.payload.doc.id;
          console.log(data);
          this.inquilinos.push(data);
          this.panelListaInquilinos.push(data);
        });
      });
    } catch (error) {
      console.log('Imprime Error' + error);
    }
  }


  backMenu() {
    this.router.navigate(["/menu"]);
  }

}
