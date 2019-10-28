import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "../../servicios/auth.service";

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.page.html',
  styleUrls: ['./servicios.page.scss'],
})
export class ServiciosPage implements OnInit {


  constructor(public authServices: AuthService, public router:Router) { }

  ngOnInit() {
  }

  backMenu(){
    this.router.navigate(["/menu"]);
  }

}
