import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Bill} from '../_models/bill';
import {HttpClient} from '@angular/common/http';
import {User} from '../_models/user';
import {map} from 'rxjs/operators';
import {NotificationService} from './notification.service';
import {RepresentativeService} from './representative.service';
import {UserService} from './user.service';

/**
 * Connects the web app to bill information.
 */
@Injectable({
  providedIn: 'root'
})
export class BillService {

  private pastBillsSubject: BehaviorSubject<Bill[]>;
  public pastBills: Observable<Bill[]>;

  /**
   * Initializes the past bill subject and observable.
   *
   * @param http          HTTP service
   * @param notifService  Notification service
   * @param repService    representative service
   * @param userService   user service
   */
  constructor(private http: HttpClient,
              private notifService: NotificationService,
              private repService: RepresentativeService,
              private userService: UserService) {
    this.pastBillsSubject = new BehaviorSubject<Bill[]>([]);
    this.pastBills = this.pastBillsSubject.asObservable();
  }

  /**
   * Updates the past bills of the service with the past bills of the server.
   * @param user  user of the past bills.
   */
  public updatePastBills(user: User): void {
    this.http.post<Bill[]>('https://omnia.ninja/api/pastbills', user).subscribe(
      bills => {
        this.pastBillsSubject.next(bills);
        this.repService.getRepresentativeVotingHistory(this.userService.currentUserValue).subscribe(
          repVoteBills => {
            const half = Math.ceil(repVoteBills.length / 2);
            const rep1VoteBills = repVoteBills.splice(0, half);
            const rep2VoteBills = repVoteBills.splice(-half);

            bills.forEach(currentBill => {
              if (!currentBill.bill_id) {
                return;
              }
              const rep1VoteBill = rep1VoteBills.find(x => x.billId === currentBill.bill_id);
              const rep2VoteBill = rep2VoteBills.find(x => x.billId === currentBill.bill_id);

              if (rep1VoteBill && rep1VoteBill.votedYes) {
                currentBill.rep1VotedYes = rep1VoteBill.votedYes;
              }
              if (rep2VoteBill && rep2VoteBill.votedYes) {
                currentBill.rep2VotedYes = rep2VoteBill.votedYes;
              }
            });
            this.pastBillsSubject.next(bills);
          },
          err => {}
        );
      },
      err => {
        this.pastBillsSubject.next([]);
        this.notifService.showNotif(err);
      }
    );
  }

  /**
   * Gets the upcoming bills from the server.
   * @param user  the user of the upcoming bills.
   */
  public getUpcomingBills(user: User): Observable<Bill[]> {
    return this.http.post<Bill[]>('https://omnia.ninja/api/upcomingbills', user);
  }

  /**
   * Sets the vote of a bill for the user.
   * @param user      user setting the vote
   * @param billId    id of the bill to be voted on.
   * @param votedYes  true if the user voted yes.
   */
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
