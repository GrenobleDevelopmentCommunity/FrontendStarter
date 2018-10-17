import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User, Role } from './user';


export interface Token {
  access_token: string;
  token_type: string;
  refresh_token: string;
  scope: string;
}


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = 'http://localhost:8080';
  private readonly loginUrl = '/oauth/token';
  private readonly logoutUrl = '/oauth/token/revoke';
  private readonly authorizationKey = 'YmFja2VuZC1hcHA6YmFja2VuZC1zZWNyZXQ=';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<Token> {
    const grant_type = 'password';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Authorization': 'Basic ' + this.authorizationKey
       }),
    };
    const params = new HttpParams().set('username', username)
                                   .set('password', password)
                                   .set('grant_type', grant_type)
                                   .toString();
    // tslint:disable-next-line:max-line-length
    return this.http.post<Token>(this.baseUrl + this.loginUrl, params,
     httpOptions).pipe(
      tap((token => {
        localStorage.setItem('token', JSON.stringify(token));
        console.log(JSON.stringify(token));
      })));
  }

  isLoggedIn(): boolean {
    // TODO: verifier la validite du token (date expiration)
    return !!localStorage.getItem('token');
  }

  logout(): Observable<void> {
    const token = JSON.parse(localStorage.getItem('token')) as Token;
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    //     'Authorization': 'Baerer ' + token.access_token
    //    }),
    // };
    const params = new HttpParams().set('token', token.access_token).toString();
    return this.http.post<void>(this.baseUrl + this.logoutUrl, params/*, httpOptions*/).pipe(
      tap(() => localStorage.clear())
    );
  }

  isAdmin(): boolean {
    return localStorage.getItem('role') === Role.Admin.toString();
  }
}
