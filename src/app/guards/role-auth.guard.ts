import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/users/user.service';

@Injectable({
  providedIn: 'root'
})
export class RoleAuthGuard implements CanActivate {
  constructor(private auth: UserService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      const expectedRole = next.data.expectedRole;
      const role = localStorage.getItem('role'); // #FIXME a changer avec un vrais service
      if ( role.toString() !== expectedRole || !this.auth.isLoggedIn()) {
        return false; // FIXME envoyer sur une autre route ?
      }
      return true;
  }
}
