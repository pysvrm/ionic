import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "../../servicios/auth.service";
import { BusquedaService } from "../../servicios/busqueda.service";
import { ChangeDetectionStrategy } from '@angular/compiler/src/core';
import { Observable, Subject } from "rxjs";
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { NavController, LoadingController, AlertController } from "@ionic/angular";
import { InquilinoInterface } from 'src/app/models/inquilino.interface';
import { VisitaInterface } from 'src/app/models/visita.interface';
import { VisitaService } from "../../servicios/visita.service";
import { map, takeUntil } from "rxjs/operators";
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-check-historico',
  templateUrl: './check-historico.page.html',
  styleUrls: ['./check-historico.page.scss'],
})
export class CheckHistoricoPage implements OnInit {

  inquilinoLocal: InquilinoInterface = {
    id: '',
    nombre: '',
    apellido: '',
    email: '',
    foto: '',
    idDepto: '',
    identificacion: '',
    telefono: '',
    tipo: '',
    visita: '',
    confianza: '',
    checkIn: '',
    checkOut: '',
    entra: ''
  };

  idInquilino = null;


  constructor(public authServices: AuthService, public router: Router, public alertController: AlertController,
    public busquedaServ: BusquedaService, public route: ActivatedRoute, private nav: NavController, private loadingController: LoadingController,
    public visitaDepto: VisitaService) { }

  
  //public inquilinos: Observable<inquilinoInterface>[];
  public  inquilinos : any =[];
  public  panelListaInquilinos : any =[];
  public inquilinosCollection:AngularFirestoreCollection<InquilinoInterface>;

    ngOnInit() {
      try {
        this.inquilinos =[];
        this.busquedaServ.getBusquedaVisitaAll().snapshotChanges().subscribe(inquilinos => {
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
