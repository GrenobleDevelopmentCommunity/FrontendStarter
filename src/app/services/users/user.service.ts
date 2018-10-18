import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
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
  private readonly userControler = '/api/users';
  private readonly authorizationKey = 'YmFja2VuZC1hcHA6YmFja2VuZC1zZWNyZXQ=';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<Token> {
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
    // tslint:disable-next-line:max-line-length
    return this.http.post<Token>(this.baseUrl + this.loginUrl, params,
     httpOptions).pipe(
      tap((token => {
        // FIXME: change role
        const user: User = { email, role: Role.Admin, token};
        localStorage.setItem('user', JSON.stringify(user));
        console.log(JSON.stringify(token));
      })));
  }

  isLoggedIn(): boolean {
    // TODO: verifier la validite du token (date expiration)
    return !!localStorage.getItem('user');
  }

  logout(): Observable<void> {
    const token = (JSON.parse(localStorage.getItem('user')) as User).token;
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
    if (this.isLoggedIn()) {
      return (JSON.parse(localStorage.getItem('user')) as User).role === Role.Admin;
    }
    return false;
  }


  addUser(email: string, password: string): Observable<User> {
    return this.http.post<User>(this.baseUrl + this.userControler, {email, password}// ,
      // {headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: 'Bearer fe243f70-a05c-4311-8b3e-04a47c214d28'
      //    }
      // }
      );
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl + this.userControler).pipe(
      map(
        (emails: {email: string}[]) => {
          const users: User[] = [];
          for (let index = 0; index < emails.length; index++) {
            const element = emails[index];
            users.push({email: element.email, role: null, token: null});
          }
          return users;
        }
      )
    );
  }
}
