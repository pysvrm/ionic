import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MenuInquilinosPage } from './menu-inquilinos.page';

const routes: Routes = [
  {
    path: '',
    component: MenuInquilinosPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MenuInquilinosPage]
})
export class MenuInquilinosPageModule {}
