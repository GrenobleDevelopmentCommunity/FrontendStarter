import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AutGuard implements CanActivate, CanLoad {
  constructor(private auth: UserService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if (!this.auth.isLoggedIn()) {
        this.router.navigate(['login']);
        return false;
      }
      return true;
  }

  canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
      if (!this.auth.isLoggedIn()) {
        this.router.navigate(['login']);
        return false;
      }
      return true;
  }
}
