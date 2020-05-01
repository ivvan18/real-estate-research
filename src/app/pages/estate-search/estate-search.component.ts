import {ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {RestService} from '../../services/rest.service';
import {finalize, takeUntil} from 'rxjs/operators';
import {forkJoin, Subject} from 'rxjs';
import {FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {IEvent} from 'angular8-yandex-maps';
import {IMapEstate} from '../../models/IMapEstate';

@Component({
  selector: 'app-estate-search',
  templateUrl: './estate-search.component.html',
  styleUrls: ['./estate-search.component.scss']
})
export class EstateSearchComponent implements OnInit, OnDestroy {
  estates: IMapEstate[];
  selectedEstate: IMapEstate;
  previousClickedEstate: any;
  screenLoading = true;
  estatesLoading = true;
  coeffMin: number;
  coeffMax: number;
  squareMin: number;
  squareMax: number;
  priceMin: number;
  priceMax: number;

  coeffSelectedMin = 12;
  coeffSelectedMax = 29;
  squareSelectedMin = 50;
  squareSelectedMax = 60;
  priceSelectedMin = 21000000;
  priceSelectedMax = 40000000;

  averagePayback: number;
  recordsCount: number;
  flatsCount: number;
  MyBalloonContentLayoutClass: any;

  private readonly destroy$ = new Subject();

  constructor(private rest: RestService,
              private ngZone: NgZone,
              private router: Router,
              private cd: ChangeDetectorRef,
              private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    forkJoin(
      {
        averagePayback: this.rest.getEntities('payback'),
        recordsCount: this.rest.getEntities('records'),
        flatsCount: this.rest.getEntities('flats'),
        intervals: this.rest.getEntities('intervals')
      }
    )
    .pipe(
      takeUntil(this.destroy$),
      finalize(() => this.screenLoading = false)
    )
    .subscribe(result => {
      console.log('Result: ', result);
      this.averagePayback = result.averagePayback['Average payback period'];
      this.recordsCount = result.recordsCount['Total records'];
      this.flatsCount = result.flatsCount['Total flats'];
      this.coeffSelectedMin = this.coeffMin = result.intervals.coeffMin;
      this.coeffSelectedMax = this.coeffMax = result.intervals.coeffMax;
      this.squareSelectedMin = this.squareMin = result.intervals.squareMin;
      this.squareSelectedMax = this.squareMax = result.intervals.squareMax;
      this.priceSelectedMin = this.priceMin = result.intervals.priceMin;
      this.priceSelectedMax = this.priceMax = result.intervals.priceMax;
      console.log('Result: ', this.averagePayback, this.recordsCount, this.flatsCount);

      this.onSearchEstatesClicked();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchEstatesClicked() {
    this.estatesLoading = true;

    const filters = {
      squareMin: this.squareSelectedMin,
      squareMax: this.squareSelectedMax,
      coeffMin: this.coeffSelectedMin,
      coeffMax: this.coeffSelectedMax,
      priceMin: this.priceSelectedMin,
      priceMax: this.priceSelectedMax
    };

    this.rest.getEntities('filter', filters)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.estatesLoading = false)
      )
      .subscribe(data => {
        console.log('Getting data: ', data);
        this.estates = data;
      });
  }

  onEstatePlacemarkClicked(url: string) {
    const strings = url.split('/');
    this.router.navigate([]).then(() => { window.open('/estate/' + strings[strings.length - 1], '_blank'); });
  }

  onEstatePlacemarkClickedNew(sellUrl: string, rentUrl: string) {
    const sellUrlAarray = sellUrl.split('/');
    const rentUrlArray = rentUrl.split('/');


    this.router.navigate([]).then(() => { window.open('/estate?sell=' + sellUrlAarray[sellUrlAarray.length - 1] + '&rent=' +
      rentUrlArray[rentUrlArray.length - 1], '_blank'); });
  }

  navigate(url: string) {
    this.router.navigate([url]);
  }

  onEstateClicked(event: IEvent, estate: IMapEstate): void {
    this.ngZone.run(() => {
      console.log(estate);
      this.selectedEstate = estate;

      if (this.previousClickedEstate) {
        this.previousClickedEstate.options.unset('preset');
      }

      this.previousClickedEstate = event.instance;

      this.previousClickedEstate.options.set('preset', 'islands#greenIcon');

      this.cd.markForCheck();
    });
  }
}
