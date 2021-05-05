import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {UserService} from '../_services/user.service';

/**
 * Handles authentication between the web app and server
 * by adding a token to the response.
 */
@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

  constructor(private authService: UserService) {}

  /**
   * Intercepts HTTP response and adds the users bearer token to it.
   * @param request   the HTTP request
   * @param next      the next http handler
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`
        }
      });
    }

    return next.handle(request);
  }
}
