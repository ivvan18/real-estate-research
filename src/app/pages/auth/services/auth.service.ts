import { Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {forkJoin, Observable, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {IUser} from '../models/IUser';
import {map} from 'rxjs/operators';
import {IAuthData} from '../models/IAuthData';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly authUrl = environment.restUrl;
  private readonly accessTokenKey = 'access_token';
  private readonly refreshTokenKey = 'refresh_token';
  user: any;
  readonly userKey = 'user';
  user$: any = new Subject();

  constructor(private http: HttpClient) {}

  private decodeUser(token: string = localStorage[this.accessTokenKey]): any {
    let user: any;

    if (!token) {
      return null;
    }

    try {
      // if localStorage.token has not base-64 format
      user = JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.warn(e);

      return null;
    }

    return {
      ...user,
      access_token: this.accessToken,
      refresh_token: this.refreshToken
    };
  }

  private saveUserTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  }

  private saveUser(user: IUser) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.user$.next(this.user.identity);
  }

  private deleteUserTokens() {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }

  private deleteUser() {
    localStorage.removeItem(this.userKey);
    this.user$.next(null);
  }

  get accessToken(): string {
    return localStorage.getItem(this.accessTokenKey) || null;
  }

  get refreshToken(): string {
    return localStorage.getItem(this.refreshTokenKey);
  }

  get isLoggedIn() {
    return !!this.accessToken;
  }

  get currentUser(): IUser {
    if (!this.user) {
      this.user = this.decodeUser(this.accessToken);
    }

    console.log('currentUser: ', this.user);

    return this.user.identity as IUser;
  }

  init() {
    console.log('Init');
    if (this.isLoggedIn) {
      this.user = this.decodeUser(this.accessToken);
      this.user$.next(this.user.identity);
    } else {
      this.user$.next(null);
    }
  }

  login(authData: IAuthData): Observable<any> {
    return this.http.post(this.authUrl + '/login', authData).pipe(
      map((response: any) => {
        console.log(response);
        this.saveUserTokens(response[this.accessTokenKey], response[this.refreshTokenKey]);
        this.user = this.decodeUser(response[this.accessTokenKey]);
        this.saveUser(this.user.identity);
        console.log('Login Decoded user: ', this.user);
        return response;
      }),
    );
  }

  logout(): Observable<any> {
    const logoutAccessToken = this.http.post(this.authUrl + '/logout/access', {}, {headers: {Authorization: 'Bearer ' + this.accessToken}});
    const logoutRefreshToken = this.http.post(this.authUrl + '/logout/refresh', {}, {headers: {Authorization: 'Bearer ' + this.refreshToken}});
    this.deleteUserTokens();
    this.deleteUser();

    return forkJoin(logoutAccessToken, logoutRefreshToken);
  }

  tokenRefresh(): Observable<any> {
    const refreshToken = this.refreshToken;
    const data = {refresh_token: refreshToken};

    this.deleteUserTokens();
    this.deleteUser();

    return this.http.post(this.authUrl + '/token/refresh', data, {headers: {Authorization: 'Bearer ' + refreshToken}}).pipe(
      map(response => {
        console.log('tokenRefresh: ', response);

        // Note that RefreshAPI doesn't return refresh
        // token as well and we have to preserve existing one
        this.saveUserTokens(response[this.accessTokenKey], response[this.refreshTokenKey]);
        this.user = this.decodeUser(response[this.accessTokenKey]);
        this.saveUser(this.user.identity);
        return response;
      }),
    );
  }

  register(authData: IAuthData): Observable<any> {
    return this.http.post(this.authUrl + '/register', authData).pipe(
      map((response: any) => {
        console.log(response);
        this.saveUserTokens(response[this.accessTokenKey], response[this.refreshTokenKey]);
        this.user = this.decodeUser(response[this.accessTokenKey]);
        this.saveUser(this.user.identity);
        console.log('Register Decoded user: ', this.user);
        return response;
      }),
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(this.authUrl + '/password/forgot', {email});
  }

  resetPasswordViaEmail(token: string, newPassword: string): Observable<any>  {
    return this.http.post(this.authUrl + '/password/forgot/reset/' + token, {new_password: newPassword}).pipe(
      map((response: any) => {
        console.log(response);
        this.saveUserTokens(response[this.accessTokenKey], response[this.refreshTokenKey]);
        this.user = this.decodeUser(response[this.accessTokenKey]);
        this.saveUser(this.user.identity);
        console.log('resetPasswordViaEmail Decoded user: ', this.user);
        return response;
      }),
    );
  }

  changePassword(currentPassword: string, password: string) {
    return this.http.post(this.authUrl + '/password/change', {current_password: currentPassword, new_password: password});
  }
}
