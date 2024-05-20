import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterOutlet } from '@angular/router';
import { Observable, Subscription, tap } from 'rxjs';
import {
  PaginatedPaymentTransaction,
  PaymentTransaction,
} from './features/transaction/payment-transaction';
import { TransactionService } from './features/transaction/transaction.service';
import { ListComponent } from './features/transactions/list/list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ListComponent, MatPaginatorModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [TransactionService],
})
export class AppComponent implements OnInit, OnDestroy {
  currentPage = 0;
  disabled = false;
  filteredTransactions: PaymentTransaction[] = [];
  hidePageSize = false;
  pageEvent: PageEvent | undefined;
  pageSize = 5;
  pageSizeOptions = [1, 2, 5];
  paginatedTransactions$: Observable<PaginatedPaymentTransaction> | undefined;
  showFirstLastButtons = true;
  showPageSizeOptions = true;
  subscriptions: Subscription[] = [];
  title = 'vyne-tech-test';
  totalNumberOfItems = 10;
  transactions: PaymentTransaction[] = [];
  transactions$: Observable<PaymentTransaction[]> | undefined;
  showTransactions = true;

  constructor(private transactionService: TransactionService) {}

  filterTransactionsByStatus(status: string): void {
    this.transactionService.filterTransactions(status);
  }

  handlePageEvent(e: PageEvent): void {
    this.transactions$ = this.transactionService.getTransactions(
      e.pageIndex,
      e.pageSize
    );

    this.pageEvent = e;
    this.totalNumberOfItems = e.length;
    this.pageSize = e.pageSize;
    this.currentPage = e.pageIndex;
  }

  // I might ordinarily have this at the bottom, but the class organiser I am using needs config
  ngOnDestroy(): void {
    this.subscriptions.map((x) => x.unsubscribe());
  }

  ngOnInit() {
    if (this.showTransactions) {
      const transctionsSubscription = this.transactionService
        .getTransactions(this.currentPage, this.pageSize)
        .subscribe();
      this.subscriptions.push(transctionsSubscription);
    }

    this.setTransactionAddToSubscriptionsList();

    this.setFilteredTransactionsAddToSubscriptionsToList();

    this.setTransactionPaginationDetailsAddToSubscriptionsList();
  }

  removeFilter() {
    this.transactionService.filterTransactions('');
  }

  private setFilteredTransactionsAddToSubscriptionsToList() {
    const filteredTransactionSubscription =
      this.transactionService.filteredTransactions$
        .pipe(tap((x) => (this.transactions = x)))
        .subscribe();
    this.subscriptions.push(filteredTransactionSubscription);
  }

  private setTransactionAddToSubscriptionsList() {
    const transctionsSubjectSubscription = this.transactionService.transactions$
      .pipe(tap((x) => (this.transactions = x)))
      .subscribe();
    this.subscriptions.push(transctionsSubjectSubscription);
  }

  private setTransactionPaginationDetailsAddToSubscriptionsList() {
    const paginatedTransctionsSubjectSubscription =
      this.transactionService.paginatedTransactions$
        .pipe(
          tap((x) => {
            this.totalNumberOfItems = x.totalNumberOfItems;
            this.pageSize = x.pageSize;
            this.currentPage = x.currentPage;
          })
        )
        .subscribe();
    this.subscriptions.push(paginatedTransctionsSubjectSubscription);
  }
}
