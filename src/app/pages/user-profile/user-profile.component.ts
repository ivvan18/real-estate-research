import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth/services/auth.service';
import {IUser} from '../auth/models/IUser';
import {RestService} from '../../services/rest.service';
import {MatTableDataSource} from '@angular/material/table';
import {Subject} from 'rxjs';
import {switchMap, takeUntil, tap} from 'rxjs/operators';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  isFetching = true;
  favsEmpty = true;

  displayedColumns: string[] = ['area', 'price', 'rentArea', 'rentPrice', 'delete'];
  dataSource: MatTableDataSource<any>;
  user: IUser;

  private readonly destroy$ = new Subject();

  constructor(private router: Router, private auth: AuthService, private rest: RestService) { }

  ngOnInit(): void {
    this.auth.user$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((user: IUser) => {
          console.log('User updated: ', user);
          this.user = user;

          return this.rest.getEntities('favourites')
            .pipe(
              tap(result => {
                console.log('Favourites: ', result);
                this.favsEmpty = result.favourites.length === 0;
                this.dataSource = new MatTableDataSource(result.favourites.map(arr =>
                  ({ id: arr[0].realty.id, area: arr[0].realty.area, price: arr[0].realty.price,
                    rentArea: arr[1].realty.area, rentPrice: arr[1].realty.price, rentId: arr[1].realty.id})));
              })
            );
        })
      )
      .subscribe(() => this.isFetching = false);

    this.auth.init();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  favDelete(event: any, element: any) {
    event.stopPropagation();
    this.resetState();
    console.log('favDelete: ', element);
    this.rest.postEntity('remove_favourite', {sell: element.id, rent: element.rentId})
      .subscribe(() => {
        this.ngOnInit();
      });
  }

  deleteAllFavs() {
    console.log('delete all favs');
    this.resetState();

    this.rest.postEntity('empty_favourites', {})
      .subscribe(() => {
        this.ngOnInit();
      });
  }

  navigate(url: string) {
    this.router.navigate([url]);
  }

  resetState() {
    this.isFetching = true;
    this.favsEmpty = true;
  }

  onFavEstateClicked(sellId: string, rentId: string) {
    this.router.navigate([]).then(() => { window.open('/estate?sell=' + sellId + '&rent=' + rentId, '_blank'); });
  }
}
