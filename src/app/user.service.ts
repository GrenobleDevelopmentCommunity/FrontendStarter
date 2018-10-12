import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { RequestInfo } from 'angular-in-memory-web-api';
import { User } from './user'
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersUrl = 'api/users';
  constructor(private http: HttpClient) { }

  getUser(username: string, password:string): Observable<User> {
    //TODO retourner que le TOKEN
    const url = `${this.usersUrl}?username=^${username}$&password=^${password}$`
    return this.http.get<User>(url).pipe(
      tap( user=> console.log(`User found = ${user}`)),
      catchError(this.handleError<User>(`getUser Username=${username}, password=${password}`))
    );
  
  }


  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
private handleError<T> (operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {

    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead

    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
}
}
