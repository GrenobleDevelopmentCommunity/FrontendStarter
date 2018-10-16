import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Token, Role } from '../in-memory-data.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly usersUrl = 'api/users';

  constructor(private http: HttpClient) { }

  authenticateUser(username: string, password: string): Observable<Token> {
    const request = 'login';
    return this.http.post<Token>(this.usersUrl, { username, password, request }).pipe(
      tap(({ token, role }) => {
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        localStorage.setItem('role', role.toString());
      })
    );
  }

  isLoggedIn(): boolean {
    // TODO: verifier la validite du token (date expiration)
    return !!localStorage.getItem('token');
  }

  logout(): Observable<void> {
    const token = localStorage.getItem('token');
    const request = 'logout';
    return this.http.post<void>(this.usersUrl, { token, request }).pipe(
      tap(() => localStorage.clear())
    );
  }

  isAdmin(): boolean {
    return localStorage.getItem('role') === Role.Admin.toString();
  }
}
