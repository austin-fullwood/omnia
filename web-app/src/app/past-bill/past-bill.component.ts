import {Component, Input, OnInit} from '@angular/core';
import {Bill} from '../_models/bill';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {PastBillDetailsDialogComponent} from '../past-bill-details-dialog/past-bill-details-dialog.component';

@Component({
  selector: 'app-past-bill',
  templateUrl: './past-bill.component.html',
  styleUrls: ['./past-bill.component.css']
})
export class PastBillComponent implements OnInit {

  @Input() bill =  new Bill();

  public repVotedYes = undefined;

  constructor(public dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  public showDetails(): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.width = '50%';
    dialogConfig.data = this.bill;

    this.dialog.open(PastBillDetailsDialogComponent, dialogConfig);
  }

  public getUserVote(): string {
    return this.bill.votedYes ? 'Yay' : 'Nay';
  }

  public getUserVoteColor(): string {
    return this.bill.votedYes ? 'green' : 'red';
  }

  public getRepVote(): string {
    if (!this.repVotedYes) {
      return 'Waiting';
    }
    return this.repVotedYes ? 'Yay' : 'Nay';
  }

  public getRepVoteColor(): string {
    if (!this.repVotedYes) {
      return 'black';
    }
    return this.repVotedYes ? 'green' : 'red';
  }

}
