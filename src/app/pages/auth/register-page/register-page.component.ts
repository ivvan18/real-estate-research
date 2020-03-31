import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit {
  hidePassword = true;
  hidePasswordRepeat = true;

  constructor(private dialogRef: MatDialogRef<RegisterPageComponent>, private router: Router) { }

  ngOnInit(): void {
  }

  onSignInClicked() {
    this.dialogRef.close({blockNavBack: true});
    this.router.navigate(['auth/sign-in']);
  }
}
