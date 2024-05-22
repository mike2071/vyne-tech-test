import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { RouterOutlet } from '@angular/router';
import { Observable, Subscription, tap } from 'rxjs';
import { ListComponent } from './features/transaction/list/list.component';
import {
  PaginatedPaymentTransaction,
  PaymentTransaction,
} from './features/transaction/payment-transaction.model';
import { TransactionService } from './features/transaction/transaction.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    ListComponent,
    MatPaginatorModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [TransactionService],
})
export class AppComponent implements OnInit, OnDestroy {
  // I try to avoid comments at all costs normally, I have added these for memory joggers and conversation points
  currentPage = 0;
  disabled = false;
  filteredTransactions: PaymentTransaction[] = [];
  hidePageSize = false;
  pageEvent: PageEvent | undefined;
  pageSize = 5;
  pageSizeOptions = [1, 2, 5];
  paginatedTransactions$: Observable<PaginatedPaymentTransaction> | undefined;
  selected = '';
  showFirstLastButtons = true;
  showPageSizeOptions = true;
  showTransactions = true;
  statuses = this.transactionService.statuses;
  subscriptions: Subscription[] = [];
  title = 'vyne-tech-test';
  totalNumberOfItems = 10;
  transactions: PaymentTransaction[] = [];
  transactions$: Observable<PaymentTransaction[]> | undefined;

  constructor(private transactionService: TransactionService) {}

  filterTransactionsByStatus(status: string): void {
    this.transactionService.filterTransactions(status);
  }

  handlePageEvent(e: PageEvent): void {
    // if the data set being set was smaller, I might like not to hit the db again nowing the data already in memory
    this.transactionService
      .getTransactions(e.pageIndex, e.pageSize)
      .pipe(tap((x) => (this.transactions = x)))
      .subscribe();

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

  private setFilteredTransactionsAddToSubscriptionsToList(): void {
    const result$ = this.transactionService.filteredTransactions$.pipe(
      tap((x) => (this.transactions = x))
    );

    const filteredTransactionSubscription = result$.subscribe();
    this.subscriptions.push(filteredTransactionSubscription);
  }

  private setTransactionAddToSubscriptionsList(): void {
    const result$ = this.transactionService.transactions$.pipe(
      tap((x) => (this.transactions = x))
    );

    const transctionsSubjectSubscription = result$.subscribe();
    this.subscriptions.push(transctionsSubjectSubscription);
  }

  private setTransactionPaginationDetailsAddToSubscriptionsList(): void {
    const result$ = this.transactionService.paginatedTransactions$.pipe(
      tap((x) => {
        this.totalNumberOfItems = x.totalNumberOfItems;
        this.pageSize = x.pageSize;
        this.currentPage = x.currentPage;
      })
    );

    const paginatedTransctionsSubjectSubscription = result$.subscribe();
    this.subscriptions.push(paginatedTransctionsSubjectSubscription);
  }
}
