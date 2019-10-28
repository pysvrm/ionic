import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "../../servicios/auth.service";
import { ServiciosInterface } from 'src/app/models/servicios.interface';
import { CheckServiciosService } from "../../servicios/check-servicios.service";
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.page.html',
  styleUrls: ['./servicios.page.scss'],
})
export class ServiciosPage implements OnInit {

  idInquilino = null;
  constructor(public authServices: AuthService, public router: Router,public route: ActivatedRoute, public servicioCheckServicios: CheckServiciosService, private datePipe: DatePipe) { }

  ngOnInit() {
    this.idInquilino = this.route.snapshot.params['id'];
  }

  public checkServicios = {} as ServiciosInterface;

  backMenu() {
    this.router.navigate(["/check-servicios"]);
  }

  addServicio(servicio: string) {
    var ddMMyyyy = this.datePipe.transform(new Date(), "dd-MM-yyyy hh:mm:ss ");
    console.log("idInquilino:" + this.idInquilino);
    switch (servicio) {
      case 'agua': {
        console.log("Servicio check:" + servicio);
        this.checkServicios.fechaCheckin = ddMMyyyy;
        this.checkServicios.tipo = servicio;
        break;
      }
      case 'luz': {
        console.log("Servicio check:" + servicio);
        this.checkServicios.tipo = servicio;
        break;
      }
      case 'gas': {
        console.log("Servicio check:" + servicio);
        this.checkServicios.tipo = servicio;
        break;
      }
      case 'otro': {
        console.log("Servicio check:" + servicio);
        this.checkServicios.tipo = servicio;
        break;
      }
      default: {
        console.log("Servicio check:" + servicio);
        this.checkServicios.tipo = servicio;
        break;
      }
    }
    this.servicioCheckServicios.addCheckServicios(this.checkServicios);
  }

}
