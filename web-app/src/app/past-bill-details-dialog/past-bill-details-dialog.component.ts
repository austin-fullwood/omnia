import {Component, Inject, OnInit} from '@angular/core';
import {Bill} from '../_models/bill';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Representative} from '../_models/representative';

@Component({
  selector: 'app-past-bill-details-dialog',
  templateUrl: './past-bill-details-dialog.component.html',
  styleUrls: ['./past-bill-details-dialog.component.css']
})
export class PastBillDetailsDialogComponent implements OnInit {

  public bill: Bill;
  public rep1: Representative;
  public rep2: Representative;

  public repVotedYes = undefined;
  public repVoteDate = undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: { bill: Bill, rep1: Representative, rep2: Representative }
  ) {
    this.bill = data.bill;
    this.rep1 = data.rep1;
    this.rep2 = data.rep2;
  }

  ngOnInit(): void {
  }

}
