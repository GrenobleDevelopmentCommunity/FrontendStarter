import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/users/user.service';

@Injectable({
  providedIn: 'root'
})
export class AutGuard implements CanActivate {
  constructor(private auth: UserService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
      if (!this.auth.isLoggedIn()) {
        this.router.navigate(['login'], { replaceUrl: true });
        return false;
      }
      return true;
  }
}
