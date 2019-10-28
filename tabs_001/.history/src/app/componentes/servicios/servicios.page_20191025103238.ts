import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "../../servicios/auth.service";
import { ServiciosInterface } from 'src/app/models/servicios.interface';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.page.html',
  styleUrls: ['./servicios.page.scss'],
})
export class ServiciosPage implements OnInit {


  constructor(public authServices: AuthService, public router:Router) { }

  ngOnInit() {
  }

  public checkServicios= {} as ServiciosInterface;

  backMenu(){
    this.router.navigate(["/check-servicios"]);
  }

}
