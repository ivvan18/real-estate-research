import { Component } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {RegisterPageComponent} from './register-page.component';
import {Router} from '@angular/router';

@Component({
  template: ''
})
export class RegisterPageEntryComponent {
  constructor(private dialogService: MatDialog,
              private router: Router) {
    this.openDialog();
  }

  openDialog() {
    const dialogRef = this.dialogService.open(RegisterPageComponent, {
      width: '416px',
      panelClass: 'custom-dialog-container',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe( result => {
      if (!result || !result.blockNavBack) {
        this.router.navigate(['landing']);
      }
    });
  }
}
