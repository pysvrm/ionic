import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { InquilinoInterface } from '../models/inquilino.interface'
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class BusquedaService {

  private inquilinosCollection: AngularFirestoreCollection<InquilinoInterface>;
  
  constructor(private db: AngularFirestore) {
    this.inquilinosCollection = db.collection('sirv_c_inquilino');
   }

  getBusquedaVisita() {
    try {
      console.log('Inicia consulta vista=>');
      const snapshotResult = this.db.collection('sirv_c_inquilino', ref => ref
      .where('tipo', '==', 'Visita').where('visita', '==', '1').orderBy('nombre','asc'));
      return snapshotResult;
    } catch (error) {
      console.log('Error al devolver los datos' + error);
    }
  }

  getBusquedaInquilino() {
    try {
      const snapshotResult = this.db.collection('sirv_c_inquilino', ref => ref.where('tipo', '==', 'Inquilino'));
      return snapshotResult;
    } catch (error) {
      console.log('Error al devolver los datos' + error);
    }

  }


  getBusquedaInquilinoId(idInquilino:string) {
    try {
      console.log('Inicia consulta id=>'+ idInquilino);
      const snapshotResult =  this.db.collection('sirv_c_inquilino').doc(idInquilino);
      console.log('Inicia consulta id=>'+ snapshotResult);
      return snapshotResult;
    } catch (error) {
      console.log('Error al devolver los datos' + error);
    }

  }

  getBusquedaInquilinoNombre(nombre:string,apellido:string) {
    try {
      console.log('Nombre=>'+ nombre +' Apellido=>'+apellido);
      const snapshotResult =  this.db.collection('sirv_c_inquilino', ref => ref.where('nombre', '==', nombre).where('apellido', '==', apellido));
      console.log('Termina consulta por nombre=>'+ snapshotResult);
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


  updateBusquedaInqquilino(inquilino: InquilinoInterface, id: string ){
    return this.inquilinosCollection.doc(id).update(inquilino);
  }

  addBusquedaInquilino(inquilino: InquilinoInterface){
    //var idInquilino = this.db.createId;
    //inquilino.id = idInquilino.toString();
    //this.inquilinosCollection.add(inquilino);
    //var idInquilino = firebase.database().ref('sirv_c_inquilino').push(inquilino);
    //console.log('Error al devolver los datos' + error);
    this.inquilinosCollection.ref.add(inquilino).then(ref =>{
      console.log('Referencia id=>'+ ref.id);
      return ref.id.toString();
    });
    //return idInquilino.key;
    //return firebase.database().ref('sirv_c_inquilino').push().key;
    
    }
  
  
}
