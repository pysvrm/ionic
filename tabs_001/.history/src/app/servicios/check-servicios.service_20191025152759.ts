import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { ServiciosInterface } from '../models/servicios.interface'

@Injectable({
  providedIn: 'root'
})
export class CheckServiciosService {

  private checkServiciosCollection: AngularFirestoreCollection<ServiciosInterface>;
  private idCheckServicio : string;
  constructor(private db: AngularFirestore) {
    this.checkServiciosCollection = db.collection('sirv_t_checkServicios');
   }


   async addBusquedaInquilino(checkServicio: ServiciosInterface ){
    await this.checkServiciosCollection.ref.add(checkServicio).then(ref =>{
      console.log('Referencia id=>'+ ref.id);
      this.idCheckServicio = ref.id;
    });
    return this.idCheckServicio;
    }
}
