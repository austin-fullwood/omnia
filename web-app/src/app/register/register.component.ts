import { Component, OnInit } from '@angular/core';
import {NotificationService} from '../_services/notification.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../_services/auth.service';
import {Router} from '@angular/router';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  private registerForm: FormGroup;
  private submitted = false;
  private loading = false;
  private error = '';

  private hidePassword = true;
  private hideConfirmPassword = true;

  constructor(private notif: NotificationService,
              private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router
              ) {
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
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
  }

  private checkPasswords(group: FormGroup): any {
    const password = group.get('password').value;
    const confirmPassword = group.get('confirmPassword').value;

    return password === confirmPassword ? null : {notSame: true};
  }

  get f() {
    return this.registerForm.controls;
  }

  private onSubmit(): void {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.register(this.registerForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(['/']);
          this.notif.showNotif('Successfully registered user.', 'confirmation');
          console.log(data);
        },
        error => {
          this.error = error;
          this.loading = false;
          console.log(error);
        }
      );
  }

}
