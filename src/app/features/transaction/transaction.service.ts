import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { PaginatedPaymentTransactionDto } from '../../api/transaction/payment-transaction-dto';
import { TransactionApiService } from '../../api/transaction/transaction/transaction-api.service';
import {
  PaginatedDetails,
  PaginatedPaymentTransaction,
  PaymentTransaction,
} from './payment-transaction.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private filteredTransactionsSubject = new BehaviorSubject<
    PaymentTransaction[]
  >([]);
  private paginatedTransactionsSubject =
    new BehaviorSubject<PaginatedPaymentTransaction>(
      {} as PaginatedPaymentTransaction
    );
  private transactionsSubject = new BehaviorSubject<PaymentTransaction[]>([]);

  filteredTransactions$ = this.filteredTransactionsSubject.asObservable();
  paginatedTransactions$ = this.paginatedTransactionsSubject.asObservable();
  statuses = ['COMPLETED', 'CREATED', 'SETTLED', 'CAPTURED'];
  transactions$ = this.transactionsSubject
    .asObservable()
    .pipe(tap((x) => console.log('Transactions in Service: ', x)));

  constructor(private transactionApiService: TransactionApiService) {}

  filterTransactions(status: string): Observable<PaymentTransaction[]> {
    // There is a simpler way to do this in the markup, but I can't remember and feel it's not too important
    if (status === 'NONE') {
      const result = this.transactionsSubject.value;
      this.filteredTransactionsSubject.next(result);

      return this.filteredTransactions$;
    } else {
      const hasStatus = this.statuses.includes(status);

      if (hasStatus) {
        const result = this.transactionsSubject.value.filter(
          (x) => x.status === status
        );
        this.filteredTransactionsSubject.next(result);

        return this.filteredTransactions$;
      }
    }

    return this.transactions$;
  }

  getPaginationDetails(): PaginatedDetails {
    return {
      currentPage: this.paginatedTransactionsSubject.value.currentPage,
      hasNext: this.paginatedTransactionsSubject.value.hasNext,
      numberOfPages: this.paginatedTransactionsSubject.value.numberOfPages,
      pageSize: this.paginatedTransactionsSubject.value.pageSize,
      totalNumberOfItems:
        this.paginatedTransactionsSubject.value.totalNumberOfItems,
    } as PaginatedDetails;
  }

  getTransactions(
    page: number,
    pageSize: number
  ): Observable<PaymentTransaction[]> {
    return this.transactionApiService.getTransactions(page, pageSize).pipe(
      tap((response) => {
        this.paginatedTransactionsSubject.next(response);
        this.transactionsSubject.next(response.items);
      }),
      map((response) => response.items)
    );
  }

  // Added for good measure
  setFilteredTransactions(transactions: PaymentTransaction[]): void {
    this.filteredTransactionsSubject.next(transactions);
  }

  // Added for good measure
  setPaginatedTransactions(transactions: PaginatedPaymentTransaction): void {
    this.paginatedTransactionsSubject.next(transactions);
  }

  // Added for good measure
  setTransactions(transactions: PaymentTransaction[]): void {
    this.transactionsSubject.next(transactions);
  }
}
