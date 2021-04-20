import {Component, Input, OnInit} from '@angular/core';
import {Bill} from '../_models/bill';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {PastBillDetailsDialogComponent} from '../past-bill-details-dialog/past-bill-details-dialog.component';
import {Representative} from '../_models/representative';
import {BillService} from '../_services/bill.service';

@Component({
  selector: 'app-past-bill',
  templateUrl: './past-bill.component.html',
  styleUrls: ['./past-bill.component.css']
})
export class PastBillComponent implements OnInit {

  @Input() bill = new Bill();
  @Input() rep1 = new Representative();
  @Input() rep2 = new Representative();

  constructor(public dialog: MatDialog,
              private billService: BillService) {
    /*
    this.billService.pastBills.subscribe(pastBills => {
      const foundBill = pastBills.find(bill => bill.bill_id === this.bill.bill_id);
      if (foundBill) {
        this.bill = foundBill;
      }
    });
     */
  }

  ngOnInit(): void {
  }

  public showDetails(): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.width = '50%';
    dialogConfig.data = {
      bill: this.bill,
      rep1: this.rep1,
      rep2: this.rep2
    };

    this.dialog.open(PastBillDetailsDialogComponent, dialogConfig);
  }

  public getUserVote(): string {
    return this.bill.votedYes ? 'Yay' : 'Nay';
  }

  public getUserVoteColor(): string {
    return this.bill.votedYes ? 'green' : 'red';
  }

  public getRep1Vote(): string {
    if (!this.bill.rep1VotedYes) {
      return 'Waiting';
    }
    return this.bill.rep1VotedYes ? 'Yay' : 'Nay';
  }

  public getRep1VoteColor(): string {
    if (!this.bill.rep1VotedYes) {
      return 'black';
    }
    return this.bill.rep1VotedYes ? 'green' : 'red';
  }

  public getRep2Vote(): string {
    if (!this.bill.rep2VotedYes) {
      return 'Waiting';
    }
    return this.bill.rep2VotedYes ? 'Yay' : 'Nay';
  }

  public getRep2VoteColor(): string {
    if (!this.bill.rep2VotedYes) {
      return 'black';
    }
    return this.bill.rep2VotedYes ? 'green' : 'red';
  }

}
