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

  constructor(public authServices: AuthService, public alertController: AlertController, public router: Router, public route: ActivatedRoute, public servicioCheckServicios: CheckServiciosService) { }

  idInquilino = null;
  ngOnInit() {
    this.idInquilino = this.route.snapshot.params['id'];
  }

  ngOnDestroy() {
  }

  servicios() {
    this.router.navigate(["/check-servicios",this.idInquilino]);
  }

  gym() {
    this.router.navigate(["/gym-servicios"]);
  }

  amonestaciones() {
    this.router.navigate(["/amonestaciones-servicios"]);
  }

  backMenu() {
    this.router.navigate(["/menu"]);
  }
}
