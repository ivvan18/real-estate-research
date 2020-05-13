import { NgModule } from '@angular/core';
import {CommonModule, CurrencyPipe} from '@angular/common';
import { EstateStatisticsComponent } from './estate-statistics.component';
import {EstateStatisticsRoutingModule} from './estate-statistics-routing.module';
import {UtilModule} from '../../util/util.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTableModule} from '@angular/material/table';
import {AngularYandexMapsModule} from 'angular8-yandex-maps';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

const MatModules = [MatProgressSpinnerModule, MatTableModule, MatButtonToggleModule];

@NgModule({
  declarations: [EstateStatisticsComponent],
  imports: [
    CommonModule,
    EstateStatisticsRoutingModule,
    UtilModule,
    MatModules,
    AngularYandexMapsModule
  ],
  providers: [CurrencyPipe]
})
export class EstateStatisticsModule { }
