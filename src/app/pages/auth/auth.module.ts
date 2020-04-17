import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInPageComponent } from './sign-in-page/sign-in-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { SignInPageEntryComponent } from './sign-in-page/sign-in-page-entry.component';
import { RegisterPageEntryComponent } from './register-page/register-page-entry.component';
import { AuthComponent } from './auth.component';
import {AuthRoutingModule} from './auth-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatDividerModule} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatGridListModule} from '@angular/material/grid-list';
import {RouterModule} from '@angular/router';
import { ChangePasswordPageComponent } from './change-password-page/change-password-page.component';
import { ChangePasswordPageEntryComponent } from './change-password-page/change-password-page-entry.component';

const MAT_MODULES = [
  MatDialogModule,
  MatProgressSpinnerModule,
  MatToolbarModule,
  MatIconModule,
  MatSidenavModule,
  MatDividerModule,
  MatFormFieldModule,
  MatInputModule,
  MatCheckboxModule,
  MatButtonModule,
  MatGridListModule
];

@NgModule({
  declarations: [
    SignInPageComponent,
    RegisterPageComponent,
    SignInPageEntryComponent,
    RegisterPageEntryComponent,
    AuthComponent,
    ChangePasswordPageComponent,
    ChangePasswordPageEntryComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    MAT_MODULES,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [SignInPageComponent, RegisterPageComponent, ChangePasswordPageComponent]
})
export class AuthModule { }
