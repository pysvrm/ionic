import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
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
  selector: 'app-consulta-usuario-info',
  templateUrl: './consulta-usuario-info.page.html',
  styleUrls: ['./consulta-usuario-info.page.scss'],
  providers: [DatePipe]
})
export class ConsultaUsuarioInfoPage implements OnInit, OnDestroy{

  
  public inquilinoLocal = {} as InquilinoInterface;
  public inquilinoIdLocal = {} as InquilinoInterface;
  public deptoLocal = {} as deptoInterface;
  public visitaLocal = {} as VisitaInterface;
  public idUsuario: string;
  public inquilinosCollection: AngularFirestoreCollection<InquilinoInterface>;
  public inquilinos: any = [];
  public unsubscribe: Subject<void> = new Subject();
  public flag: boolean = true;
  public disabled: boolean = true;
  public fotoPefil: any;
  public fotoTomadaPerfil: any;
  public fotoIdentifica: any;
  public fotoTomadaIdentifica: any;
  public varItemGroup:String;

  constructor(public authServices: AuthService,
    public router: Router,
    public route: ActivatedRoute,
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


  public ngOnInit() {
    try {
      this.inquilinos =[];
      this.idUsuario = this.route.snapshot.params['id'];
      this.busquedaServ.getBusquedaInquilinoId(this.idUsuario).then(resInquilino => {
        this.inquilinoLocal = resInquilino.data() as InquilinoInterface;
        this.inquilinoLocal.id = resInquilino.id;
      });
    this.getPicture()
    } catch (error) {
      console.log('Imprime Error' + error);
    }
  }
  public  backMenu() {
    this.router.navigate(["/check-consulta-usuarios"]);
  }

  getPicture(){

      this.fotoTomadaPerfil = this.storage.storage.ref().child('imagesIdentifacion/'
        + ("Jose ArmandoAlvarez Hernandez.jpeg").trim())
        .getDownloadURL();
      console.log("fotoTomadaPerfil"+this.fotoTomadaPerfil);
    }

  ngOnDestroy(): void {
    throw new Error("Method not implemented.");
  }

 
}
