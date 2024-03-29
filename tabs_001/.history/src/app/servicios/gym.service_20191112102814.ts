import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { InquilinoInterface } from '../models/inquilino.interface'
import { deptoInterface } from '../models/depto.interface'
import { GymInterface } from "../models/gym.interface";


@Injectable({
  providedIn: 'root'
})
export class GymService {

  private inquilinosCollection: AngularFirestoreCollection<InquilinoInterface>;
  private idInquilino : string;
  public inquilinoLocal = {} as InquilinoInterface;
  
  constructor(private db: AngularFirestore) {
    this.inquilinosCollection = db.collection('sirv_t_visita_gym');
   }

  getBusquedaVisita() {
    try {
      console.log('Inicia consulta vista=>');
      const snapshotResult = this.db.collection('sirv_t_visita_gym', ref => ref
      .where('tipo', '==', 'Visita').where('visita', '==', '1').orderBy('nombre','asc'));
      return snapshotResult;
    } catch (error) {
      console.log('Error al devolver los datos' + error);
    }
  }


  getBusquedaInquilinos() {
    try {
      console.log('Inicia consulta vista=>');
      const snapshotResult = this.db.collection('sirv_t_visita_gym', ref => ref
      .where('tipo', '==', 'Inquilino').orderBy('nombre','asc'));
      return snapshotResult;
    } catch (error) {
      console.log('Error al devolver los datos' + error);
    }
  }
  getBusquedaVisitaAll() {
    try {
      console.log('Inicia consulta vista=>');
      const snapshotResult = this.db.collection('sirv_t_visita_gym', ref => ref
      .where('tipo', '==', 'Visita').orderBy('nombre','asc'));
      return snapshotResult;
    } catch (error) {
      console.log('Error al devolver los datos' + error);
    }
  }

  getBusquedaInquilino() {
    try {
      const snapshotResult = this.db.collection('sirv_t_visita_gym', ref => ref.where('tipo', '==', 'Inquilino'));
      return snapshotResult;
    } catch (error) {
      console.log('Error al devolver los datos' + error);
    }

  }
  
  

  async getBusquedaInquilinoId(idInquilino:string) {
    try {
      console.log('Inicia consulta id=>'+ idInquilino);
      const snapshotResult =  this.db.collection('sirv_t_visita_gym').doc(idInquilino).ref.get();
      return snapshotResult;
    } catch (error) {
      console.log('Error al devolver los datos' + error);
    }

  }

  async getBusquedaInquilinoNombre(nombre:string,apellido:string) {
    try {
      console.log('Nombre=>'+ nombre +' Apellido=>'+apellido);
      const snapshotResult = await this.db.collection('sirv_t_visita_gym').ref.where('nombre', '==', nombre).where('apellido', '==', apellido).get();
      return snapshotResult;
    } catch (error) {
      console.log('Error al devolver los datos' + error);
    }
  }
  

  getBusquedaInquilinoEmail(inquilino: InquilinoInterface) {
    try {
      const snapshotResult = this.db.collection('sirv_t_visita_gym', ref => ref.where('email', '==', inquilino.email));
      return snapshotResult;
    } catch (error) {
      console.log('Error al devolver los datos' + error);
    }

  }


  updateBusquedaInqquilino( id: string, inquilino: InquilinoInterface){
    return this.inquilinosCollection.doc(id).update(inquilino);
  }

  async addBusquedaInquilino(inquilino: InquilinoInterface){
    await this.inquilinosCollection.ref.add(inquilino).then(ref =>{
      console.log('Referencia id=>'+ ref.id);
      this.idInquilino = ref.id;
    });
    return this.idInquilino;
    }
  
  
}
