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
  
  consultaUsuarios(){
    this.router.navigate(["/check-consulta-usuarios"]);
  }

  consultaAutomovil(){
    this.router.navigate(["/check-consulta-automovil"]);
  }

  backMenu() {
    this.router.navigate(["/menu"]);
  }

}
