import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Bill} from '../_models/bill';
import {HttpClient} from '@angular/common/http';
import {User} from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  constructor(private http: HttpClient) {
  }

  public getUpcomingBills(user: User): Observable<Bill[]> {
    return this.http.post<Bill[]>('http://localhost:3000/api/upcomingbills', user);
  }

  public getPastBills(user: User): Observable<Bill[]> {
    return this.http.post<Bill[]>('http://localhost:3000/api/pastbills', user);
  }

}
