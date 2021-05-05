import { Component, OnInit } from '@angular/core';
import {NotificationService} from '../_services/notification.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../_services/user.service';
import {Router} from '@angular/router';
import {first} from 'rxjs/operators';

/**
 * Registers a new user.
 */
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  /**
   * Form group for ensuring the user information is valid.
   */
  public registerForm = this.formBuilder.group({
    firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
    lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    address: ['', Validators.required],
    city: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
    state: [{value: 'VA', disabled: true}],
    zip: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(5), Validators.maxLength(5)]]
  }, {
    validators: this.checkPasswords
  });

  /**
   * Variables facilitate communication to html.
   */
  public submitted = false;
  public loading = false;
  public error = '';

  public hidePassword = true;
  public hideConfirmPassword = true;

  /**
   * Checks if the user is logged in and if they are redirects them.
   * @param notif       notification service
   * @param formBuilder form builder
   * @param authService authentication service
   * @param router      router component
   */
  constructor(private notif: NotificationService,
              private formBuilder: FormBuilder,
              private authService: UserService,
              private router: Router
              ) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
  }

  /**
   * Helper method for checking if the confirmed password matches
   * the real password.
   * @param group   The form group of the html form.
   */
  private checkPasswords(group: FormGroup): any {
    const groupPassword = group.get('password');
    const groupConfirmPassword = group.get('confirmPassword');
    if (groupPassword === null || groupConfirmPassword === null) {
      return null;
    }

    return groupPassword.value === groupConfirmPassword.value ? null : {notSame: true};
  }

  /**
   * Getter method for the form field.
   */
  get f(): any {
    return this.registerForm.controls;
  }

  /**
   * Checks that the information is valid and registers the user
   * if it is.
   */
  public onSubmit(): void {
    this.submitted = true;
    this.error = '';
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    const userInfo = this.registerForm.value;
    if (userInfo.confirmPassword) {
      delete userInfo.confirmPassword;
    }

    this.authService.register(userInfo)
      .pipe(first())
      .subscribe(
        registerInfo => {
          this.authService.getUser(registerInfo).subscribe(
            userData => {
              console.log(registerInfo);
              this.router.navigate(['/']);
              this.notif.showNotif('Successfully logged in user.', 'confirmation');
            },
            err => {
              console.log(err);
              this.error = err;
              this.loading = false;
            }
          );
        },
        err => {
          this.error = err;
          console.log(err);
          this.loading = false;
        }
      );
  }

}
