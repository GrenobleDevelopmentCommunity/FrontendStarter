import { Component, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState, MediaMatcher } from '@angular/cdk/layout';
import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from '../services/users/user.service';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnDestroy {
  @ViewChild('drawer') public sidenav: MatSidenav;
  errorMessage = null;
  successMessage = null;
  fadeOutTimer = null;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;


  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private router: Router, private breakpointObserver: BreakpointObserver,
    public userservice: UserService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
      this.mobileQuery = media.matchMedia('(max-width: 600px)');
      this._mobileQueryListener = () => changeDetectorRef.detectChanges();
      this.mobileQuery.addListener(this._mobileQueryListener);
    }

    ngOnDestroy(): void {
      this.mobileQuery.removeListener(this._mobileQueryListener);
    }

  logout() {
    this.close();
    this.userservice.logout().subscribe(
      () => {
        this.successMessage = 'Logged out with succes';
        this.router.navigate(['login']);
      },
      () => this.errorMessage = 'Error while login out'
    );
    this.fadeOutTimer = timer(3000); // FIXME: timer is not cool
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
