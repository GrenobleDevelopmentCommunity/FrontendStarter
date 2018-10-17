import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Token } from './services/users/user.service';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!req.headers.get('Authorization')) {
            const token = JSON.parse(localStorage.getItem('token')) as Token;
            const headersToken = new HttpHeaders({
                  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                  'Authorization': 'Baerer ' + token.access_token
                 });
            return next.handle(req.clone({headers: headersToken}));
        }
        return next.handle(req);
    }
}
