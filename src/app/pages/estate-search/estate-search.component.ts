import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {RestService} from '../../services/rest.service';
import {finalize, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-estate-search',
  templateUrl: './estate-search.component.html',
  styleUrls: ['./estate-search.component.scss']
})
export class EstateSearchComponent implements OnInit, OnDestroy {
  estates: any[];
  estatesLoading = true;
  estateSearchFormGroup: FormGroup;

  private readonly destroy$ = new Subject();

  constructor(private rest: RestService,
              private ngZone: NgZone,
              private router: Router,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    const numericRegex = /^[a-zA-Z0-9]+$/;

    this.estateSearchFormGroup = this.formBuilder.group(
      {
        address: ['', Validators.required],
        roomNumber: ['', [Validators.required, Validators.pattern(numericRegex)]],
        square: ['', Validators.required, Validators.pattern(numericRegex)],
        floor: ['', Validators.required, Validators.pattern(numericRegex)]
      }
    );

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
    this.ngZone.run(() => this.router.navigate(['estate', estateId]));
  }

  navigate(url: string) {
    this.router.navigate([url]);
  }
}
