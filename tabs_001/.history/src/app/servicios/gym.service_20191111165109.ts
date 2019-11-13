import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { InquilinoInterface } from '../models/inquilino.interface'
import { deptoInterface } from '../models/depto.interface'
import { GymInterface } from "../models/gym.interface";


@Injectable({
  providedIn: 'root'
})
export class GymService {

  private gymCollection: AngularFirestoreCollection<GymInterface>;
  constructor(private db: AngularFirestore) {
    this.gymCollection = db.collection('sirv_t_visita_gym');
  }

  addVisitaGym(gym: GymInterface) {
    this.gymCollection.add(gym);
  }


  updateVisitaGym(id: string, gym: GymInterface) {
    console.log('Actualizar visita==>' + id);
    return this.gymCollection.doc(id).update(gym);
  }

  async getVisitaVisitaGym(idInquilino: string) {
    try {
      console.log('Entra a consultar visita idInqquilino==>' + idInquilino);
      const snapshotResult = this.db.collection('sirv_t_visita_gym').ref.where('idUsuario', '==', idInquilino).orderBy('fechaRegistro','asc').get();
      if(snapshotResult == undefined){
      return null;  
      }
      return snapshotResult;
    } catch (error) {
      console.log('Error al devolver los datos' + error);
    }
  }


  async getVisitaVisitaGymCheckIn(idInquilino: string) {
    try {
      console.log('Entra a consultar visita idInqquilino==>' + idInquilino);
      const snapshotResult = this.db.collection('sirv_t_visita_gym')
        .ref.where('idUsuario', '==', idInquilino).orderBy('fechaRegistro','desc').limit(1).get();
      return snapshotResult;
    } catch (error) {
      console.log('Error al devolver los datos' + error);
    }
  }
  
  getVisitaVisitaCheckOut(idInquilino: string) {
    try {
      console.log('Entra a consultar visita idInqquilino==>' + idInquilino);
      const snapshotResult = this.db.collection('sirv_t_visita_gym', ref => ref.where('idUsuario', '==', idInquilino).where('checkOut', '==', '0'));
      return snapshotResult;
    } catch (error) {
      console.log('Error al devolver los datos' + error);
    }
  }

 
}
