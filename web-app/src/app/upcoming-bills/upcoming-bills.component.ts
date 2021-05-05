import { Component, OnInit } from '@angular/core';
import {Bill} from '../_models/bill';
import {BillService} from '../_services/bill.service';
import {UserService} from '../_services/user.service';
import {NotificationService} from '../_services/notification.service';

/**
 * Displays the upcoming bills to the user.
 */
@Component({
  selector: 'app-upcoming-bills',
  templateUrl: './upcoming-bills.component.html',
  styleUrls: ['./upcoming-bills.component.css']
})
export class UpcomingBillsComponent implements OnInit {

  public bills: Bill[] | undefined;
  public currentBill = new Bill();

  /**
   * Gathers the upcoming bills.
   *
   * @param userService   user service
   * @param billService   bill service
   * @param notifService  notification service
   */
  constructor(private userService: UserService,
              private billService: BillService,
              private notifService: NotificationService) {
    this.getUpcomingBills();
  }

  ngOnInit(): void {
  }

  /**
   * Sets the vote of the current bill.
   *
   * @param votedYes  vote of the current bill.
   */
  public voteForCurrentBill(votedYes: boolean): void {
    if (!this.currentBill.bill_id) {
      this.notifService.showNotif('Could not register vote for current bill', 'error', 2000);
      return;
    }

    this.billService.setBillVote(this.userService.currentUserValue, this.currentBill.bill_id, votedYes)
      .subscribe(
        result => {
          this.bills = this.bills?.filter(bill => {
            return bill.bill_id !== this.currentBill.bill_id;
          });

          if (this.bills) {
            this.currentBill = this.bills[0];
          }

          const voteStr = votedYes ? 'Yea' : 'Nay';
          this.notifService.showNotif('Voted: ' + voteStr, 'complete', 1000);

          this.billService.updatePastBills(this.userService.currentUserValue);
        },
        err => {
          console.log(err);
          this.notifService.showNotif(err.toString());
        }
      );
  }

  /**
   * Getter method for the upcoming bills.
   */
  private getUpcomingBills(): void {
    this.billService.getUpcomingBills(this.userService.currentUserValue).subscribe(
      data => {
        this.bills = data;
        this.currentBill = this.bills[0];
      },
      error => {
        this.bills = undefined;
      }
    );
  }

  /**
   * Tells if there are any more upcoming bills.
   *
   * @return  true if there are no more upcoming bills
   */
  public noUpcomingBills(): boolean {
    if (!this.bills) {
      return true;
    }
    return this.bills?.length === 0;
  }

}
