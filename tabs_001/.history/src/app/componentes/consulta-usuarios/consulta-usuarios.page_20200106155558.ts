import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-consulta-usuarios',
  templateUrl: './consulta-usuarios.page.html',
  styleUrls: ['./consulta-usuarios.page.scss'],
})
export class ConsultaUsuariosPage implements OnInit {

  constructor(public router:Router) { }

  ngOnInit() {
  }
  
  register(){
    this.router.navigate(["/check-consulta-usuarios"]);
  }

  check(){
    this.router.navigate(["/check-servicios"]);
  }

  backMenu() {
    this.router.navigate(["/menu"]);
  }

}
