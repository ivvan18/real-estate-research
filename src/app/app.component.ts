import {Component, OnInit} from '@angular/core';
import {IUser} from './pages/auth/models/IUser';
import {AuthService} from './pages/auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  user: IUser;
  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      console.log('User updated: ', user);
      this.user = user;
    });

    this.auth.init();
  }
}
