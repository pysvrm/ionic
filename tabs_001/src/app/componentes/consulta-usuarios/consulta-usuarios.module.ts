import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ConsultaUsuariosPage } from './consulta-usuarios.page';

const routes: Routes = [
  {
    path: '',
    component: ConsultaUsuariosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ConsultaUsuariosPage]
})
export class ConsultaUsuariosPageModule {}
