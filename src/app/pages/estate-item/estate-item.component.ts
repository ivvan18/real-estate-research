import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {RestService} from '../../services/rest.service';
import {NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import {IEstate} from '../../models/IEstate';
import {finalize, takeUntil} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-estate-item',
  templateUrl: './estate-item.component.html',
  styleUrls: ['./estate-item.component.scss']
})
export class EstateItemComponent implements OnInit, OnDestroy {
  isFetching = true;
  estate: IEstate;
  estateId: number;

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  private readonly destroy$ = new Subject();

  constructor(private rest: RestService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.estateId = params.id;
        console.log('EstateId: ', this.estateId);

        this.rest.getEntityById('realty', this.estateId)
          .pipe(
            takeUntil(this.destroy$),
            finalize(() => this.isFetching = false)
          )
          .subscribe(result => {
            console.log('Result: ', result);
            const images = result.realty.images.split(',');
            this.estate = result.realty;

            console.log('images: ', images);
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

            this.galleryImages = images.map(img => ({
              small: img,
              medium: img,
              big: img
            }));
          });
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onCianLinkClicked() {
    window.open(this.estate.url, '_blank');
  }

  navigate(url: string) {
    this.router.navigate([url]);
  }
}
