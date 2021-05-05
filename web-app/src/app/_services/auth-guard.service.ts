import { Injectable } from '@angular/core';
import {UserService} from './user.service';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';

/**
 *  Ensures a user is allowed to access certain parts of the site.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private auth: UserService, private router: Router) { }

  /**
   * Checks that a user is logged in and if not redirects to the login page.
   *
   * @param route the current route
   * @param state the current router state
   * @return true, if the user is allowed to access the route.
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.auth.isLoggedIn()) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
