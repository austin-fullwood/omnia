import { Component } from '@angular/core';
import {User} from './_models/user';
import {Router} from '@angular/router';
import {AuthService} from './_services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Omnia';

  constructor() {
  }
}
