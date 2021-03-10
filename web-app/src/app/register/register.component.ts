import { Component, OnInit } from '@angular/core';
import {NotificationService} from '../_services/notification.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../_services/user.service';
import {Router} from '@angular/router';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

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

  public submitted = false;
  public loading = false;
  public error = '';

  public hidePassword = true;
  public hideConfirmPassword = true;

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

  private checkPasswords(group: FormGroup): any {
    const groupPassword = group.get('password');
    const groupConfirmPassword = group.get('confirmPassword');
    if (groupPassword === null || groupConfirmPassword === null) {
      return null;
    }

    return groupPassword.value === groupConfirmPassword.value ? null : {notSame: true};
  }

  get f(): any {
    return this.registerForm.controls;
  }

  public onSubmit(): void {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.register(this.registerForm.value)
      .pipe(first())
      .subscribe(
        registerInfo => {
          this.authService.getUser(registerInfo)
            .pipe(first())
            .subscribe(
              userInfo => {
                this.router.navigate(['/']);
                this.notif.showNotif('Successfully registered: ' + userInfo.firstName, 'confirmation');
                console.log(userInfo);
              },
              error => {
                this.error = error;
                console.log('Error:', error);
                this.loading = false;
              }
            );
        },
        error => {
          this.error = error;
          console.log('Error:', error);
          this.loading = false;
        }
      );
  }

}
