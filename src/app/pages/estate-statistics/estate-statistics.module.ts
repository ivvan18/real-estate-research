import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstateStatisticsComponent } from './estate-statistics.component';
import {EstateStatisticsRoutingModule} from './estate-statistics-routing.module';
import {UtilModule} from '../../util/util.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTableModule} from '@angular/material/table';
import {AngularYandexMapsModule} from 'angular8-yandex-maps';

const MatModules = [MatProgressSpinnerModule, MatTableModule];

@NgModule({
  declarations: [EstateStatisticsComponent],
  imports: [
    CommonModule,
    EstateStatisticsRoutingModule,
    UtilModule,
    MatModules,
    AngularYandexMapsModule
  ]
})
export class EstateStatisticsModule { }
