import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "../../servicios/auth.service";



@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  constructor(public authServices: AuthService, public router:Router) { }

  ngOnInit() {
  }

  register(){
    this.router.navigate(["/registro"]);
  }

  check(){
    this.router.navigate(["/check"]);
  }

  services(){
    this.router.navigate(["/servicios"]);
  }

  OnLogout(){
    this.authServices.logout();
  }


  
}
