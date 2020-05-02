import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstateStatisticsComponent } from './estate-statistics.component';
import {EstateStatisticsRoutingModule} from './estate-statistics-routing.module';

@NgModule({
  declarations: [EstateStatisticsComponent],
  imports: [
    CommonModule,
    EstateStatisticsRoutingModule
  ]
})
export class EstateStatisticsModule { }
