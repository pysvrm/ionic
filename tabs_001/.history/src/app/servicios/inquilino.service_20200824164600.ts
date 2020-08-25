import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { InquilinoInterface } from '../models/inquilino.interface'

@Injectable({
  providedIn: 'root'
})
export class InquilinoService {

  constructor(private db: AngularFirestore) { }

  async buscaInquilinoId(idInquilino: string) {
    try {
      console.log('Inicia consulta id=>' + idInquilino);
      const snapshotResult = this.db.collection('sirv_c_inquilino').doc(idInquilino).ref.get();
      return snapshotResult;
    } catch (error) {
      console.log('Error al devolver los datos' + error);
    }

  }

  buscaInquilinoTipo() {
    try {
      console.log('Inicia consulta vista=>');
      const snapshotResult = this.db.collection('sirv_c_inquilino', ref => ref
        .where('tipo', '==', 'Inquilino').orderBy('nombre', 'asc'));
      return snapshotResult;
    } catch (error) {
      console.log('Error al devolver los datos' + error);
    }
  }

  async buscaInquilinoNombre(nombre: string, apellido: string) {
    try {
      console.log('Nombre=>' + nombre + ' Apellido=>' + apellido);
      const snapshotResult = await this.db.collection('sirv_c_inquilino').ref.where('nombre', '==', nombre).where('apellido', '==', apellido).get();
      return snapshotResult;
    } catch (error) {
      console.log('Error al devolver los datos' + error);
    }
  }

  buscaInquilinoEmail(inquilino: InquilinoInterface) {
    try {
      const snapshotResult = this.db.collection('sirv_c_inquilino', ref => ref.where('email', '==', inquilino.email));
      return snapshotResult;
    } catch (error) {
      console.log('Error al devolver los datos' + error);
    }

  }
}

