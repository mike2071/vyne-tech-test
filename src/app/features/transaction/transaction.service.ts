import { Injectable } from '@angular/core';
import { PaymentTransactionDto } from '../../api/transaction/payment-transaction-dto';
import { TransactionApiService } from '../../api/transaction/transaction/transaction-api.service';
import { Observable, map, tap } from 'rxjs';
import {
  PaginatedPaymentTransaction,
  PaymentTransaction,
} from './payment-transaction';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(private transactionApiService: TransactionApiService) {}

  getTransactions(
    page: number,
    pageSize: number
  ): Observable<PaymentTransaction[]> {
    return this.transactionApiService.getTransactions(page, pageSize).pipe(
      tap((x) => console.log('x', x)),
      map((x) => x?.items)
    );
  }
}
