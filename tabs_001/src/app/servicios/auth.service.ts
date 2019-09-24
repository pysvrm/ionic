import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { promised, reject } from 'q';
import { Router } from "@angular/router";
import { auth } from 'firebase';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private aFauth: AngularFireAuth, private router: Router) { }

  login (email:string, password:string){
    
    return  new Promise((resolve, rejected)=>{
      this.aFauth.auth.signInWithEmailAndPassword(email,password).then(user=> {
        resolve(user);
        console.log(user)
      }).catch(err => rejected(err))
    });
    
  }


  logout(){
    this.aFauth.auth.signOut().then(() =>{
      this.router.navigate(['./login']);
    })
  }
}
