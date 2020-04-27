import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstateItemComponent } from './estate-item.component';
import {EstateItemRoutingModule} from './estate-item-routing.module';
import {NgxGalleryModule} from '@kolkov/ngx-gallery';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {AngularYandexMapsModule} from 'angular8-yandex-maps';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {UtilModule} from '../../util/util.module';

const MatModules = [MatCardModule, MatButtonModule, MatProgressSpinnerModule];

@NgModule({
  declarations: [EstateItemComponent],
  imports: [
    CommonModule,
    EstateItemRoutingModule,
    NgxGalleryModule,
    MatModules,
    AngularYandexMapsModule,
    UtilModule
  ]
})
export class EstateItemModule { }
