import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { InquilinoInterface } from '../models/inquilino.interface'
import { deptoInterface } from '../models/depto.interface'
import { VisitaInterface } from "../models/visita.interface";

@Injectable({
  providedIn: 'root'
})
export class VisitaService {

  private visitaCollection: AngularFirestoreCollection<VisitaInterface>;
  constructor(private db: AngularFirestore) {
    this.visitaCollection = db.collection('sirv_t_visita');
  }

  addVisita(visita: VisitaInterface) {
    this.visitaCollection.add(visita);
  }


  updateVisita(id: string, visita: VisitaInterface) {
    console.log('Actualizar visita==>' + id);
    return this.visitaCollection.doc(id).update(visita);
  }

  async getVisitaVisita(idInquilino: string) {
    try {
      console.log('Entra a consultar visita idInqquilino==>' + idInquilino);
      const snapshotResult = this.db.collection('sirv_t_visita').ref.where('idUsuario', '==', idInquilino).orderBy('fechaRegistro','asc').get();
      return snapshotResult;
    } catch (error) {
      console.log('Error al devolver los datos' + error);
    }
  }


  async getVisitaVisitaCheckIn(idInquilino: string) {
    try {
      console.log('Entra a consultar visita idInqquilino==>' + idInquilino);
      const snapshotResult = this.db.collection('sirv_t_visita')
        .ref.where('idUsuario', '==', idInquilino).orderBy('fechaRegistro','desc').limit(1).get();
        if((await snapshotResult).empty){
          console.log('Sin registro en la Bd');    
        }
      return snapshotResult;
    } catch (error) {
      console.log('Error al devolver los datos' + error);
    }
  }
  
  getVisitaVisitaCheckOut(idInquilino: string) {
    try {
      console.log('Entra a consultar visita idInqquilino==>' + idInquilino);
      const snapshotResult = this.db.collection('sirv_t_visita', ref => ref.where('idUsuario', '==', idInquilino).where('checkOut', '==', '0'));
      return snapshotResult;
    } catch (error) {
      console.log('Error al devolver los datos' + error);
    }
  }

 
}
