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
  

  async getBusquedaInquilinoId(idInquilino:string) {
    try {
      console.log('Inicia consulta id=>'+ idInquilino);
      const snapshotResult =  this.db.collection('sirv_c_inquilino').doc(idInquilino).ref.get();
      return snapshotResult;
    } catch (error) {
      console.log('Error al devolver los datos' + error);
    }

  }

  async getBusquedaInquilinoNombre(nombre:string,apellido:string) {
    try {
      console.log('Nombre=>'+ nombre +' Apellido=>'+apellido);
      const snapshotResult = await this.db.collection('sirv_c_inquilino').ref.where('nombre', '==', nombre).where('apellido', '==', apellido).get();
      return snapshotResult;
    } catch (error) {
      console.log('Error al devolver los datos' + error);
    }
  }
  

  getBusquedaInquilinoEmail(inquilino: InquilinoInterface) {
    try {
      const snapshotResult = this.db.collection('sirv_c_inquilino', ref => ref.where('email', '==', inquilino.email));
      return snapshotResult;
    } catch (error) {
      console.log('Error al devolver los datos' + error);
    }

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
