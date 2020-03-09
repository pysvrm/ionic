import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ConsultaUsuarioInfoPage } from './consulta-usuario-info.page';

const routes: Routes = [
  {
    path: '',
    component: ConsultaUsuarioInfoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ConsultaUsuarioInfoPage]
})
export class ConsultaUsuarioInfoPageModule {}
