import { Component, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  @ViewChild('drawer') public sidenav: MatSidenav;
  errorMessage = null;
  successMessage = null;
  fadeOutTimer = null;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private router: Router, private breakpointObserver: BreakpointObserver,
    public userservice: UserService) {}

  logout() {
    // close();
    this.userservice.logout().subscribe(
      () => {
        this.successMessage = 'Logged out with succes';
        this.router.navigate(['login']);
      },
      () => {
        this.errorMessage = 'Error while login out';
      }
    );
    this.fadeOutTimer = timer(3000);
    const fadeOutMessages = this.fadeOutTimer.subscribe(
      () => {
        console.log('fadeOut');
        this.errorMessage = null;
        this.successMessage = null;
      }
    );
  }

  isAdmin(): boolean {
    return this.userservice.isAdmin();
  }

  close(): void {
    this.isHandset$.subscribe(
      (isHandset) => {
        if (isHandset) {
          this.sidenav.close();
        }
      }
    );
  }

  }
