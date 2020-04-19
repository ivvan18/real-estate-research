import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstateSearchComponent } from './estate-search.component';
import {EstateSearchRoutingModule} from './estate-search-routing.module';
import {AngularYandexMapsModule} from 'angular8-yandex-maps';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {UtilModule} from '../../util/util.module';

const MatModules = [MatButtonModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatProgressSpinnerModule];

@NgModule({
  declarations: [EstateSearchComponent],
  imports: [
    CommonModule,
    EstateSearchRoutingModule,
    AngularYandexMapsModule,
    MatModules,
    ReactiveFormsModule,
    FormsModule,
    UtilModule
  ]
})
export class EstateSearchModule { }
