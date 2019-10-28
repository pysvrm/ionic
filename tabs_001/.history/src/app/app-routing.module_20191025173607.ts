import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NologinGuard } from './guards/nologin.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: './componentes/login/login.module#LoginPageModule'
  },
  { path: 'login', loadChildren: './componentes/login/login.module#LoginPageModule', canActivate:[NologinGuard] },
  { path: 'menu', loadChildren: './componentes/menu/menu.module#MenuPageModule',canActivate:[AuthGuard] },
  { path: 'registro', loadChildren: './componentes/registro/registro.module#RegistroPageModule' },
  { path: 'check', loadChildren: './componentes/check/check.module#CheckPageModule' },
  { path: 'servicios/:id', loadChildren: './componentes/servicios/servicios.module#ServiciosPageModule' },
  { path: 'check-details/:id', loadChildren: './componentes/check-details/check-details.module#CheckDetailsPageModule' },
  { path: 'check-historico', loadChildren: './componentes/check-historico/check-historico.module#CheckHistoricoPageModule' },
  { path: 'check-servicios', loadChildren: './componentes/check-servicios/check-servicios.module#CheckServiciosPageModule' },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
