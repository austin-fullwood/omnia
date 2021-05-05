import {Component, Inject, OnInit} from '@angular/core';
import {Bill} from '../_models/bill';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Representative} from '../_models/representative';
import {NotificationService} from '../_services/notification.service';
import {BillService} from '../_services/bill.service';
import {UserService} from '../_services/user.service';

/**
 * Modal for displaying the details of a past bill.
 */
@Component({
  selector: 'app-past-bill-details-dialog',
  templateUrl: './past-bill-details-dialog.component.html',
  styleUrls: ['./past-bill-details-dialog.component.css']
})
export class PastBillDetailsDialogComponent implements OnInit {

  /**
   * The bill and reps of the past bill.
   */
  public bill: Bill;
  public rep1: Representative;
  public rep2: Representative;

  public repVotedYes = undefined;

  /**
   * Gathers the bill and rep data.
   * @param data          contains the bill and rep data
   * @param notifService  notification service
   * @param billService   bill service
   * @param userService   user service
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) data: { bill: Bill, rep1: Representative, rep2: Representative },
    private notifService: NotificationService,
    private billService: BillService,
    private userService: UserService
  ) {
    this.bill = data.bill;
    this.rep1 = data.rep1;
    this.rep2 = data.rep2;
    console.log(this.rep1);
    console.log(this.rep2);
  }

  ngOnInit(): void {
  }

  /**
   * Changes the vote of the user to the opposite.
   */
  public changeVote(): void {
    if (!this.bill.bill_id) {
      this.notifService.showNotif('Could not register vote for current bill', 'error', 2000);
      return;
    }

    this.billService.setBillVote(this.userService.currentUserValue, this.bill.bill_id, !(this.bill.votedYes))
      .subscribe(
        result => {
          const voteStr = !(this.bill.votedYes) ? 'Yea' : 'Nay';
          this.notifService.showNotif('Vote Changed to \'' + voteStr + '\'', 'complete', 1000);

          this.bill.votedYes = !(this.bill.votedYes);
          this.billService.updatePastBills(this.userService.currentUserValue);
        },
        err => {
          console.log(err);
          this.notifService.showNotif(err.toString());
        }
      );
  }

}
