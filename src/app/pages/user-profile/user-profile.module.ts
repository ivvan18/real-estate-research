import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './user-profile.component';
import {UserProfileRoutingModule} from './user-profile-routing.module';
import {UtilModule} from '../../util/util.module';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

const MatModules = [MatButtonModule, MatTableModule, MatIconModule, MatProgressSpinnerModule];

@NgModule({
  declarations: [UserProfileComponent],
  imports: [
    CommonModule,
    MatModules,
    UserProfileRoutingModule,
    UtilModule
  ]
})
export class UserProfileModule { }
