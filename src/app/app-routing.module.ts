import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { AutGuard } from './aut.guard';
import { RoleAuthGuard } from './role-auth.guard';
import { LoginGuard } from './login.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'index', component: NavBarComponent, canActivate: [AutGuard] },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }/*,
{ path: 'admin', component: NavBarComponent, canActivate: [RoleAuthGuard], data: {expectedRole: 'admin'} }*/
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
