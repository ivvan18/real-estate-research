import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {EstateItemComponent} from './estate-item.component';

const routes: Routes = [
  {
    path: '',
    component: EstateItemComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class EstateItemRoutingModule { }
