import {Component, Input, OnInit} from '@angular/core';
import {Bill} from '../_models/bill';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {PastBillDetailsDialogComponent} from '../past-bill-details-dialog/past-bill-details-dialog.component';
import {Representative} from '../_models/representative';
import {BillService} from '../_services/bill.service';

/**
 * Displays a single past bill.
 */
@Component({
  selector: 'app-past-bill',
  templateUrl: './past-bill.component.html',
  styleUrls: ['./past-bill.component.css']
})
export class PastBillComponent implements OnInit {

  /**
   * Gathers the bill and reps from its parent
   */
  @Input() bill = new Bill();
  @Input() rep1 = new Representative();
  @Input() rep2 = new Representative();

  constructor(public dialog: MatDialog,
              private billService: BillService) { }

  ngOnInit(): void {
  }

  /**
   * Creates a modal containing the details of the bill.
   */
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

  /**
   * Getter for the user's vote.
   * @return  the users vote
   */
  public getUserVote(): string {
    return this.bill.votedYes ? 'Yay' : 'Nay';
  }

  /**
   * Getter for the color of the user's vote.
   * @return  green if voted yes, red otherwise.
   */
  public getUserVoteColor(): string {
    return this.bill.votedYes ? 'green' : 'red';
  }

  /**
   * Getter for the first rep's vote.
   * @return  the first rep's vote
   */
  public getRep1Vote(): string {
    if (!this.bill.rep1VotedYes) {
      return 'Waiting';
    }
    return this.bill.rep1VotedYes ? 'Yay' : 'Nay';
  }

  /**
   * Getter for the first rep's color
   * @return  green if voted yay, red if nay, black if none.
   */
  public getRep1VoteColor(): string {
    if (!this.bill.rep1VotedYes) {
      return 'black';
    }
    return this.bill.rep1VotedYes ? 'green' : 'red';
  }

  /**
   * Getter for the second rep's vote.
   * @return  the second rep's vote
   */
  public getRep2Vote(): string {
    if (!this.bill.rep2VotedYes) {
      return 'Waiting';
    }
    return this.bill.rep2VotedYes ? 'Yay' : 'Nay';
  }

  /**
   * Getter for the second rep's color
   * @return  green if voted yay, red if nay, black if none.
   */
  public getRep2VoteColor(): string {
    if (!this.bill.rep2VotedYes) {
      return 'black';
    }
    return this.bill.rep2VotedYes ? 'green' : 'red';
  }

}
