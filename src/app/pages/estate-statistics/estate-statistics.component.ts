import {Component, OnDestroy, OnInit} from '@angular/core';
import {RestService} from '../../services/rest.service';
import {forkJoin, Subject} from 'rxjs';
import {finalize, takeUntil} from 'rxjs/operators';
import {Router} from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';
import {CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-estate-statistics',
  templateUrl: './estate-statistics.component.html',
  styleUrls: ['./estate-statistics.component.scss']
})
export class EstateStatisticsComponent implements OnInit, OnDestroy {
  isFetching = true;
  displayedColumns: string[] = ['area', 'sell_price', 'rent_price', 'coeff'];
  displayedUnderratedColumns: string[] = ['price', 'predicted', 'diff'];
  displayedOverratedColumns: string[] = ['price', 'predicted', 'diff'];

  dataSource: MatTableDataSource<any>;
  dataUnderratedSource: MatTableDataSource<any>;
  dataOverratedSource: MatTableDataSource<any>;

  greenRedPalette = ['#508104', '#9e8e01', '#f3b800', '#db8200', '#b64201'];
  municipalities = [];
  municipalitiesSqMeterPrices = [];
  municipalitiesCoeffs = [];
  municipalitiesFetching = false;
  administries = [];
  administriesSqMeterPrices = [];
  administriesCoeffs = [];
  administriesFetching = false;

  private readonly destroy$ = new Subject();

  constructor(private rest: RestService, private router: Router, private currencyPipe: CurrencyPipe) { }

