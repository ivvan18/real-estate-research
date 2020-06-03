import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NavbarComponent} from './navbar/navbar.component';
import {FooterComponent} from './footer/footer.component';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { ImagePreloadDirective } from './image-preload.directive';

const MatModules = [MatIconModule, MatMenuModule, MatDividerModule, MatButtonModule];

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    ImagePreloadDirective
  ],
  imports: [
    CommonModule,
    MatModules
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    ImagePreloadDirective
  ]
})
export class UtilModule { }
