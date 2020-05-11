import {FormControl, FormGroup, FormGroupDirective, NgForm} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';

export function checkPasswords(group: FormGroup) {
  const pass = group.controls.password.value;
  const confirmPass = group.controls.repeatPassword.value;

  return pass === confirmPass ? null : {notSame: true};
}

export function checkAreas(group: FormGroup) {
  const totalArea = group.controls.totalArea.value;
  const kitchenArea = group.controls.kitchenArea.value;

  return totalArea >= kitchenArea ? null : {areasIncorrect: true};
}

export function checkFloors(group: FormGroup) {
  console.log(group.controls.floorsTotal.value);
  console.log(group.controls.floorNumber.value);

  const floorsTotal = group.controls.floorsTotal.value;
  const floorNumber = group.controls.floorNumber.value;

  return floorsTotal >= floorNumber ? null : {floorsIncorrect: true};
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

export class AreasMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const invalidAreas = !!(
      control &&
      control.parent &&
      control.parent.hasError('areasIncorrect')
    );

    return invalidAreas;
  }
}

export class FloorsMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const invalidFloors = !!(
      control &&
      control.parent &&
      control.parent.hasError('floorsIncorrect')
    );

    return invalidFloors;
  }
}
