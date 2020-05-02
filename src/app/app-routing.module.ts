import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from './guards/auth-guard.service';

const routes: Routes = [
  {
    path: 'landing',
    loadChildren: () => import('./pages/landing/landing.module').then(landing => landing.LandingModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then(auth => auth.AuthModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./pages/estate-search/estate-search.module').then(estate => estate.EstateSearchModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'stats',
    loadChildren: () => import('./pages/estate-statistics/estate-statistics.module').then(estate => estate.EstateStatisticsModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'estate/:id',
    loadChildren: () => import('./pages/estate-item/estate-item.module').then(estate => estate.EstateItemModule)
  },
  {
    path: 'estate',
    loadChildren: () => import('./pages/estate-item/estate-item.module').then(estate => estate.EstateItemModule)
  },
  {
    path: '**',
    redirectTo: 'landing'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
