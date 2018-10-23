import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';
import { User, Role } from './user';
import { Timestamp } from '../../../../node_modules/rxjs/internal/operators/timestamp';


export interface Token {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expire_in: number;
  scope: string;
}


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = 'http://localhost:8080';
  private readonly loginUrl = '/oauth/token';
  private readonly logoutUrl = '/oauth/token/revoke';
  private readonly userControler = '/api/users';
  private readonly userMe = '/api/users/me';
  private readonly authorizationKey = 'YmFja2VuZC1hcHA6YmFja2VuZC1zZWNyZXQ=';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<Boolean> {
    const grant_type = 'password';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Authorization': 'Basic ' + this.authorizationKey
       }),
    };
    const params = new HttpParams().set('username', email)
                                   .set('password', password)
                                   .set('grant_type', grant_type)
                                   .toString();
    return this.http.post<Token>(this.baseUrl + this.loginUrl, params, httpOptions).pipe(
      switchMap(
      token => {
        localStorage.setItem('token', JSON.stringify(token));
        console.log(token);
        return this.http.get<any>(this.baseUrl + this.userMe).pipe(
          map(
          (user: User) => {
            console.log(user);
            localStorage.setItem('user', JSON.stringify(user));
            return true;
          },
          () => false)
        );
      })
    );
  }

  isLoggedIn(): boolean {
    // TODO: verifier la validite du token (date expiration)
    return !!localStorage.getItem('token');
  }

  logout(): Observable<void> {
    const token = (JSON.parse(localStorage.getItem('token')) as Token);
    const params = new HttpParams().set('token', token.access_token).toString();
    return this.http.post<void>(this.baseUrl + this.logoutUrl, params/*, httpOptions*/).pipe(
      tap(() => localStorage.clear())
    );
  }

  isAdmin(): boolean {
    if (this.isLoggedIn()) {
      try {
        return (JSON.parse(localStorage.getItem('user')) as User).role === Role.Admin;
      } catch (error) {
        return false;
      }
    }
    return false;
  }


  addUser(email: string, password: string): Observable<User> {
    return this.http.post<User>(this.baseUrl + this.userControler, {email, password});
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl + this.userControler).pipe(
      map(
        (emails: {email: string}[]) => {
          const users: User[] = [];
          for (let index = 0; index < emails.length; index++) {
            const element = emails[index];
            users.push({email: element.email, role: null}); // ASK : role user by default, but don't know if i have to take it
          }
          return users;
        }
      )
    );
  }
}
