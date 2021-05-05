import { Injectable } from '@angular/core';
import {Representative} from '../_models/representative';
import {Observable} from 'rxjs';
import {User} from '../_models/user';
import {HttpClient} from '@angular/common/http';

/**
 * Connects the web app to representative information.
 */
@Injectable({
  providedIn: 'root'
})
export class RepresentativeService {

  constructor(private http: HttpClient) {
  }

  /**
   * Gets the representative information from the server.
   * @param user  the current user
   */
  public getRepresentatives(user: User): Observable<Representative[]> {
    return this.http.post<Representative[]>('https://omnia.ninja/api/representativeInfo', user);
  }

  /**
   * Gets the voting history of the representatives.
   * @param user  the current user
   */
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
    ]>('https://omnia.ninja/api/totalVotingHistory', user);
  }
}
