import {Component, Inject, OnInit} from '@angular/core';
import {Bill} from '../_models/bill';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-past-bill-details-dialog',
  templateUrl: './past-bill-details-dialog.component.html',
  styleUrls: ['./past-bill-details-dialog.component.css']
})
export class PastBillDetailsDialogComponent implements OnInit {

  public bill: Bill;
  public repVotedYes = undefined;
  public repVoteDate = undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: Bill
  ) {
    this.bill = data;
  }

  ngOnInit(): void {
  }

}
