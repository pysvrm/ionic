import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { ServiciosInterface } from '../models/servicios.interface'
import { VisitaInterface } from '../models/visita.interface';
import { VisitaService } from './visita.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CheckServiciosService implements  OnDestroy, OnInit{
  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }
  ngOnDestroy(): void {
    throw new Error("Method not implemented.");
  }

  private checkServiciosCollection: AngularFirestoreCollection<ServiciosInterface>;
  private idCheckServicio: string;
  public visitaLocal = {} as VisitaInterface;

  constructor(private db: AngularFirestore, public visitaDepto: VisitaService) {
    this.checkServiciosCollection = db.collection('sirv_t_checkServicios');
  }


  async addCheckServicios(checkServicio: ServiciosInterface) {
    await this.checkServiciosCollection.ref.add(checkServicio).then(ref => {
      console.log('Referencia id=>' + ref.id);
      this.idCheckServicio = ref.id;
    });
    return this.idCheckServicio;


  }

  async validaFechaCheckServicios(checkServicio: ServiciosInterface) {
    var fechaRegistro: String = checkServicio.fechaCheckin.substring(3, 5); //28-10-2019 10:46:03
    var flagReturn: String;
    try {
      console.log("checkServicio.tipo::" + checkServicio.tipo)
      console.log('fechaRegistro::' + fechaRegistro);
      flagReturn = 'false';
      await this.db.collection('sirv_t_checkServicios').ref.where('idUsuario', '==', checkServicio.idUsuario)
        .where('tipo', '==', checkServicio.tipo).orderBy('fechaCheckin', 'desc').limit(1).get().then(resReg => {
        if (resReg.size > 0) {
          console.log('Registro 01::' + resReg.size);
          resReg.forEach(async resVisitUnit => {
            console.log('Registro 02::' + resVisitUnit);
            const dataVisita: ServiciosInterface = resVisitUnit.data() as ServiciosInterface;
            var fechaRegistrada: String = dataVisita.fechaCheckin.substring(3, 5);
            console.log('fechaRegistro::' + fechaRegistro);
            console.log('fechaRegistrada::' + fechaRegistrada);
            if (fechaRegistro != fechaRegistrada) {
              flagReturn = 'false';
            } else if (fechaRegistrada == '') {
              flagReturn = 'false';
            } else{
              flagReturn = 'true';
            }
          });
        }else{
          return flagReturn;
        }
      });
      return flagReturn;
    } catch (error) {
      console.log('Error al devolver los datos' + error);
    }

  }


}
