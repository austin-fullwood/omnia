import {Component, Inject, OnInit} from '@angular/core';
import {UserService} from '../_services/user.service';
import {Router} from '@angular/router';
import {User} from '../_models/user';
import {NotificationService} from '../_services/notification.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public currentUser = new User();

  constructor(private userService: UserService,
              public router: Router,
              private notifService: NotificationService,
              @Inject(DOCUMENT) public document: Document) {
    this.currentUser = this.userService.currentUserValue;
  }

  ngOnInit(): void {
  }

  public logout(): void {
    this.userService.logout();
    this.router.navigate(['/login']);
  }

  public userLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }

}
