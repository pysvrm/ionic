import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "../../servicios/auth.service";
import { DatePipe } from '@angular/common';



@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  providers:[DatePipe]
})
export class MenuPage implements OnInit {

  constructor(public authServices: AuthService, public router:Router,  private datePipe: DatePipe) { 
    var ddMMyyyy = this.datePipe.transform(new Date(),"dd-MM-yyyy HH:mm:ss "); 
    console.log(ddMMyyyy);
  }

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
