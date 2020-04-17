import { Component } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {ChangePasswordPageComponent} from './change-password-page.component';

@Component({
  template: ''
})
export class ChangePasswordPageEntryComponent {
  constructor(private dialogService: MatDialog,
              private router: Router) {
    this.openDialog();
  }

  openDialog() {
    const dialogRef = this.dialogService.open(ChangePasswordPageComponent, {
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
