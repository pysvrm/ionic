import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "../../servicios/auth.service";
import { BusquedaService } from "../../servicios/busqueda.service";
import { ChangeDetectionStrategy } from '@angular/compiler/src/core';
import { Observable } from 'rxjs';
import {InquilinoInterface} from '../../models/inquilino.interface'
import { AngularFirestoreCollection } from '@angular/fire/firestore';

@Component({
  selector: 'app-check',
  templateUrl: './check.page.html',
  styleUrls: ['./check.page.scss'],
})
export class CheckPage implements OnInit {

  //public inquilinos: Observable<inquilinoInterface>[];
  public  inquilinos : any =[];
  public  panelListaInquilinos : any =[];
  public inquilinosCollection:AngularFirestoreCollection<InquilinoInterface>;
  

  constructor(public authServices: AuthService, public router: Router, 
    public busquedaServ: BusquedaService) { }

  ngOnInit() {
    try {
      this.inquilinos =[];
      this.busquedaServ.getBusquedaVisita().snapshotChanges().subscribe(inquilinos => {
        inquilinos.map(inquilino => {
          const data: InquilinoInterface = inquilino.payload.doc.data() as InquilinoInterface;
          data.id = inquilino.payload.doc.id;
          console.log(data);
          this.inquilinos.push(data);
          this.panelListaInquilinos.push(data);
        });
      });
    } catch (error) {
      console.log('Imprime Error' + error);
    }
  }


  addVisita(inquilino : InquilinoInterface){
    return this.inquilinosCollection.add(inquilino);
  }

  getItems(ev: any) {
    const val = ev.target.value;
    if (val && val.trim() != '') {  
      this.panelListaInquilinos = this.panelListaInquilinos.filter((item) => {      
        return (item.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
    
  }

  onCancel(ev: any) {
    try {
      ev = ''
      this.panelListaInquilinos = this.inquilinos;
    } catch (error) {
      console.log('Imprime Error' + error);
    }
  }

  backMenu() {
    this.router.navigate(["/menu"]);
  }


}
