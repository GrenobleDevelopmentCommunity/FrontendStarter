import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { isDefined } from '../../node_modules/@angular/compiler/src/util';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly usersUrl = 'api/users';

  constructor(private http: HttpClient) { }

  authenticateUser(username: string, password: string): Observable<boolean> {
    const subject = new Subject<boolean>();
    const request = 'login';
    this.http.post<string>(this.usersUrl, { username, password, request }).subscribe(
      (body) => {
        localStorage.setItem('token', body);
        localStorage.setItem('username', username);
        subject.next(true);
      },
      () => subject.next(false)
      );

      return subject.asObservable();
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (isDefined(token)) {
      // TODO verifier la validite du token (date expiration)
      return true;
    }
    return false;
  }

  logout(): Observable<boolean> {
    const subject = new Subject<boolean>();
    const request = 'logout';
    const token = localStorage.getItem('token');
    this.http.post<string>(this.usersUrl, { token, request }).subscribe(
      (body) => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        subject.next(true);
      },
      () => subject.next(false)
      );

      return subject.asObservable();
  }
}
