import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {EstateStatisticsComponent} from './estate-statistics.component';

const routes: Routes = [
  {
    path: '',
    component: EstateStatisticsComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class EstateStatisticsRoutingModule { }
