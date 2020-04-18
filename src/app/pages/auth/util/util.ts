import {FormControl, FormGroup, FormGroupDirective, NgForm} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';

export function checkPasswords(group: FormGroup) {
  const pass = group.controls.password.value;
  const confirmPass = group.controls.repeatPassword.value;

  return pass === confirmPass ? null : {notSame: true};
}

export class RepeatPasswordMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const invalidRepeatPassword = !!(
      control &&
      control.parent &&
      control.parent.hasError('notSame')
    );

    return invalidRepeatPassword;
  }
}
