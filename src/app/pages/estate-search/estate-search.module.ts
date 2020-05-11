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
import {Ng5SliderModule} from 'ng5-slider';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDialogModule} from '@angular/material/dialog';

const MatModules = [MatButtonModule, MatInputModule, MatFormFieldModule, MatSelectModule,
  MatProgressSpinnerModule, MatAutocompleteModule, MatProgressBarModule, MatDialogModule];

@NgModule({
  declarations: [EstateSearchComponent],
  imports: [
    CommonModule,
    EstateSearchRoutingModule,
    AngularYandexMapsModule,
    MatModules,
    ReactiveFormsModule,
    FormsModule,
    UtilModule,
    Ng5SliderModule
  ]
})
export class EstateSearchModule { }
