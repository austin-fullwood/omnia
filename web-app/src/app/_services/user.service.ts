import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import { User } from '../_models/user';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';

/**
 * Handles user information between the web app and the server.
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  /**
   * Checks for a user saved to the local storage.
   * @param http  HTTP service
   */
  constructor(private http: HttpClient) {
    const localCurrentUser = localStorage.getItem('currentUser');
    if (localCurrentUser !== null) {
      this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localCurrentUser));
      this.currentUser = this.currentUserSubject.asObservable();
    } else {
      this.currentUserSubject = new BehaviorSubject<User>(new User());
      this.currentUser = this.currentUserSubject.asObservable();
    }
  }

  /**
   * Gets the current user
   * @return  the current user object.
   */
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  /**
   * Logs a user into the web app.
   * @param email     email of the user.
   * @param password  password of the user.
   */
  public login(email: string, password: string): Observable<any> {
    return this.http.post<any>('https://omnia.ninja/user/signin', { email, password })
      .pipe(map(data => {
        const newUser = this.currentUserValue;
        if (data && data.token) {
          if (newUser) {
            newUser.email = email;
            newUser.token = data.token;
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            this.currentUserSubject.next(newUser);
          } else {
            localStorage.setItem('currentUser', JSON.stringify(data));
            this.currentUserSubject.next(data);
          }
        }

        return data;
      }));
  }

  /**
   * Logs the current user out of the web app.
   */
  public logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(new User());
  }

  /**
   * Registers a new user with the server.
   * @param user  the new user to be registered.
   */
  public register(user: User): Observable<any> {
    return this.http.post<User>('https://omnia.ninja/user/register', user)
      .pipe(map(data => {
        const newUser = user;
        if (data && data.token) {
          newUser.token = data.token;
          localStorage.setItem('currentUser', JSON.stringify(newUser));
          this.currentUserSubject.next(newUser);
        }
        return data;
     }));
  }

  /**
   * Gets the information for a particular user.
   * @param user  user object with an email and token.
   */
  public getUser(user: User): Observable<any> {
    return this.http.post<User>('https://omnia.ninja/user/data', user)
      .pipe(map(data => {
        const newUser = this.currentUserValue;
        if (data) {
          if (newUser) {
            newUser.firstName = data.firstName;
            newUser.lastName = data.lastName;
            newUser.bills = data.bills;
            newUser.id = data.id;
            newUser.address = data.address;
            newUser.city = data.city;
            newUser.zip = data.zip;

            localStorage.setItem('currentUser', JSON.stringify(newUser));
            this.currentUserSubject.next(newUser);

            return newUser;
          } else {
            localStorage.setItem('currentUser', JSON.stringify(data));
            this.currentUserSubject.next(data);

            return data;
          }
        }
        return data;
      }));
  }

  /**
   * Checks if a user is currently logged in.
   */
  public isLoggedIn(): boolean {
    return this.currentUserValue.token !== undefined;
  }

  /**
   * Resets the password for a user.
   * @param email   the email of the user whose password needs to be reset.
   */
  public resetPassword(email: string): Observable<string> {
    return this.http.post<string>('https://omnia.ninja/user/reset', email);
  }
}
