import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {checkPasswords, RepeatPasswordMatcher} from '../util/util';
import {Subject} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialogRef} from '@angular/material/dialog';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-restore-password-page',
  templateUrl: './restore-password-page.component.html',
  styleUrls: ['./restore-password-page.component.scss']
})
export class RestorePasswordPageComponent implements OnInit, OnDestroy {
  emailFormGroup: FormGroup;
  passwordFormGroup: FormGroup;
  error = '';
  isFetching = false;
  successMessage = '';
  formSubmitted = false;
  hidePassword = true;
  hidePasswordRepeat = true;
  repeatPasswordMatcher = new RepeatPasswordMatcher();
  queryParam = '';

  private readonly destroy$ = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogRef: MatDialogRef<RestorePasswordPageComponent>,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.queryParam = params.token;
      console.log('queryParam: ', this.queryParam);
    });

    this.emailFormGroup = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
      },
    );

    this.passwordFormGroup = this.formBuilder.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        repeatPassword: ['']
      },
      {validator: checkPasswords}
    );

    this.emailFormGroup.valueChanges.subscribe(
      value => (this.formSubmitted = false)
    );

    this.passwordFormGroup.valueChanges.subscribe(
      value => (this.formSubmitted = false)
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isEmailValid(): boolean {
    return this.emailFormGroup.get('email').valid;
  }

  isPasswordValid(): boolean {
    return this.passwordFormGroup.get('password').valid;
  }

  onForgotPasswordClicked() {
    this.formSubmitted = true;
    this.isFetching = true;
    this.error = '';

    this.auth.forgotPassword(this.emailFormGroup.get('email').value)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(
        value => {
          console.log('Forgot success: ', value);
          this.isFetching = false;
          this.successMessage = value.message;
        },
        error => {
          console.log('Forgot error: ', error);
          this.isFetching = false;
          this.error = error.error.message;
        });
  }

  onRestorePasswordClicked() {
    this.formSubmitted = true;
    this.isFetching = true;
    this.error = '';

    this.auth.resetPasswordViaEmail(this.queryParam, this.passwordFormGroup.get('password').value)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(
        value => {
          console.log('Restore password result: ', value);
          this.isFetching = false;
          this.successMessage = value.message;
        },
        error => {
          console.log('Restore password error: ', error);
          this.isFetching = false;
          this.error = error.error.message;
        });
  }

  onSignInClicked() {
    this.dialogRef.close({blockNavBack: true});
    this.router.navigate(['/auth/sign-in']);
  }

  onCloseDialogClicked() {
    this.dialogRef.close();
    this.router.navigate(['/landing']);
  }
}
