import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sign-in-page',
  templateUrl: './sign-in-page.component.html',
  styleUrls: ['./sign-in-page.component.scss']
})
export class SignInPageComponent implements OnInit {
  hidePassword = true;

  constructor(private dialogRef: MatDialogRef<SignInPageComponent>, private router: Router) { }

  ngOnInit(): void {
  }

  onRegisterClicked() {
    this.dialogRef.close({blockNavBack: true});
    this.router.navigate(['auth/register']);
  }
}