  ngOnInit(): void {
    forkJoin(
      this.rest.getEntities('top'),
      this.rest.getEntities('districts'),
      this.rest.getEntities('ao'),
      this.rest.getEntities('ao_coords'),
      this.rest.getEntities('compare')
    ).pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isFetching = false)
      )
      .subscribe(([top, districts, aos, aoCoords, compare]) => {
        console.log('Top: ', top);
        this.dataSource = new MatTableDataSource(top);

        console.log('Districts: ', districts);

        console.log('Aos: ', aos);
        console.log('Ao_coords: ', aoCoords);

        console.log('compare: ', compare);

        this.dataUnderratedSource = new MatTableDataSource(compare.Data.slice(0, 10)
          .map(item => ({id: item.id, price: item.price, predicted: item.predicted, diff: Math.abs(item.price - item.predicted)})));
        this.dataOverratedSource = new MatTableDataSource(compare.Data.slice(10, 20)
          .map(item => ({id: item.id, price: item.price, predicted: item.predicted, diff: Math.abs(item.price - item.predicted)})));
        this.municipalitiesSqMeterPrices = districts.districts.map(district => district.avg_sq).sort((a, b) => a - b);
        this.municipalitiesCoeffs = districts.districts.map(district => district.avg_coeff).sort((a, b) => a - b);

        console.log('municipalitiesSqMeterPrices: ', this.municipalitiesSqMeterPrices);
        console.log('municipalitiesCoeffs: ', this.municipalitiesCoeffs);

        districts.districts.forEach(district => {
          const options = {
              fillColor: this.chooseClusterColor(this.municipalitiesSqMeterPrices, district.avg_sq),
              strokeColor: '#0000FF',
              opacity: 0.7,
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
                '<p>Средняя стоимость за м&#178;: ' + (this.currencyPipe.transform(district.avg_sq, '&#8381;') || 'Нет данных') + ' </p>' +
                '<p>Средний срок окупаемости, годы: ' + (district.avg_coeff || 'Нет данных') + '</p>',
              avg_sq: district.avg_sq,
              avg_coeff: district.avg_coeff
            }
          };

          this.municipalities.push({
            options,
            feature
          });
        });

        this.administriesSqMeterPrices = aos.ao.map(ao => ao.avg_sq).sort((a, b) => a - b);
        this.administriesCoeffs = aos.ao.map(ao => ao.avg_coeff).sort((a, b) => a - b);
        console.log('administriesSqMeterPrices: ', this.administriesSqMeterPrices);
        console.log('administriesCoeffs: ', this.administriesCoeffs);

        aos.ao.forEach(ao => {
          const options = {
            fillColor: this.chooseClusterColor(this.administriesSqMeterPrices, ao.avg_sq),
            strokeColor: '#0000FF',
            opacity: 0.7,
            strokeWidth: 2,
            strokeStyle: 'solid'
          };

          const additionalCoords = aoCoords.features.find(feat => feat.properties.NAME === ao.name).geometry.coordinates;

          let coords = [];

          if (ao.type === 'Polygon') {
            additionalCoords.forEach(addCoords => {
              const revertedCoords = addCoords.map(pair => {
                const temp = pair[0];
                pair[0] = pair[1];
                pair[1] = temp;

                return pair;
              });

              console.log('addCoords: ', addCoords[0]);

              coords.push(revertedCoords);
            });
          } else {
            additionalCoords.forEach((addCoords, index) => {
              coords.push([]);
              addCoords.forEach((addInnerCoords, innerIndex) => {
                coords[index].push([]);
                const revertedCoords = addInnerCoords.map(pair => {
                  const temp = pair[0];
                  pair[0] = pair[1];
                  pair[1] = temp;

                  return pair;
                });

                coords[index][innerIndex] = revertedCoords;
              });
            });
          }

          if (ao.type !== 'Polygon') {
            coords = coords.map(coord => coord[0]);
          }

          const feature = {
            geometry: {
              type: 'Polygon',
              coordinates: coords,
              fillRule: 'nonZero',
            },
            properties: {
              balloonContentHeader: ao.name,
              balloonContentBody:
                '<p>Средняя стоимость за м&#178;: ' + (this.currencyPipe.transform( ao.avg_sq, ' &#8381;') || 'Нет данных') + ' </p>' +
                '<p>Средний срок окупаемости, годы: ' + (ao.avg_coeff || 'Нет данных') + '</p>',
              avg_sq: ao.avg_sq,
              avg_coeff: ao.avg_coeff
            }
          };

          this.administries.push({
            options,
            feature
          });
        });
        console.log('municipalities: ', this.municipalities);
        console.log('administries: ', this.administries);
      });
  }

  chooseClusterColor(entities: number[], entity: number) {
    if (!entity) {
      return '#757575';
    }

    entities = entities.filter(ent => !!ent);

    const clustersNumber = this.greenRedPalette.length;
    const clusterLength = entities.length / clustersNumber;

    const entityIndex = entities.findIndex(ent => ent === entity);

    const clusterIndexes = [...Array(clustersNumber).keys()];

    for (const clusterIndex of clusterIndexes) {
      if (entityIndex < (clusterIndex + 1) * clusterLength) {
        return this.greenRedPalette[clusterIndex];
      }
    }

    return this.greenRedPalette[clustersNumber - 1];
  }

  onMunicipalitiesMapTypeChanged(value: any) {
    console.log(this.municipalities);
    this.municipalitiesFetching = true;

    this.municipalities.forEach(municipality => {
      municipality.options.fillColor = this.chooseClusterColor(value.value === 'coeff' ?
        this.municipalitiesCoeffs : this.municipalitiesSqMeterPrices, value.value === 'coeff' ?
        municipality.feature.properties.avg_coeff : municipality.feature.properties.avg_sq);
    });

    setTimeout(() => {
      this.municipalitiesFetching = false;
    }, 100);
  }

  onAdministriesMapTypeChanged(value: any) {
    console.log(this.administries);
    this.administriesFetching = true;

    this.administries.forEach(administry => {
      administry.options.fillColor = this.chooseClusterColor(value.value === 'coeff' ?
        this.administriesCoeffs : this.administriesSqMeterPrices, value.value === 'coeff' ?
        administry.feature.properties.avg_coeff : administry.feature.properties.avg_sq);
    });

    setTimeout(() => {
      this.administriesFetching = false;
    }, 100);
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

  onUnderOverClicked(estate: any) {
    this.router.navigate([]).then(() => { window.open('/estate/' + estate.id, '_blank'); });
  }
}
