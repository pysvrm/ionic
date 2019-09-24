import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { InquilinoInterface } from '../models/inquilino.interface'
import * as firebase from 'firebase';
import { get } from 'https';

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

  getBusquedaVisitaAll() {
    try {
      console.log('Inicia consulta vista=>');
      const snapshotResult = this.db.collection('sirv_c_inquilino', ref => ref
      .where('tipo', '==', 'Visita').orderBy('nombre','asc'));
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
      return snapshotResult;
    } catch (error) {
      console.log('Error al devolver los datos' + error);
    }

  }

  async getBusquedaInquilinoNombre(nombre:string,apellido:string) {
    try {
      console.log('Nombre=>'+ nombre +' Apellido=>'+apellido);
      var data: InquilinoInterface;
      const snapshotResult =  this.db.collection('sirv_c_inquilino').ref.where('nombre', '==', nombre).where('apellido', '==', apellido)
      .get()
      .then(res => {
        console.log('Entra a validar=>'+res);
        if(res.docs.length == 0){
          //no documents found
        }else{
          //you got some documents
          res.forEach(shop => {
            console.log("id====>"+shop.id);
            console.log("Objeto====>"+shop.data());
            this.inquilinoLocal = shop.data() as InquilinoInterface;
            console.log("inquilino local::"+this.inquilinoLocal.email);
          })
        }
      }).catch(err => {
        console.log('something went wrong '+ err)
      });
      console.log("inquilino local 02::"+this.inquilinoLocal.email);
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
    return this.inquilinosCollection.doc(id).update(inquilino);
  }

  async addBusquedaInquilino(inquilino: InquilinoInterface){
    //var idInquilino = this.db.createId;
    //inquilino.id = idInquilino.toString();
    //this.inquilinosCollection.add(inquilino);
    //var idInquilino = firebase.database().ref('sirv_c_inquilino').push(inquilino);
    //console.log('Error al devolver los datos' + error);
    await this.inquilinosCollection.ref.add(inquilino).then(ref =>{
      console.log('Referencia id=>'+ ref.id);
      this.idInquilino = ref.id;
      //return ref.id.toString();
    });
    //return idInquilino.key;
    //return firebase.database().ref('sirv_c_inquilino').push().key;
    return this.idInquilino;
    }
  
  
}
