import {Component, Inject, OnInit} from '@angular/core';
import {UserService} from '../_services/user.service';
import {Router} from '@angular/router';
import {User} from '../_models/user';
import {NotificationService} from '../_services/notification.service';
import { DOCUMENT } from '@angular/common';

/**
 * The component for the user dashboard.
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  /**
   * the current user value.
   */
  public currentUser = new User();

  /**
   * Sets the current user value.
   * @param userService   user service
   * @param router        router service
   * @param notifService  notification service
   * @param document      document object
   */
  constructor(private userService: UserService,
              public router: Router,
              private notifService: NotificationService,
              @Inject(DOCUMENT) public document: Document) {
    this.currentUser = this.userService.currentUserValue;
  }

  ngOnInit(): void {
  }

  /**
   * Logs a user out.
   */
  public logout(): void {
    this.userService.logout();
    this.router.navigate(['/login']);
  }

  /**
   * Checks if a user is currently logged in.
   */
  public userLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }

}
