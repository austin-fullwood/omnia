import { Component, OnInit } from '@angular/core';
import {RepresentativeService} from '../_services/representative.service';
import {Representative} from '../_models/representative';
import {UserService} from '../_services/user.service';
import {NotificationService} from '../_services/notification.service';
import {BillService} from '../_services/bill.service';

/**
 * Displays a list of rep's for the user.
 */
@Component({
  selector: 'app-representatives',
  templateUrl: './representatives.component.html',
  styleUrls: ['./representatives.component.css']
})
export class RepresentativesComponent implements OnInit {

  /**
   * A list of reps.
   */
  public reps: Representative[] | undefined;

  /**
   * Initializes the reps and gathers their voting information.
   * @param repService    Representative service
   * @param userService   user service
   * @param notifService  notification service
   * @param billService   bill service
   */
  constructor(private repService: RepresentativeService,
              private userService: UserService,
              private notifService: NotificationService,
              private billService: BillService) {
    this.getRepresentatives();
    this.billService.pastBills.subscribe(bills => {
      let rep1VotedSameCount = 0;
      let rep2VotedSameCount = 0;
      let rep1VotedAgainstCount = 0;
      let rep2VotedAgainstCount = 0;
      let rep1VotedCount = 0;
      let rep2VotedCount = 0
      bills.forEach(bill => {
        if (bill.rep1VotedYes !== undefined) {
          rep1VotedCount++;
          if (bill.votedYes === bill.rep1VotedYes) {
            rep1VotedSameCount++;
          } else {
            rep1VotedAgainstCount++;
          }
        }
        if (bill.rep2VotedYes !== undefined) {
          rep2VotedCount++;
          if (bill.votedYes === bill.rep2VotedYes) {
            rep2VotedSameCount++;
          } else {
            rep2VotedAgainstCount++;
          }
        }
      });
      if (this.reps) {
        this.reps[0].votedSamePercentage = Math.round((rep1VotedSameCount / Math.max(rep1VotedCount, 1)) * 100);
        this.reps[1].votedSamePercentage = Math.round((rep2VotedSameCount / Math.max(rep2VotedCount, 1)) * 100);
        this.reps[0].votedAgainstPercentage = Math.round((rep1VotedAgainstCount / Math.max(rep1VotedCount, 1)) * 100);
        this.reps[1].votedAgainstPercentage = Math.round((rep2VotedAgainstCount / Math.max(rep2VotedCount, 1)) * 100);
      }
    });
  }

  ngOnInit(): void {
  }

  /**
   * Gets the representatives information.
   */
  public getRepresentatives(): void {
    this.repService.getRepresentatives(this.userService.currentUserValue).subscribe(
      repData => {
        this.reps = repData;
      }, err => {
        this.reps = [];
        this.notifService.showNotif('Could not get representative information.');
      }
    );
  }

}
