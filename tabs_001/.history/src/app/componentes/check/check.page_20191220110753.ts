import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "../../servicios/auth.service";
import { BusquedaService } from "../../servicios/busqueda.service";
import { ChangeDetectionStrategy } from '@angular/compiler/src/core';
import { Observable, Subject } from "rxjs";
import { InquilinoInterface } from '../../models/inquilino.interface'
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { map, takeUntil } from "rxjs/operators";

@Component({
  selector: 'app-check',
  templateUrl: './check.page.html',
  styleUrls: ['./check.page.scss'],
})

export class CheckPage implements OnDestroy, OnInit {

public  ngOnInit() {
    try {
      this.inquilinos = [];
      this.busquedaServ.getBusquedaInquilinos().snapshotChanges().pipe(takeUntil(this.unsubscribe)).subscribe(inquilinos => {
        inquilinos.map(inquilino => {
          const data: InquilinoInterface = inquilino.payload.doc.data() as InquilinoInterface;
          data.id = inquilino.payload.doc.id;
          console.log(data);
          this.inquilinos.push(data);
          this.panelListaInquilinos.push(data);
        });
      });
    } catch (error) {
      console.log('Imprime Error' + error);
    }
  }


  public inquilinos: any = [];
  public panelListaInquilinos: any = [];
  public inquilinosCollection: AngularFirestoreCollection<InquilinoInterface>;
  public unsubscribe: Subject<void> = new Subject();

  /**
   *Creates an instance of CheckPage.
   * @param {AuthService} authServices
   * @param {Router} router
   * @param {BusquedaService} busquedaServ
   * @memberof CheckPage
   */
  constructor(public authServices: AuthService, public router: Router,
    public busquedaServ: BusquedaService) { }

  /**
   *
   *
   * @param {*} ev
   * @memberof CheckPage
   */
  public getItems(ev: any) {
    const val = ev.target.value;
    if (val && val.trim() != '') {
      this.panelListaInquilinos = this.panelListaInquilinos.filter((item) => {
        return (item.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }

  }

  /**
   *
   *
   * @param {InquilinoInterface} inquilino
   * @returns
   * @memberof CheckPage
   */
  public addVisita(inquilino: InquilinoInterface) {
    return this.inquilinosCollection.add(inquilino);
  }

  /**
   *
   *
   * @param {*} ev
   * @memberof CheckPage
   */
  public onCancel(ev: any) {
    try {
      ev = ''
      this.panelListaInquilinos = this.inquilinos;
    } catch (error) {
      console.log('Imprime Error' + error);
    }
  }

  /**
   *
   *
   * @memberof CheckPage
   */
  public backMenu() {
    this.router.navigate(["/menu"]);
  }

  /**
   *
   *
   * @memberof CheckPage
   */
  public ngOnDestroy() {
    console.log('ngOnDestory');
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
