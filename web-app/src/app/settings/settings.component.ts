import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotificationService} from '../_services/notification.service';
import {UserService} from '../_services/user.service';
import {Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {User} from '../_models/user';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  public currentUser = new User();

  public registerForm: FormGroup;

  public submitted = false;
  public loading = false;
  public error = '';
  public errorRed = false;

  public changePasswordHint = '';
  public changePasswordHintRed = false;
  public disableChangePassword = false;

  public hidePassword = true;
  public hideConfirmPassword = true;

  constructor(private userService: UserService,
              private router: Router,
              private formBuilder: FormBuilder,
              private notifService: NotificationService,
              @Inject(DOCUMENT) public document: Document) {
    this.currentUser = this.userService.currentUserValue;
    this.registerForm = this.formBuilder.group({
      firstName: [this.currentUser.firstName, [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      lastName: [this.currentUser.lastName, [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      email: [this.currentUser.email, [Validators.required, Validators.email]],
      address: [this.currentUser.address, Validators.required],
      city: [this.currentUser.city, [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      state: [{value: 'VA', disabled: true}],
      zip: [this.currentUser.zip, [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(5), Validators.maxLength(5)]]
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
    console.log('submit');
  }

  public logout(): void {
    this.userService.logout();
    this.router.navigate(['/login']);
  }

  public userLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }

  public changePassword(): void {
    this.changePasswordHintRed = false;
    this.changePasswordHint = 'An email has been sent to your account.';
    this.disableChangePassword = true;
    console.log('change password');
  }

  public saveChanges(): void {
    this.errorRed = false;
    this.error = 'Changes have been saved.';
    console.log('save changes');
  }

}
