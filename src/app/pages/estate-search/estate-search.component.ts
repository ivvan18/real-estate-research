import {ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {RestService} from '../../services/rest.service';
import {debounceTime, filter, finalize, switchMap, takeUntil, tap} from 'rxjs/operators';
import {forkJoin, Subject} from 'rxjs';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {IEvent} from 'angular8-yandex-maps';
import {IMapEstate} from '../../models/IMapEstate';
import {DaDataService} from '../../services/da-data.service';
import {AreasMatcher, checkAreas, checkFloors, FloorsMatcher} from '../auth/util/util';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-estate-search',
  templateUrl: './estate-search.component.html',
  styleUrls: ['./estate-search.component.scss']
})
export class EstateSearchComponent implements OnInit, OnDestroy {
  @ViewChild('rules') rules: TemplateRef<any>;

  estimateFormGroup: FormGroup;
  areasMatcher = new AreasMatcher();
  floorsMatcher = new FloorsMatcher();
  hasEstimateFormErrors = false;
  estimateEstateLoading = false;
  estimatedPrice: number;

  addressSearchString = new FormControl('');
  areAddressesLoading: boolean;
  addressedNotFound = false;
  addressLat: number;
  addressLon: number;
  addressOptions = [];
  isEstateEstimate = true;
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

  wallMaterials = [
    {value: 0, viewValue: 'Неизвестно'},
    {value: 1, viewValue: 'Блок'},
    {value: 2, viewValue: 'Кирпич'},
    {value: 3, viewValue: 'Монолит'},
    {value: 4, viewValue: 'Монолитный блок'},
    {value: 5, viewValue: 'Старое'},
    {value: 6, viewValue: 'Панелька'},
    {value: 7, viewValue: 'Сталинка'},
    {value: 8, viewValue: 'Дерево'},
  ];

  private readonly destroy$ = new Subject();

  constructor(private rest: RestService,
              private ngZone: NgZone,
              private router: Router,
              private daData: DaDataService,
              private dialog: MatDialog,
              private cd: ChangeDetectorRef,
              private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.estimateFormGroup = this.formBuilder.group(
      {
        address: ['', Validators.required],
        totalArea: ['', [Validators.required, Validators.min(0), Validators.max(10000)]],
        kitchenArea: ['', [Validators.required, Validators.min(0)]],
        wallsMaterial: ['', Validators.required],
        floorsTotal: ['', [Validators.required, Validators.pattern(/^[0-9]*[1-9][0-9]*$/), Validators.max(100)]],
        floorNumber: ['', [Validators.required, Validators.pattern(/^[0-9]*[1-9][0-9]*$/)]],
      },
      {validators: [checkFloors, checkAreas]}
    );

    this.estimateFormGroup.valueChanges
      .subscribe(() => this.getFormValidationErrors());

    this.subscribeAddressChanges();

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

  handleAddressInputEvent(event: any) {
    event.stopPropagation();
  }

  onAddressClicked(address: any) {
    this.daData.getAddress(address.value, 1).subscribe(data => {
      console.log('Address clicked: ', data);
      this.addressLat = data.suggestions[0].data.geo_lat;
      this.addressLon = data.suggestions[0].data.geo_lon;
      console.log('Coordinates: ', this.addressLat, this.addressLon);
    });
  }

  onEstimateEstateClicked() {
    this.estimateEstateLoading = true;

    const filters = this.estimateFormGroup.getRawValue();
    delete filters.address;
    filters.latitude = this.addressLat;
    filters.longitude = this.addressLon;

    console.log('onEstimateEstateClicked: ', filters);

    this.rest.getEntities('estimate', filters)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.estimateEstateLoading = false)
      )
      .subscribe(data => {
        console.log('Getting prediction data: ', data);
        this.estimatedPrice = data['Predicted price'];
      });
  }

  getFormValidationErrors() {
    let hasErrors = false;
    Object.keys(this.estimateFormGroup.controls).forEach(key => {

      const controlErrors: ValidationErrors = this.estimateFormGroup.get(key).errors;
      if (controlErrors != null) {
        hasErrors = true;
        Object.keys(controlErrors).forEach(keyError => {
          console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
      } else {
        console.log('Key control: ' + key + ' has no errors');
      }
    });

    this.hasEstimateFormErrors = hasErrors;
  }

  onRulesClicked() {
    console.log('onRulesClicked');
    this.dialog.open(this.rules, {width: '600px'});
  }

  private subscribeAddressChanges() {
    this.addressSearchString.valueChanges
      .pipe(
        tap(() => {
          console.log('Change!!');
          this.areAddressesLoading = true;
        }),
        debounceTime(500),
        tap(request => {
          if (!request) {
            this.areAddressesLoading = false;
            this.addressOptions = [];
          }
        }),
        filter(request => !!request),
        switchMap(data => this.daData.getAddress('Москва ' + data, 5)),
        tap(() => (this.areAddressesLoading = false))
      )
      .subscribe((data: any) => {
        console.log('Addresses loaded: ', data);
        this.addressedNotFound = data.suggestions.length === 0;
        this.addressOptions = data.suggestions;
      });
  }
}
