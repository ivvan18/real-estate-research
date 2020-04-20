import {ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../pages/auth/services/auth.service';
import {IUser} from '../../pages/auth/models/IUser';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements OnInit {
  isFixed = false;

  @Input() user: IUser;
  constructor(private router: Router, private auth: AuthService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {}

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    this.isFixed = document.body.scrollTop > 40 || document.documentElement.scrollTop > 40;
    this.cd.markForCheck();
  }

  navigate(route: string) {
    this.router.navigate([route]);
  }

  onLogoutClicked() {
    this.auth.logout().subscribe(response => {
      console.log('Logout completed: ', response);
      this.router.navigate(['auth/sign-in']);
    });
  }
}
