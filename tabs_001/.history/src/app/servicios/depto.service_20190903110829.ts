import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { InquilinoInterface } from '../models/inquilino.interface'
import { deptoInterface } from '../models/depto.interface'

@Injectable({
  providedIn: 'root'
})
export class DeptoService {

  private deptosCollection: AngularFirestoreCollection<InquilinoInterface>;
  constructor(private db: AngularFirestore) {
    this.deptosCollection = db.collection('sirv_c_deptos');
   }

   getBusquedaDepto(torre:string, depto:string) {
    try {
      console.log('Inicia consulta torre=>'+ torre + ':::depto'+depto);
      const snapshotResult =  this.db.collection('sirv_c_deptos', ref => ref.where('torre', '==', torre).where('depto', '==',depto));
      console.log('Obtiene departamento=>'+ snapshotResult);
      return snapshotResult;
    } catch (error) {
      console.log('Error al devolver los datos' + error);
    }

  }


}
