import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {UserService} from '../_services/user.service';
import {catchError} from 'rxjs/operators';
import {NotificationService} from '../_services/notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private authenticationService: UserService, private notif: NotificationService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(catchError(err => {
      if ([401, 403].indexOf(err.status) !== -1) {
        this.authenticationService.logout();
        location.reload(true);
      }

      if ([400, 501, 502, 503].indexOf(err.status) !== -1) {
        this.notif.showNotif(err.error.message);
      }

      const error = err.error.message || err.statusText;

      return throwError(error);
    }));
  }
}
