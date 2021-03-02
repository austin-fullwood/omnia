import { Component, OnInit } from '@angular/core';
import {NotificationService} from '../_services/notification.service';
import {AuthService} from '../_services/auth.service';
import {first} from 'rxjs/operators';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private registerForm: FormGroup;
  private submitted = false;
  private loading = false;
  private error = '';

  private hidePassword = true;

  constructor(private notif: NotificationService,
              private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router) {
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
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
    this.authService.login(this.registerForm.get('email').value, this.registerForm.get('password').value)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(['/']);

          this.notif.showNotif('Logged in.', 'confirmation');
          console.log(data);
        },
        error => {
          this.error = error;
          this.loading = false;
          console.log('Error', error);
        });
  }
}
