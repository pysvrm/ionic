import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { InquilinoInterface } from '../models/inquilino.interface'
import { deptoInterface } from '../models/depto.interface'

@Injectable({
  providedIn: 'root'
})
export class DeptoService {

  private deptosCollection: AngularFirestoreCollection<deptoInterface>;
  public deptoLocal = {} as deptoInterface;
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


  async getBusquedaDeptoId(idInquilino:string) {
    try {
      console.log('Inicia consulta torre=>'+ idInquilino);
      const snapshotResult =  this.db.collection('sirv_c_deptos').doc(idInquilino).ref.get();
      console.log('Obtiene departamento=>'+ snapshotResult);
      return snapshotResult;
    } catch (error) {
      console.log('Error al devolver los datos' + error);
    }

  }

  async getBusquedaDeptoAsync(torre:string, depto:string) {
    try {
      console.log('Inicia consulta torre=>'+ torre + ':::depto'+depto);
      const snapshotResult = await this.db.collection('sirv_c_deptos').ref.where('torre', '==', torre).where('depto', '==', depto).get();
      console.log('Obtiene departamento=>'+ snapshotResult);
      return snapshotResult;
    } catch (error) {
      console.log('Error al devolver los datos' + error);
    }

  }

  async addDepartamento(depto: deptoInterface){

    await this.deptosCollection.add(depto).then(ref =>{
      console.log('Referencia id=>'+ ref.id);
      this.deptoLocal.id = ref.id;
    });
    return this.deptoLocal.id;
    }

  async updateDepartamento(depto: deptoInterface){
    this.deptosCollection.doc(depto.id).update(depto);
  }
}
