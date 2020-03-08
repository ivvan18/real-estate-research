import {ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements OnInit {
  isFixed = false;

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit(): void {}

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    this.isFixed = document.body.scrollTop > 40 || document.documentElement.scrollTop > 40;
    this.cd.markForCheck();
  }
}
