import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Token } from './services/users/user.service';
import { User } from './services/users/user';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // For logout
        if (!req.headers.get('Authorization') && req.url.includes('oauth')) {
            const token = (JSON.parse(localStorage.getItem('token')) as Token);
            const headersToken = new HttpHeaders({
                  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                  'Authorization': 'Baerer ' + token.access_token
                 });
            return next.handle(req.clone({headers: headersToken}));
        }

        // For API
        if (!req.headers.get('Authorization') && req.url.includes('api')) {
            const token = (JSON.parse(localStorage.getItem('token')) as Token);
            const headers = new HttpHeaders({
                  Authorization: `Bearer ${token.access_token}`
                 });
            return next.handle(req.clone({headers}));
        }
        return next.handle(req);
    }
}
