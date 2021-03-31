import {Component, OnInit, ViewChild} from '@angular/core';
import {BillService} from '../_services/bill.service';
import {Bill} from '../_models/bill';
import {UserService} from '../_services/user.service';
import {NotificationService} from '../_services/notification.service';
import {MatPaginator, PageEvent} from '@angular/material/paginator';

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

  // @ts-ignore
  @ViewChild('paginator') paginator: MatPaginator;

  constructor(private billService: BillService,
              private userService: UserService,
              private notifService: NotificationService) {
    this.getPastBills();
  }

  ngOnInit(): void {
  }

  private getPastBills(): void {
    this.billService.getPastBills(this.userService.currentUserValue).subscribe(
      pastBills => {
        const userBills = this.userService.currentUserValue.bills;
        if (!userBills) {
          return;
        }

        for (const pastBill of pastBills) {
          const userBill = userBills.find(bill => // @ts-ignore
            bill.billId === pastBill.bill_id);
          if (userBill) {
            pastBill.votedYes = userBill.votedYes;
            pastBill.voteDate = userBill.voteDate;
          }
        }

        this.allBills = pastBills;
        this.searchedBills = pastBills;
        this.currentBills = this.searchedBills.slice(0, 10);
      },
        err => {
        console.log(err);
        this.notifService.showNotif(err);
      }
    );
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
