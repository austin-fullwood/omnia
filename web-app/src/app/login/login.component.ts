import { Component, OnInit } from '@angular/core';
import {NotificationService} from '../_services/notification.service';
import {UserService} from '../_services/user.service';
import {first} from 'rxjs/operators';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public registerForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });
  public submitted = false;
  public loading = false;
  public error = '';

  public hidePassword = true;

  constructor(private notif: NotificationService,
              private formBuilder: FormBuilder,
              private authService: UserService,
              private router: Router) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
  }

  get f(): any {
    return this.registerForm.controls;
  }

  public onSubmit(): void {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }

    const registerFormEmail = this.registerForm.get('email');
    const registerFormPassword = this.registerForm.get('password');
    if (registerFormEmail === null || registerFormPassword === null) {
      return;
    }

    this.loading = true;
    this.authService.login(registerFormEmail.value, registerFormPassword.value)
      .pipe(first())
      .subscribe(
        loginInfo => {
          this.authService.getUser(loginInfo)
            .pipe(first())
            .subscribe(
              userInfo => {
                this.router.navigate(['/']);

                this.notif.showNotif('Logged in: ' + userInfo.firstName, 'confirmation');
                console.log(userInfo);
              },
              error => {
                this.error = error;
                this.loading = false;
                console.log('Error:', error);
              }
            );
        },
        error => {
          this.error = error;
          this.loading = false;
          console.log('Error:', error);
        });
  }
}
