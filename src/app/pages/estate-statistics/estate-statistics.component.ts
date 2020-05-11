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
  administries = [];

  private readonly destroy$ = new Subject();

  constructor(private rest: RestService, private router: Router) { }

  ngOnInit(): void {
    forkJoin(
      this.rest.getEntities('top'),
      this.rest.getEntities('districts'),
      this.rest.getEntities('ao'),
      this.rest.getEntities('ao_coords')
    ).pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isFetching = false)
      )
      .subscribe(([top, districts, aos, aoCoords]) => {
        console.log('Top: ', top);
        this.dataSource = new MatTableDataSource(top);

        console.log('Districts: ', districts);

        console.log('Aos: ', aos);
        console.log('Ao_coords: ', aoCoords);

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

        aos.ao.forEach(ao => {
          const options = {
            fillColor: '#DC143C',
            strokeColor: '#FF0000',
            opacity: 0.5,
            strokeWidth: 4,
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
                '<p>Средняя стоимость за м&#178;: ' + ao.avg_sq + ' &#8381;</p>' +
                '<p>Средний срок окупаемости, годы: ' + ao.avg_coeff + '</p>',
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
