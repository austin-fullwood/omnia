import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent} from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuardService } from './_services/auth-guard.service';
import {UpcomingBillsComponent} from './upcoming-bills/upcoming-bills.component';

const routes: Routes = [
  {path: '', component: DashboardComponent , canActivate: [AuthGuardService]},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent },
  {path: 'upcoming-bills', component: UpcomingBillsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
