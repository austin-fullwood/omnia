import {Component, OnInit, ViewChild} from '@angular/core';
import {BillService} from '../_services/bill.service';
import {Bill} from '../_models/bill';
import {UserService} from '../_services/user.service';
import {NotificationService} from '../_services/notification.service';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {Representative} from '../_models/representative';
import {RepresentativeService} from '../_services/representative.service';

@Component({
  selector: 'app-search-past-bills',
  templateUrl: './search-past-bills.component.html',
  styleUrls: ['./search-past-bills.component.css']
})
export class SearchPastBillsComponent implements OnInit {

  public searchText = '';
  public currentBills: Bill[] | undefined;
  public searchedBills: Bill[] | undefined;
  public allBills: Bill[] | undefined;
  public reps: Representative[] | undefined;

  public pastBills: Bill[] | undefined;

  // @ts-ignore
  @ViewChild('paginator') paginator: MatPaginator;

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

  public getFirstRep(): Representative {
    if (this.reps === undefined) {
      return new Representative();
    }

    return this.reps[0];
  }

  public getSecondRep(): Representative {
    if (this.reps === undefined) {
      return new Representative();
    }

    return this.reps[1];
  }

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

  public changePage($event: PageEvent): void {
    this.currentBills = this.searchedBills?.slice((10 * $event.pageIndex), (10 * ($event.pageIndex + 1)));
  }
}
