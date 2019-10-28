import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CheckServiciosPage } from './check-servicios.page';

const routes: Routes = [
  {
    path: '',
    component: CheckServiciosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CheckServiciosPage]
})
export class CheckServiciosPageModule {}
