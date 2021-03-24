import { Component, OnInit } from '@angular/core';
import {UserService} from '../_services/user.service';
import {Router} from '@angular/router';
import {User} from '../_models/user';
import {NotificationService} from '../_services/notification.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public currentUser = new User();

  constructor(private userService: UserService,
              private router: Router,
              private notifService: NotificationService) {
    this.getUser();
  }

  ngOnInit(): void {
  }

  private getUser(): void {
    this.userService.getUser(this.userService.currentUserValue).subscribe(
      data => {
        this.currentUser = data;
      },
      err => {
        console.log(err);
        this.notifService.showNotif(err);
      }
    );
  }

  public logout(): void {
    this.userService.logout();
    this.router.navigate(['/login']);
  }

}
