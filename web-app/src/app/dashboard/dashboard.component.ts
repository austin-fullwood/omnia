import { Component, OnInit } from '@angular/core';
import {AuthService} from '../_services/auth.service';
import {Router} from '@angular/router';
import {User} from '../_models/user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public currentUser = new User();

  constructor(private authService: AuthService,
              private router: Router) {
    this.authService.currentUser.subscribe(x => this.currentUser = x);
    console.log(this.currentUser);
  }

  ngOnInit(): void {
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
