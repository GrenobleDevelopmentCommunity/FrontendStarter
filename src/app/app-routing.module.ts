import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { AutGuard } from './aut.guard';
import { RoleAuthGuard } from './role-auth.guard';
import { LoginGuard } from './login.guard';
import { ProfileComponent } from './profile/profile.component';
import { AdminComponent } from './admin/admin.component';
import { Role } from './in-memory-data.service';
import { AccueilComponent } from './accueil/accueil.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: '', component: AccueilComponent, canActivate: [AutGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AutGuard]},
  { path: 'admin', component: AdminComponent, canActivate: [RoleAuthGuard], data: {expectedRole: Role.Admin.toString()}},
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
