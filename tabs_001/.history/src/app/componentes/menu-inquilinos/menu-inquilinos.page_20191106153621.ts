import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "../../servicios/auth.service";
import { ServiciosInterface } from 'src/app/models/servicios.interface';
import { CheckServiciosService } from "../../servicios/check-servicios.service";
import { DatePipe } from '@angular/common';
import { NavController, LoadingController, AlertController } from "@ionic/angular";
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-menu-inquilinos',
  templateUrl: './menu-inquilinos.page.html',
  styleUrls: ['./menu-inquilinos.page.scss'],
})
export class MenuInquilinosPage  implements OnDestroy, OnInit {

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}
