import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "../../servicios/auth.service";
import { ServiciosInterface } from 'src/app/models/servicios.interface';
import { CheckServiciosService } from "../../servicios/check-servicios.service";
import { DatePipe } from '@angular/common';
import { NavController, LoadingController, AlertController } from "@ionic/angular";
import undefined = require('firebase/empty-import');


@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.page.html',
  styleUrls: ['./servicios.page.scss'],
  providers: [DatePipe]
})
export class ServiciosPage implements OnInit {

  idInquilino = null;
  constructor(public authServices: AuthService, public alertController: AlertController, public router: Router, public route: ActivatedRoute, public servicioCheckServicios: CheckServiciosService, private datePipe: DatePipe) { }

  ngOnInit() {
    this.idInquilino = this.route.snapshot.params['id'];
  }

  public checkServicios = {} as ServiciosInterface;

  backMenu() {
    this.router.navigate(["/check-servicios"]);
  }

  async addServicio(servicio: string) {
    var ddMMyyyy = this.datePipe.transform(new Date(), "dd-MM-yyyy hh:mm:ss ");
    console.log("idInquilino:" + this.idInquilino);
    this.checkServicios.fechaCheckin = ddMMyyyy;
    this.checkServicios.idUsuario = this.idInquilino;
    this.checkServicios.tipo = servicio;
    var cuenta: String = this.checkServicios.obcervaciones;
    if(cuenta == undefined){
      console.log("cuenta::"+cuenta);
      cuenta="";
    }
    if (this.checkServicios.tipo == 'otro') {
      if (cuenta.length <= 0) {
        console.log("Inicio de validacion::" + cuenta.length);
        this.obcervacionesAlert();
      } else {
        this.servicioCheckServicios.addCheckServicios(this.checkServicios);
        this.backMenu();
      }
    } else {
      const validaInserta = await this.servicioCheckServicios.validaFechaCheckServicios(this.checkServicios);
      if (validaInserta == 'false') {
        this.servicioCheckServicios.addCheckServicios(this.checkServicios);
        this.backMenu();
      } else {
        this.checkInAlert();
      }
    }
    
  }

  async checkInAlert() {
    const alert = await this.alertController.create({
      header: '¡Error!',
      subHeader: 'Entrada invalida',
      message: 'Ya existe una registro de este mes.',
      buttons: ['OK']
    });
    await alert.present();
  }

  async obcervacionesAlert() {
    const alert = await this.alertController.create({
      header: '¡Error!',
      subHeader: 'Entrada invalida',
      message: 'Requiere agregar obcervaciones.',
      buttons: ['OK']
    });

    await alert.present();
  }
}
