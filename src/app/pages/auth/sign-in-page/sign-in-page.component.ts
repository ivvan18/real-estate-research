import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-sign-in-page',
  templateUrl: './sign-in-page.component.html',
  styleUrls: ['./sign-in-page.component.scss']
})
export class SignInPageComponent implements OnInit, OnDestroy {
  signInFormGroup: FormGroup;
  hidePassword = true;
  error = '';
  isFetching = false;
  formSubmitted = false;
  private readonly destroy$ = new Subject();

  constructor(private formBuilder: FormBuilder,
              private dialogRef: MatDialogRef<SignInPageComponent>,
              private auth: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.signInFormGroup = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required]
    });

    this.signInFormGroup.valueChanges.subscribe(() => (this.formSubmitted = false));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isUsernameValid(): boolean {
    return this.signInFormGroup.get('username').valid;
  }

  onSignInClicked() {
    this.formSubmitted = true;
    this.isFetching = true;
    this.error = '';

    console.log('onSignInClicked: ', this.auth);
    this.auth.login(this.signInFormGroup.getRawValue())
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe(
        value => {
          console.log('Login Success: ', value);
          this.isFetching = false;
          this.onCloseDialogClicked();
        },
        error => {
          console.log('Login Error: ', error);
          this.isFetching = false;
          this.error = error.error.message;
        });
  }

  onRegisterClicked() {
    this.dialogRef.close({blockNavBack: true});
    this.router.navigate(['auth/register']);
  }

  onRestorePasswordClicked() {
    this.dialogRef.close({blockNavBack: true});
    this.router.navigate(['/auth/restore-password']);
  }

  onCloseDialogClicked() {
    this.dialogRef.close();
    this.router.navigate(['/landing']);
  }
}
