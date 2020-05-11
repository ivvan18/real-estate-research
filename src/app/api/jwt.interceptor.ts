import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaderResponse,
  HttpInterceptor,
  HttpProgressEvent,
  HttpRequest,
  HttpResponse,
  HttpSentEvent,
  HttpUserEvent,
} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {throwError, BehaviorSubject, Observable} from 'rxjs';
import {catchError, filter, switchMap, take} from 'rxjs/operators';

import {environment} from '../../environments/environment';
import {AuthService} from '../pages/auth/services/auth.service';
import {Router} from '@angular/router';

const authPaths = ['/auth/register', '/token/refresh', '/auth/login', '/password/forgot'];

type AnyHttpEvent =
  | HttpSentEvent
  | HttpHeaderResponse
  | HttpProgressEvent
  | HttpResponse<any>
  | HttpUserEvent<any>
  | any;

export const constructHeader = (token: string) => {
  return { Authorization: 'Bearer ' + token };
};

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  refreshActionCode = 401;

  private refreshTokenInProgress = false;
  private refreshTokenSubject = new BehaviorSubject<boolean>(false);

  constructor(private auth: AuthService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<AnyHttpEvent> {
    if (request.url.includes('/token/refresh')) {
      return next.handle(request);
    }

    console.log('Intercepting request: ', request);
    return next.handle(this.addTokenRequest(request)).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === this.refreshActionCode) {
          console.log('Catching 401 error.');
          if (this.refreshTokenInProgress) {
            console.log('step A');

            return this.refreshTokenSubject.pipe(
              filter(inProgress => !inProgress),
              take(1),
              switchMap(() => next.handle(this.addTokenRequest(request))),
            );
          }

          console.log('step B');
          return this.refreshAndRetry(request, next);
        }

        console.log('Throwing error!');
        return throwError(err);
      }),
    );
  }

  private isHeaderRequired(request: HttpRequest<any>): boolean {
    return (
      request.url.includes(environment.restUrl) &&
      !request.url.includes('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address') &&
      authPaths.every(path => !request.url.includes(path))
    );
  }

  private refreshTokenExpired() {
    // this.auth
    //   .logout()
    //   .subscribe(() => this.router.navigate(['auth/login']));

    this.router.navigate(['auth/sign-in']);
  }

  private addTokenRequest(request: HttpRequest<any>): HttpRequest<any> {
    console.log('Adding token to request: ', this.isHeaderRequired(request) && this.auth.accessToken);
    return this.isHeaderRequired(request) && this.auth.accessToken
      ? request.clone({setHeaders: constructHeader(this.auth.accessToken)})
      : request;
  }

  private refreshAndRetry(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    console.log('refreshAndRetry request');

    this.refreshTokenInProgress = true;
    this.refreshTokenSubject.next(true);

    return this.auth.tokenRefresh().pipe(
      catchError(response => {
        console.log('refreshAndRetry request ERROR');
        this.refreshTokenInProgress = false;
        this.refreshTokenExpired();

        return throwError(response.error.error);
      }),
      switchMap(() => {
        console.log('refreshAndRetry request SUCCESS');
        this.refreshTokenInProgress = false;
        this.refreshTokenSubject.next(false);

        return next.handle(this.addTokenRequest(request));
      }),
    );
  }
}
