import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstateSearchComponent } from './estate-search.component';
import {EstateSearchRoutingModule} from './estate-search-routing.module';

@NgModule({
  declarations: [EstateSearchComponent],
  imports: [
    CommonModule,
    EstateSearchRoutingModule
  ]
})
export class EstateSearchModule { }
