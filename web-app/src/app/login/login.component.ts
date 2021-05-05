import { Component, OnInit } from '@angular/core';
import {NotificationService} from '../_services/notification.service';
import {UserService} from '../_services/user.service';
import {first} from 'rxjs/operators';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

/**
 * Component for logging a user in.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });
  public submitted = false;
  public loading = false;
  public error = '';

  public hidePassword = true;

  /**
   * Checks if a user is logged in and redirects them if they are.
   * @param notif         notification service
   * @param formBuilder   form builder
   * @param authService   authentication service
   * @param router        router service.
   */
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

  /**
   * Getter for the form field
   * @return  the login form field
   */
  get f(): any {
    return this.loginForm.controls;
  }

  /**
   * Checks that the login information is correct and logs
   * the user in.
   */
  public onSubmit(): void {
    this.submitted = true;
    this.error = '';
    if (this.loginForm.invalid) {
      return;
    }

    const registerFormEmail = this.loginForm.get('email');
    const registerFormPassword = this.loginForm.get('password');
    if (registerFormEmail === null || registerFormPassword === null) {
      return;
    }

    this.loading = true;
    this.authService.login(registerFormEmail.value, registerFormPassword.value)
      .pipe(first())
      .subscribe(
        loginInfo => {
          this.authService.getUser(loginInfo).subscribe(
            userData => {
              this.router.navigate(['/']);
              this.notif.showNotif('Successfully logged in user.', 'confirmation');
            },
            err => {
              console.log(err);
              this.error = 'Incorrect username and/or password';
              this.loading = false;
            }
          );
        },
        err => {
          console.log(err);
          this.error = 'Incorrect username and/or password';
          this.loading = false;
        });
  }
}
