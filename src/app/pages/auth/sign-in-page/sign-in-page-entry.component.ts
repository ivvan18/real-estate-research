import { Component } from '@angular/core';
import {SignInPageComponent} from './sign-in-page.component';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';

@Component({
  template: '',
})
export class SignInPageEntryComponent {
  constructor(private dialogService: MatDialog,
              private router: Router) {
    this.openDialog();
  }

  openDialog() {
    const dialogRef = this.dialogService.open(SignInPageComponent, {
      width: '416px',
      panelClass: 'custom-dialog-container',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result || !result.blockNavBack) {
        this.router.navigate(['landing']);
      }
    });
  }
}
