import {Component, OnDestroy, OnInit} from '@angular/core';
import {RestService} from '../../services/rest.service';
import {finalize, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-estate-search',
  templateUrl: './estate-search.component.html',
  styleUrls: ['./estate-search.component.scss']
})
export class EstateSearchComponent implements OnInit, OnDestroy {
  estates: any[];
  estatesLoading = true;
  private readonly destroy$ = new Subject();

  constructor(private rest: RestService) { }

  ngOnInit(): void {
    this.rest.getEntities('data')
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.estatesLoading = false)
      )
      .subscribe(data => {
      console.log('Getting data: ', data);
      this.estates = data;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }


  onEstatePlacemarkClicked(estateId: number) {
    const estateClicked = this.estates.find(estate => estate.id === estateId);
    console.log('Clicked on estate: ', estateClicked);
  }

}
