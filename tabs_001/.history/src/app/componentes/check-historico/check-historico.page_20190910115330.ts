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

  constructor(public router: Router) { }

  ngOnInit() {
  }

  backMenu() {
    this.router.navigate(["/menu"]);
  }

}
