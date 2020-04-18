import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {RestorePasswordPageComponent} from './restore-password-page.component';
import {Router} from '@angular/router';

@Component({
  template: ''
})
export class RestorePasswordPageEntryComponent {
  constructor(private dialogService: MatDialog,
              private router: Router) {
    this.openDialog();
  }

  openDialog() {
    const dialogRef = this.dialogService.open(RestorePasswordPageComponent, {
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
