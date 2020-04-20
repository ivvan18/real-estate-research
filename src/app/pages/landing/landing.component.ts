import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth/services/auth.service';
import {IUser} from '../auth/models/IUser';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, OnDestroy {
  user: IUser;
  private readonly destroy$ = new Subject();

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit() {
    this.auth.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
      console.log('User updated: ', user);
      this.user = user;
    });

    this.auth.init();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigate(url: string) {
    this.router.navigate([url]);
  }
}
