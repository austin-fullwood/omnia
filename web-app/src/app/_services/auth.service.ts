import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

import { User } from '../_models/user';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    console.log(localStorage.getItem('currentUser'));
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));

    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public login(email: string, password: string): Observable<any> {
    console.log('Email:', email);
    console.log('Password:', password);
    return new Observable<any>(subscriber => {
      subscriber.next('pizza');
    });
    /*
    return this.http.post<any>('http://localhost:3000/login', { email, password })
      .pipe(map(user => {
        if(user && user.token) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
        return user;
      }));
     */
  }

  public logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  public register(user: User): Observable<any> {
    console.log(user);
    return new Observable<any>(subscriber => {
      subscriber.next('pizza');
      this.currentUserSubject.next(user);
    });
    /*
    return this.http.post<User>('http://localhost:3000/register', user)
      .pipe(map(user => {
        if (user && user.token) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
         }
         return user;
     }));
     */
    // TODO: automatically login user if they register
  }
}
