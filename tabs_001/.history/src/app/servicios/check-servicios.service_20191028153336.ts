import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { ServiciosInterface } from '../models/servicios.interface'
import { VisitaInterface } from '../models/visita.interface';
import { VisitaService } from './visita.service';

@Injectable({
  providedIn: 'root'
})
export class CheckServiciosService {

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
    try {
      console.log("checkServicio.tipo::" + checkServicio.tipo)
      console.log('fechaRegistro::' + fechaRegistro);
      const snapshotResult = await this.db.collection('sirv_t_checkServicios').ref.where('idUsuario', '==', checkServicio.idUsuario).where('tipo', '==', checkServicio.tipo).orderBy('fechaCheckin', 'desc').limit(1).get().then(resReg => {
        if (resReg.size > 0) {
          console.log('Registro 01::' + resReg.size);
          resReg.forEach(async resVisitUnit => {
            console.log('Registro 02::' + resVisitUnit);
            const dataVisita: ServiciosInterface = resVisitUnit.data() as ServiciosInterface;
            var fechaRegistrada: String = dataVisita.fechaCheckin.substring(3, 5);
            console.log('fechaRegistro::' + fechaRegistro);
            console.log('fechaRegistrada::' + fechaRegistrada);
            if (fechaRegistro != fechaRegistrada) {
              return 'false';
            } else if (fechaRegistrada == null) {
              return 'false';
            }
          });
        }else{
          console.log('Registro 03::' + false);
          return 'false';
        }
      });
      return 'true';
    } catch (error) {
      console.log('Error al devolver los datos' + error);
    }

  }


}
