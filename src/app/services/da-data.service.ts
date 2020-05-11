import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DaDataService {
  apiUrl = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';
  apiKey = 'cf46cd79b7405f949bfd0256d8f7193fc8edc652';
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Token ${this.apiKey}`
  });

  constructor(private http: HttpClient) { }

  getAddress(input: string, count: number): Observable<any> {
    return this.http.post(this.apiUrl, {query: input, count}, {headers: this.headers});
  }
}
