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
    return this.http.post<Bill[]>('https://omnia.ninja/api/upcomingbills', user);
  }

  public getPastBills(user: User): Observable<Bill[]> {
    return this.http.post<Bill[]>('https://omnia.ninja/api/pastbills', user);
  }

  public setBillVote(user: User, billId: string, votedYes: boolean): Observable<string> {
    const billInfo = {
      token: user.token,
      email: user.email,
      billId,
      votedYes
    };
    return this.http.post<string>('https://omnia.ninja/api/billVote', billInfo);
  }

}
