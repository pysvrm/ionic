import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/firestore";
import { Observable, Subject } from "rxjs";
import { map, takeUntil } from "rxjs/operators";
import { AuthService } from "../../servicios/auth.service";
import { BusquedaService } from "../../servicios/busqueda.service";
import { DeptoService } from "../../servicios/depto.service";
import { VisitaService } from "../../servicios/visita.service";
import { InquilinoInterface } from '../../models/inquilino.interface'
import { deptoInterface } from '../../models/depto.interface'
import { NavController, LoadingController, AlertController } from "@ionic/angular";
import { VisitaInterface } from 'src/app/models/visita.interface';
import { DatePipe } from '@angular/common';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { StorageService } from '../../servicios/storage.service';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  providers: [DatePipe]
})


export class RegistroPage implements OnInit, OnDestroy {

  public inquilinoLocal = {} as InquilinoInterface;
  public inquilinoIdLocal = {} as InquilinoInterface;
  public deptoLocal = {} as deptoInterface;
  public visitaLocal = {} as VisitaInterface;
  public idUsuario: string;
  public inquilinosCollection: AngularFirestoreCollection<InquilinoInterface>;
  public inquilinos: any = [];
  public unsubscribe: Subject<void> = new Subject();
  public flag: boolean = true;
  public fotoPefil: any;
  public fotoTomadaPerfil: any;
  public fotoIdentifica: any;
  public fotoTomadaIdentifica: any;
  public varItemGroup:String;

  constructor(public authServices: AuthService,
    public router: Router,
    public busquedaServ: BusquedaService,
    public deptoServ: DeptoService,
    public loadingController: LoadingController,
    public alertController: AlertController,
    public visitaDepto: VisitaService,
    public datePipe: DatePipe,
    public camera: Camera,
    public storage: AngularFireStorage) {
    this.inquilinos = [];
    this.fotoTomadaPerfil = "assets/icon/perfil.gif"
    this.varItemGroup = "none";
  }

  ngOnInit() {
    this.inquilinos = [];
  }

  async registraVisitaInquilino() {
    var ddMMyyyy = this.datePipe.transform(new Date(), "dd-MM-yyyy hh:mm:ss ");
    var idInquilino: string;
    var registrosUsuario: number;
    this.inquilinoIdLocal = null;


    try {
      await this.busquedaServ.getBusquedaInquilinoNombre(this.inquilinoLocal.nombre, this.inquilinoLocal.apellido).then(resReg => {
        console.log('Entra a validar=>' + resReg);
        registrosUsuario = resReg.docs.length;
        resReg.forEach(resRegUnit => {
          this.inquilinoIdLocal = resRegUnit.data() as InquilinoInterface;
          console.log('resRegUnit.id=>' + resRegUnit.id);
          this.inquilinoIdLocal.id = resRegUnit.id;
        });
      });

      if (registrosUsuario > 0) {
        this.presentAlert('Registro duplicado', 'Ya existe un usuario con este nombre.');
      } else {
        console.log("Generar Registro");
        await this.deptoServ.getBusquedaDeptoAsync(this.inquilinoLocal.torre, this.inquilinoLocal.depto)
          .then(resDept => {
            console.log('Entra a validar=>' + resDept);
            registrosUsuario = resDept.docs.length;
            resDept.forEach(resDeptUnit => {
              this.deptoLocal = resDeptUnit.data() as deptoInterface;
              console.log('resDeptUnit.data()' + resDeptUnit.id);
              this.deptoLocal.id = resDeptUnit.id;
            });
          });

        if (this.inquilinoLocal.entra == "1") {
          this.visitaLocal.checkIn = ddMMyyyy.toString();
          this.visitaLocal.checkOut = "0";
          this.visitaLocal.fechaRegistro = new Date();
          this.inquilinoLocal.visita = "1";
        } else if (this.inquilinoLocal.entra == "0") {
          this.visitaLocal.checkIn = "0";
          this.visitaLocal.checkOut = "0";
          this.visitaLocal.status = "0";
          this.inquilinoLocal.visita = "0";
        }

        console.log("this.deptoLocal.id" + this.deptoLocal.id);
        this.idUsuario = await this.busquedaServ.addBusquedaInquilino(this.inquilinoLocal);
        this.uploadFotografiaPerfil();
        this.uploadFotografiaIdentifica();
        this.visitaLocal.idDepto = this.deptoLocal.id;
        this.visitaLocal.idUsuario = this.idUsuario;
        this.inquilinos = [];
        this.visitaDepto.addVisita(this.visitaLocal);

        if (this.inquilinoLocal.tipo == "Inquilino") {
          this.deptoLocal.torre = this.inquilinoLocal.torre;
          this.deptoLocal.depto = this.inquilinoLocal.depto;
          this.deptoLocal.idPropietario = this.idUsuario;
          this.deptoServ.updateDepartamento(this.deptoLocal);
        }

        this.router.navigate(["/menu"]);
      }
      console.log("inquilino local 03::" + this.deptoLocal.id);
    } catch (error) {
      console.log('Error' + error);
    }
  }

  public hacerFotoPerfil() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      cameraDirection: this.camera.Direction.FRONT,
      correctOrientation: true,
      targetHeight: 3000,
      targetWidth: 3000,
    }
    this.camera.getPicture(options).then((imageData) => {
      this.fotoPefil = this.dataURItoBlob('data:image/jpeg;base64,' + imageData);
      this.fotoTomadaPerfil = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      console.log(err);
    });
  }

  public hacerFotoIdentificacion() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      cameraDirection: this.camera.Direction.FRONT,
      correctOrientation: true,
      targetHeight: 3000,
      targetWidth: 3000,
    }
    this.camera.getPicture(options).then((imageData) => {
      this.fotoIdentifica = this.dataURItoBlob('data:image/jpeg;base64,' + imageData);
      this.fotoTomadaIdentifica = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      console.log(err);
    });
  }

  public dataURItoBlob(dataURI) {
    let binary = atob(dataURI.split(',')[1]);
    let array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
  };


  public uploadFotografiaPerfil() {
    if (this.fotoPefil) {
      var uploadTask = this.storage.storage.ref().child('imagesPerfil/'
        + (this.inquilinoLocal.nombre+" "+ this.inquilinoLocal.apellido+'.jpeg'))
        .put(this.fotoPefil);
    }

  }

  public uploadFotografiaIdentifica() {
    if (this.fotoIdentifica) {
      var uploadTask = this.storage.storage.ref().child('imagesIdentifacion/'
        + (this.inquilinoLocal.nombre+" "+ this.inquilinoLocal.apellido+'.jpeg'))
        .put(this.fotoIdentifica);
    }
  }

  getPicture(){
    let options: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      cameraDirection: this.camera.Direction.FRONT,
      targetWidth: 3000,
      targetHeight: 3000,
      quality: 100
    }
    this.camera.getPicture( options )
    .then(imageData => {
      this.fotoTomadaPerfil = 'imagesIdentifacion/'+ (this.inquilinoLocal.nombre + this.inquilinoLocal.apellido).trim();
    })
    .catch(error =>{
      console.error( error );
    });
  }

  public async presentAlert(subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header: '¡Error!',
      subHeader: subHeader,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  public backMenu() {
    this.router.navigate(["/menu"]);
  }

  public ngOnDestroy() {
    console.log('ngOnDestory');
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
