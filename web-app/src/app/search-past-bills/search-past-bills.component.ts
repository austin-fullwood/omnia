import {Component, OnInit, ViewChild} from '@angular/core';
import {BillService} from '../_services/bill.service';
import {Bill} from '../_models/bill';
import {UserService} from '../_services/user.service';
import {NotificationService} from '../_services/notification.service';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {Representative} from '../_models/representative';
import {RepresentativeService} from '../_services/representative.service';

/**
 * Displays a list of past bills and allows for searching.
 */
@Component({
  selector: 'app-search-past-bills',
  templateUrl: './search-past-bills.component.html',
  styleUrls: ['./search-past-bills.component.css']
})
export class SearchPastBillsComponent implements OnInit {

  /**
   * Facilitates communication to the html code.
   */
  public searchText = '';
  public currentBills: Bill[] | undefined;
  public searchedBills: Bill[] | undefined;
  public allBills: Bill[] | undefined;
  public reps: Representative[] | undefined;

  public pastBills: Bill[] | undefined;

  // @ts-ignore
  @ViewChild('paginator') paginator: MatPaginator;

  /**
   * Subscribes to past bills and initializes the bills arrays.
   * @param billService   bill service
   * @param userService   user service
   * @param notifService  notification service
   * @param repService    representative service
   */
  constructor(private billService: BillService,
              private userService: UserService,
              private notifService: NotificationService,
              private repService: RepresentativeService) {
    this.billService.updatePastBills(this.userService.currentUserValue);
    this.billService.pastBills.subscribe(x => {
      this.allBills = x;
      this.searchedBills = x;
      this.currentBills = this.searchedBills.slice(0, 10);
    });
    this.getReps();
  }

  ngOnInit(): void {
  }

  /**
   * Gets the representatives' information.
   */
  private getReps(): void {
    this.repService.getRepresentatives(this.userService.currentUserValue).subscribe(
      reps => {
        this.reps = reps;
      },
      err => {
        this.notifService.showNotif(err.toString());
      }
    );
  }

  /**
   * Getter for the first representative.
   * @return  the first representative
   */
  public getFirstRep(): Representative {
    if (this.reps === undefined) {
      return new Representative();
    }

    return this.reps[0];
  }

  /**
   * Getter for the second representative.
   * @return  the second representative.
   */
  public getSecondRep(): Representative {
    if (this.reps === undefined) {
      return new Representative();
    }

    return this.reps[1];
  }

  /**
   * Searches the past bills for the text from the search bar
   * and filters out an bill whose title doesn't match the text.
   */
  public search(): void {
    this.searchedBills = this.allBills?.filter(bill => {
      if (bill.short_title === undefined) {
        return this.searchText === '';
      }

      return bill.short_title.toLowerCase().includes(this.searchText.toLowerCase());
    });
    this.currentBills = this.searchedBills?.slice(0, 10);
    this.paginator.firstPage();
  }

  /**
   * Changes the bills that are displayed when the user wants to see
   * the next 10 bills.
   * @param $event  object thrown by a PageEvent
   */
  public changePage($event: PageEvent): void {
    this.currentBills = this.searchedBills?.slice((10 * $event.pageIndex), (10 * ($event.pageIndex + 1)));
  }
}
