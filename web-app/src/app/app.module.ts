import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MaterialModule } from './material-module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ErrorInterceptor} from './interceptors/error.interceptor';
import {AuthenticationInterceptor} from './interceptors/authentication.interceptor';
import { UpcomingBillsComponent } from './upcoming-bills/upcoming-bills.component';
import { PastBillComponent } from './past-bill/past-bill.component';
import { SearchPastBillsComponent } from './search-past-bills/search-past-bills.component';
import { PastBillDetailsDialogComponent } from './past-bill-details-dialog/past-bill-details-dialog.component';
import { RepresentativeComponent } from './representative/representative.component';
import { RepresentativesComponent } from './representatives/representatives.component';
import { SettingsComponent } from './settings/settings.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

/**
 * Contains all of the used classes and enables them to be used by other classes.
 */
@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    DashboardComponent,
    UpcomingBillsComponent,
    PastBillComponent,
    SearchPastBillsComponent,
    PastBillDetailsDialogComponent,
    RepresentativeComponent,
    RepresentativesComponent,
    SettingsComponent,
    ForgotPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true},
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
