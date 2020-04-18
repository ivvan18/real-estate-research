import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth/services/auth.service';
import {IUser} from '../auth/models/IUser';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  user: IUser;
  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      console.log('User updated: ', user);
      this.user = user;
    });

    this.auth.init();
  }

  navigate(url: string) {
    this.router.navigate([url]);
  }

}
