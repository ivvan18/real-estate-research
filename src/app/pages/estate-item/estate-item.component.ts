import {Component, OnDestroy, OnInit} from '@angular/core';
import {forkJoin, Subject} from 'rxjs';
import {RestService} from '../../services/rest.service';
import {NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import {IEstate} from '../../models/IEstate';
import {finalize, map, switchMap, takeUntil} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-estate-item',
  templateUrl: './estate-item.component.html',
  styleUrls: ['./estate-item.component.scss']
})
export class EstateItemComponent implements OnInit, OnDestroy {
  doubleState = false;
  isFetching = true;
  estate: IEstate;
  estateId: number;
  addFavFetching = false;

  currentTabIndex = 0;
  rentEstate: IEstate;

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  rentGalleryImages: NgxGalleryImage[];

  private readonly destroy$ = new Subject();

  constructor(private rest: RestService,
              private route: ActivatedRoute,
              private router: Router,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.galleryOptions = [
      {
        width: '600px',
        height: '400px',
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide
      },
      // max-width 800
      {
        breakpoint: 800,
        width: '100%',
        height: '600px',
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20
      },
      // max-width 400
      {
        breakpoint: 400,
        preview: false
      }
    ];

    this.route.queryParams
      .pipe(
        takeUntil(this.destroy$),
        switchMap(params => {
          if (params.sell && params.rent) {
            this.doubleState = true;
            return forkJoin(this.rest.getEntityById('realty', params.sell), this.rest.getEntityById('realty', params.rent))
              .pipe(
                map(result => ({sell: result[0].realty, rent: result[1].realty})),
                finalize(() => this.isFetching = false));
          } else {
            return this.route.params.pipe(
              switchMap(
                parameters => {
                  this.estateId = parameters.id;
                  console.log('EstateId: ', this.estateId);

                  return this.rest.getEntityById('realty', this.estateId)
                    .pipe(
                      takeUntil(this.destroy$),
                      finalize(() => this.isFetching = false)
                    );
                }
              )
            );
          }
        })
      )
      .subscribe((result: any) => {
        console.log('Result: ', result);
        if (this.doubleState) {
          this.estate = result.sell;
          this.rentEstate = result.rent;
          this.setRentGalleryImages(result.rent.images.split(','));
        } else {
          this.estate = result.realty;
        }

        this.setGalleryImages(this.estate.images.split(','));
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setGalleryImages(images: string[]) {
    this.galleryImages = images.map(img => ({
      small: img,
      medium: img,
      big: img
    }));
  }

  setRentGalleryImages(images: string[]) {
    this.rentGalleryImages = images.map(img => ({
      small: img,
      medium: img,
      big: img
    }));
  }

  onCianLinkClicked(estate: IEstate) {
    window.open(estate.url, '_blank');
  }

  navigate(url: string) {
    this.router.navigate([url]);
  }

  addToFavorite() {
    this.addFavFetching = true;

    this.rest.postEntity('add_favourite', {sell: this.estate.id, rent: this.rentEstate.id})
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.addFavFetching = false)
      )
      .subscribe(result => {
        console.log('Added to favourites: ', result);
        this.openSnackBar(result.message, 'Ok');
      }, error => {
        console.log('Error Adding to favourites: ', error);
        this.openSnackBar(error.error.message, 'Ok');
      });
  }

  onTabChange(event: any) {
    console.log('onTabChange: ', event);
    this.currentTabIndex = event.index;
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
