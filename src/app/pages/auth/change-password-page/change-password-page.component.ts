import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {MatDialogRef} from '@angular/material/dialog';
import {takeUntil} from 'rxjs/operators';
import {checkPasswords, RepeatPasswordMatcher} from '../util/util';
import {INTERNET_ERROR} from '../../../services/rest.service';

@Component({
  selector: 'app-change-password-page',
  templateUrl: './change-password-page.component.html',
  styleUrls: ['./change-password-page.component.scss']
})
export class ChangePasswordPageComponent implements OnInit, OnDestroy {
  passwordFormGroup: FormGroup;
  error = '';
  isFetching = false;
  successMessage = '';
  formSubmitted = false;
  hideCurrentPassword = true;
  hidePassword = true;
  hidePasswordRepeat = true;
  repeatPasswordMatcher = new RepeatPasswordMatcher();

  private readonly destroy$ = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private dialogRef: MatDialogRef<ChangePasswordPageComponent>,
  ) { }

  ngOnInit(): void {
    this.passwordFormGroup = this.formBuilder.group(
      {
        currentPassword: ['', [Validators.required, Validators.minLength(6)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        repeatPassword: ['']
      },
      {validator: checkPasswords}
    );

    this.passwordFormGroup.valueChanges.subscribe(
      value => (this.formSubmitted = false)
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isCurrentPasswordValid(): boolean {
    return this.passwordFormGroup.get('currentPassword').valid;
  }

  isPasswordValid(): boolean {
    return this.passwordFormGroup.get('password').valid;
  }

  onChangePasswordClicked() {
    this.formSubmitted = true;
    this.isFetching = true;
    this.error = '';

    this.auth.changePassword(this.passwordFormGroup.get('currentPassword').value, this.passwordFormGroup.get('password').value)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(
        (value: any) => {
          console.log('Change password success: ', value);
          this.isFetching = false;
          this.successMessage = value.message;
        },
        error => {
          console.log('Change password error: ', error);
          this.isFetching = false;
          this.error = error.error.message || INTERNET_ERROR;
        });
  }

  onCloseDialogClicked() {
    this.dialogRef.close();
    this.router.navigate(['/landing']);
  }
}
