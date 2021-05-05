import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {NotificationService} from '../_services/notification.service';
import {UserService} from '../_services/user.service';
import {Router} from '@angular/router';

/**
 * Enables users to enter email to reset their email.
 */
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  public registerForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]]
  });
  public submitted = false;
  public loading = false;

  public hint = '';
  public hintRed = false;

  public hidePassword = true;

  /**
   * Checks if a user is currently logged in and redirects
   * them if not.
   * @param notif         notification service
   * @param formBuilder   the form builder for checking if a form is correct.
   * @param authService   authentication service
   * @param router        router service
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
   * The register form of the component.
   */
  get f(): any {
    return this.registerForm.controls;
  }

  /**
   * Handles restarting the password.
   */
  public onSubmit(): void {
    this.submitted = true;
    this.hint = '';
    if (this.registerForm.invalid) {
      return;
    }

    const registerFormEmail = this.registerForm.get('email');
    if (registerFormEmail === null) {
      return;
    }

    this.loading = true;
    this.authService.resetPassword(registerFormEmail.value).subscribe(
      success => {
        this.hintRed = false;
        this.hint = 'An email has been sent to your account.';
        this.loading = false;
      },
      err => {
        this.hintRed = true;
        this.hint = 'That email is not registered to an account.';
        this.loading = false;
        this.submitted = false;
      }
    );
  }
}
