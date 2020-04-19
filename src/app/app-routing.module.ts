import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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
    loadChildren: () => import('./pages/estate-search/estate-search.module').then(estate => estate.EstateSearchModule)
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
