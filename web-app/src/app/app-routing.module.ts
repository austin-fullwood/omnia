import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent} from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuardService } from './_services/auth-guard.service';
import {SettingsComponent} from './settings/settings.component';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';

/**
 * Contains all of the different routes of the app.
 */
const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent },
  // {path: 'settings', component: SettingsComponent, canActivate: [AuthGuardService] },
  { path: 'forgotpassword', component: ForgotPasswordComponent },
  {path: '**', component: DashboardComponent, canActivate: [AuthGuardService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
