import {Component, OnDestroy, OnInit} from '@angular/core';
import {RestService} from '../../services/rest.service';
import {Subject} from 'rxjs';
import {finalize, takeUntil} from 'rxjs/operators';
import {Router} from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-estate-statistics',
  templateUrl: './estate-statistics.component.html',
  styleUrls: ['./estate-statistics.component.scss']
})
export class EstateStatisticsComponent implements OnInit, OnDestroy {
  isFetching = true;
  displayedColumns: string[] = ['area', 'sell_price', 'rent_price', 'coeff'];
  dataSource: MatTableDataSource<any>;

  private readonly destroy$ = new Subject();

  constructor(private rest: RestService, private router: Router) { }

  ngOnInit(): void {
    this.rest.getEntities('top')
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isFetching = false)
      )
      .subscribe(data => {
        console.log('Top: ', data);
        this.dataSource = new MatTableDataSource(data);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigate(url: string) {
    this.router.navigate([url]);
  }

  onTopEstateClicked(estate: any) {
    console.log('Estate clicked: ', estate);
    const sellUrlAarray = estate.sell_url.split('/');
    const rentUrlArray = estate.rent_url.split('/');


    this.router.navigate([]).then(() => { window.open('/estate?sell=' + sellUrlAarray[sellUrlAarray.length - 1] + '&rent=' +
      rentUrlArray[rentUrlArray.length - 1], '_blank'); });
  }
}
