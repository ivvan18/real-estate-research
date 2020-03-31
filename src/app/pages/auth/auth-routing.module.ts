import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AuthComponent} from './auth.component';
import {SignInPageEntryComponent} from './sign-in-page/sign-in-page-entry.component';
import {RegisterPageEntryComponent} from './register-page/register-page-entry.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {path: '', redirectTo: 'sign-in'},
      {path: 'sign-in', component: SignInPageEntryComponent},
      {path: 'register', component: RegisterPageEntryComponent}
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
