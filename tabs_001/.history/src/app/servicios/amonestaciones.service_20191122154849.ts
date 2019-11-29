import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { InquilinoInterface } from '../models/inquilino.interface'

import { AmonestacionesInterface } from '../models/amonestacion.interface';

@Injectable({
  providedIn: 'root'
})
export class AmonestacionesService {

  private amonestacionesCollection: AngularFirestoreCollection<AmonestacionesInterface  >;
  constructor(private db: AngularFirestore) {
    this.amonestacionesCollection = db.collection('sirv_t_amonestaciones');
   }


   getBusquedaAmonestaciones(idInquilino:string) {
    try {
      console.log('Inicia consulta vista=>');
      const snapshotResult = this.db.collection('sirv_t_amonestaciones', ref => ref
      .where('idInquilino', '==', idInquilino).orderBy('fechaRegistro','asc'));
      return snapshotResult;
    } catch (error) {
      console.log('Error al devolver los datos' + error);
    }
  }

  getBusquedaAmonestacionesId(idAmonestacion:string) {
    try {
      console.log('Inicia consulta vista=>::'+idAmonestacion);
      const snapshotResult = this.db.collection('sirv_t_amonestaciones').doc(idAmonestacion).ref.get();
      return snapshotResult;
    } catch (error) {
      console.log('Error al devolver los datos' + error);
    }
  }

  addAmonestaciones(amonestaciones: AmonestacionesInterface){
    try {
      this.amonestacionesCollection.ref.add(amonestaciones);
    } catch (e) {
    console.log('Error al insertar las amonestaciones'+e);
    }
    
  }

  updateAmonestaciones( id: string, amonestaciones: AmonestacionesInterface){
    try {
      return this.amonestacionesCollection.doc(id).update(amonestaciones);
    } catch (e) {
    console.log('Error update amonestaciones: '+e);
    }
    
  }
}
