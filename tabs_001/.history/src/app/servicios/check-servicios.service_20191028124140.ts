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
      const snapshotResult = this.db.collection('sirv_t_checkServicios').ref.where('idUsuario', '==', checkServicio.idUsuario).where('tipo', '==', checkServicio.tipo).orderBy('fechaCheckin', 'desc').limit(1).get().then(resReg => {
        resReg.forEach(async resVisitUnit => {
          const dataVisita: ServiciosInterface = resVisitUnit.data() as ServiciosInterface;
          var fechaRegistrada: String = dataVisita.fechaCheckin.substring(3, 5);
          console.log('fechaRegistro::'+fechaRegistro);
          console.log('fechaRegistrada::'+ fechaRegistrada);
          if (fechaRegistro != fechaRegistro) {
            return 'false';
          }
        });
      });
        return 'true';
    } catch (error) {
      console.log('Error al devolver los datos' + error);
    }

  }


}
