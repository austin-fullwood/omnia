import { Injectable } from '@angular/core';
import {Representative} from '../_models/representative';
import {Observable} from 'rxjs';
import {User} from '../_models/user';
import {HttpClient} from '@angular/common/http';
import {Bill} from '../_models/bill';

@Injectable({
  providedIn: 'root'
})
export class RepresentativeService {

  constructor(private http: HttpClient) {
  }

  public getRepresentatives(user: User): Observable<Representative[]> {
    return this.http.post<Representative[]>('https://omnia.ninja/api/representativeInfo', user);
  }

  public getRepresentativeVotingHistory(user: User): Observable<[
    {
      billId: string,
      votedYes: boolean
    }
  ]> {
    return this.http.post<[
      {
        billId: string,
        votedYes: boolean
      }
    ]>('http://localhost:3000/api/totalVotingHistory', user);
  }
}
