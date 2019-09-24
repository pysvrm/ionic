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

  addVisita(visita: VisitaInterface){
    this.visitaCollection.add(visita);
  }
  

  getVisitaVisita(idInquilino:string) {
    try {
      const snapshotResult = this.db.collection('sirv_t_visita', ref => ref.where('idUsuario', '==', idInquilino));
      return snapshotResult;
    } catch (error) {
      console.log('Error al devolver los datos' + error);
    }

  }
}
