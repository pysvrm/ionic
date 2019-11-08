import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CheckAmonestacionesPage } from './check-amonestaciones.page';

const routes: Routes = [
  {
    path: '',
    component: CheckAmonestacionesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CheckAmonestacionesPage]
})
export class CheckAmonestacionesPageModule {}
