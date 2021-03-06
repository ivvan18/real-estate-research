import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {takeUntil} from 'rxjs/operators';
import {checkPasswords, RepeatPasswordMatcher} from '../util/util';
import {INTERNET_ERROR} from '../../../services/rest.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit, OnDestroy {
  registerFormGroup: FormGroup;
  error = '';
  isFetching = false;
  accessToken = '';
  formSubmitted = false;
  hidePassword = true;
  hidePasswordRepeat = true;
  repeatPasswordMatcher = new RepeatPasswordMatcher();
  private readonly destroy$ = new Subject();


  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private dialogRef: MatDialogRef<RegisterPageComponent>,
    private router: Router) { }

  ngOnInit(): void {
    this.registerFormGroup = this.formBuilder.group(
      {
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        repeatPassword: ['']
      },
      {validator: checkPasswords}
    );

    this.registerFormGroup.valueChanges.subscribe(
      value => (this.formSubmitted = false)
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isEmailValid(): boolean {
    return this.registerFormGroup.get('email').valid;
  }

  isPasswordValid(): boolean {
    return this.registerFormGroup.get('password').valid;
  }

  onRegisterClicked() {
    this.formSubmitted = true;
    this.isFetching = true;
    this.error = '';

    this.auth.register(this.registerFormGroup.getRawValue())
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(
        value => {
          console.log('Register Success: ', value);
          this.isFetching = false;
          this.accessToken = value.access_token;
        },
        error => {
          console.log('Register Error: ', error);
          this.isFetching = false;
          this.error = error.error.message || INTERNET_ERROR;
        });
  }

  onCloseDialogClicked() {
    this.dialogRef.close();
    this.router.navigate(['/landing']);
  }

  onSignInClicked() {
    this.dialogRef.close({blockNavBack: true});
    this.router.navigate(['auth/sign-in']);
  }
}
