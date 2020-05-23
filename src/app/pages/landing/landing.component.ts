import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth/services/auth.service';
import {IUser} from '../auth/models/IUser';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {INTERNET_ERROR, RestService} from '../../services/rest.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, OnDestroy {
  @ViewChild('feedback') feedback;
  feedbackFormGroup: FormGroup;
  feedbackFormSubmitted = false;
  feedbackIsFetching = false;
  feedbackError = '';

  user: IUser;
  private readonly destroy$ = new Subject();

  constructor(private router: Router,
              private auth: AuthService,
              private formBuilder: FormBuilder,
              private rest: RestService,
              private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.auth.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
      console.log('User updated: ', user);
      this.user = user;
    });

    this.feedbackFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.maxLength(1000)]],
    });

    this.feedbackFormGroup.valueChanges.subscribe(() => (this.feedbackFormSubmitted = false));

    this.auth.init();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isfeedBackEmailValid() {
    return this.feedbackFormGroup.get('email').valid;
  }

  navigate(url: string) {
    this.router.navigate([url]);
  }

  onSendFeedbackClicked() {
    this.feedbackFormSubmitted = true;
    this.feedbackIsFetching = true;
    this.feedbackError = '';

    console.log('onSendFeedbackClicked: ', this.feedbackFormGroup.getRawValue());
    this.rest.postEntity('feedback', this.feedbackFormGroup.getRawValue())
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe(
        value => {
          console.log('Feedback Success: ', value);
          this.feedbackIsFetching = false;
          this.openSnackBar('Спасибо, что связались с нами!', 'Ok');
        },
        error => {
          console.log('Feedback Error: ', error);
          this.feedbackIsFetching = false;
          this.feedbackError = INTERNET_ERROR;
        });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  onContactClicked() {
    console.log('onContactClicked: ', this.feedback);
    this.feedback.nativeElement.scrollIntoView({behavior: 'smooth', block: 'end'});
  }
}
