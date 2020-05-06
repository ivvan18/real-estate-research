import {Component, OnDestroy, OnInit} from '@angular/core';
import {RestService} from '../../services/rest.service';
import {forkJoin, Subject} from 'rxjs';
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
  colorPalette = ['#3F51B5', '#006CC6', '#0080C5', '#0091B5', '#009E9D', '#05A985'];
  municipalities = [];

  private readonly destroy$ = new Subject();

  constructor(private rest: RestService, private router: Router) { }

  ngOnInit(): void {
    forkJoin(this.rest.getEntities('top'), this.rest.getEntities('districts'))
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isFetching = false)
      )
      .subscribe(([top, districts]) => {
        console.log('Top: ', top);
        this.dataSource = new MatTableDataSource(top);

        console.log('Districts: ', districts);

        districts.districts.forEach(district => {
          const options = {
              fillColor: this.chooseRandomColor(),
              strokeColor: '#0000FF',
              opacity: 0.5,
              strokeWidth: 1,
              strokeStyle: 'solid'
            };

          const coords = (district.type === 'MultiPolygon' ? district.coordinates[0] : district.coordinates).map(pair => {
            const temp = pair[0];
            pair[0] = pair[1];
            pair[1] = temp;

            return pair;
          });

          const feature = {
            geometry: {
              type: 'Polygon',
              coordinates: district.type === 'MultiPolygon' ? coords : [coords],
              fillRule: 'nonZero',
            },
            properties: {
              balloonContentHeader: district.name,
              balloonContentBody:
                '<p>Средняя стоимость за м&#178;: ' + district.avg_sq + ' &#8381;</p>' +
                '<p>Средний срок окупаемости, годы: ' + district.avg_coeff + '</p>',
            }
          };

          this.municipalities.push({
            options,
            feature
          });
        });
      });
  }

  chooseRandomColor(): string {
    return this.colorPalette[this.getRandomInt(0, this.colorPalette.length - 1)];
  }

  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
