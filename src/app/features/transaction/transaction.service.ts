import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { PaginatedPaymentTransactionDto } from '../../api/transaction/payment-transaction-dto';
import { TransactionApiService } from '../../api/transaction/transaction/transaction-api.service';
import { PaginatedDetails, PaginatedPaymentTransaction, PaymentTransaction } from './payment-transaction';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private filteredTransactionsSubject = new BehaviorSubject<
    PaymentTransaction[]
  >([]);
  private paginatedTransactionsSubject =
    new BehaviorSubject<PaginatedPaymentTransaction>(
      {} as PaginatedPaymentTransactionDto
    );
  private transactionsSubject = new BehaviorSubject<PaymentTransaction[]>([]);

  filteredTransactions$ = this.filteredTransactionsSubject.asObservable();
  paginatedTransactions$ = this.paginatedTransactionsSubject.asObservable();
  transactions$ = this.transactionsSubject.asObservable();

  constructor(private transactionApiService: TransactionApiService) {}

  filterTransactions(status: string): void {
    if(status === ''){
      const result = this.transactionsSubject.value
      this.filteredTransactionsSubject.next(result)
    }

    const hasStatus = [
      'COMPLETED',
      'CAPTURED',
      'PENDING',
      'FAILED',
      'REFUNDED',
    ].includes(status);

    if (hasStatus) {
      const result = this.transactionsSubject.value.filter(
        (x) => x.status === status
      );
      this.filteredTransactionsSubject.next(result);
    }
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
  setPaginatedTransactions(
    transactions: PaginatedPaymentTransactionDto
  ): void {
    this.paginatedTransactionsSubject.next(transactions);
  }

  // Added for good measure
  setTransactions(transactions: PaymentTransaction[]): void {
    this.transactionsSubject.next(transactions);
  }
}
