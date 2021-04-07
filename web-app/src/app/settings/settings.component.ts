import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotificationService} from '../_services/notification.service';
import {UserService} from '../_services/user.service';
import {Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {User} from '../_models/user';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  public registerForm: FormGroup;

  public submitted = false;
  public loading = false;
  public error = '';

  public hidePassword = true;
  public hideConfirmPassword = true;

  constructor(private notif: NotificationService,
              private formBuilder: FormBuilder,
              private router: Router,
              private userService: UserService
  ) {
    console.log(this.userService.currentUserValue);
    this.registerForm = this.formBuilder.group({
      firstName: [this.userService.currentUserValue.firstName, [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      lastName: ['pizza', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
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
    this.loading = false;
  }
}
