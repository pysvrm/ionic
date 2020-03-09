import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CheckConsultaUsuariosPage } from './check-consulta-usuarios.page';

const routes: Routes = [
  {
    path: '',
    component: CheckConsultaUsuariosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CheckConsultaUsuariosPage]
})
export class CheckConsultaUsuariosPageModule {}
