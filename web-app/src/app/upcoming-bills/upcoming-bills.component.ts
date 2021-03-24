import { Component, OnInit } from '@angular/core';
import {Bill} from '../_models/bill';
import {BillService} from '../_services/bill.service';
import {UserService} from '../_services/user.service';
import {NotificationService} from '../_services/notification.service';

@Component({
  selector: 'app-upcoming-bills',
  templateUrl: './upcoming-bills.component.html',
  styleUrls: ['./upcoming-bills.component.css']
})
export class UpcomingBillsComponent implements OnInit {

  public bills: Bill[] | undefined;
  public currentBill = new Bill();

  constructor(private userService: UserService,
              private billService: BillService,
              private notifService: NotificationService) {
    this.getUpcomingBills();
  }

  ngOnInit(): void {
  }

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
        },
        err => {
          console.log(err);
          this.notifService.showNotif(err.toString());
        }
      );
  }

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

  public noUpcomingBills(): boolean {
    if (!this.bills) {
      return true;
    }
    return this.bills?.length === 0;
  }

}
