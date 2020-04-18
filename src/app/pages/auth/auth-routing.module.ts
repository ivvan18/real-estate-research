import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AuthComponent} from './auth.component';
import {SignInPageEntryComponent} from './sign-in-page/sign-in-page-entry.component';
import {RegisterPageEntryComponent} from './register-page/register-page-entry.component';
import {ChangePasswordPageEntryComponent} from './change-password-page/change-password-page-entry.component';
import {RestorePasswordPageEntryComponent} from './restore-password-page/restore-password-page-entry.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {path: '', redirectTo: 'sign-in'},
      {path: 'sign-in', component: SignInPageEntryComponent},
      {path: 'register', component: RegisterPageEntryComponent},
      {path: 'change-password', component: ChangePasswordPageEntryComponent},
      {path: 'restore-password', component: RestorePasswordPageEntryComponent}
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class AuthRoutingModule { }
