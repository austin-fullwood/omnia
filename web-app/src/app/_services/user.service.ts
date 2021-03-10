import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import { User } from '../_models/user';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

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

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public login(email: string, password: string): Observable<any> {
    return this.http.post<any>('http://localhost:3000/user/signin', { email, password })
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

  public logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(new User());
  }

  public register(user: User): Observable<any> {
    return this.http.post<User>('http://localhost:3000/user/register', user)
      .pipe(map(data => {
        const newUser = this.currentUserValue;
        if (data && data.token) {
          if (newUser) {
            newUser.email = data.email;
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

  public getUser(user: User): Observable<any> {
    return this.http.post<User>('http://localhost:3000/user/data', user)
      .pipe(map(data => {
        const newUser = this.currentUserValue;
        if (data) {
          if (newUser) {
            newUser.firstName = data.firstName;
            newUser.lastName = data.lastName;
            newUser.location = data.location;
            newUser.bills = data.bills;
            newUser.id = data.id;
            localStorage.setItem('currentUser', JSON.stringify(newUser));
          } else {
            localStorage.setItem('currentUser', JSON.stringify(data));
          }
        }
        return data;
      }));
  }

  public isLoggedIn(): boolean {
    return this.currentUserValue.token !== undefined;
  }
}
