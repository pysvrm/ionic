import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { InquilinoInterface } from '../models/inquilino.interface'


@Injectable({
  providedIn: 'root'
})
export class BusquedaService {

  private inquilinosCollection: AngularFirestoreCollection<InquilinoInterface>;
  private idInquilino : string;
  public inquilinoLocal = {} as InquilinoInterface;
  
  constructor(private db: AngularFirestore) {
    this.inquilinosCollection = db.collection('sirv_c_inquilino');
   }


    updateBusquedaInqquilino( id: string, inquilino: InquilinoInterface){
      try {
        return this.inquilinosCollection.doc(id).update(inquilino);
      } catch (e) {
      console.log('error update busqueda inquilino '+e);
      }
      
    }

  async addBusquedaInquilino(inquilino: InquilinoInterface){
    await this.inquilinosCollection.ref.add(inquilino).then(ref =>{
      console.log('Referencia id=>'+ ref.id);
      this.idInquilino = ref.id;
    });
    return this.idInquilino;
    }
  
  
}
