import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { PaymentTransaction } from './features/transaction/payment-transaction';
import { TransactionService } from './features/transaction/transaction.service';
import { ListComponent } from './features/transactions/list/list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [TransactionService],
})
export class AppComponent implements OnInit {
  title = 'vyne-tech-test';

  page: number = 1;
  pageSize: number = 5;

  transactions$ = this.transactionService.getTransactions(
    this.page,
    this.pageSize
  );

  constructor(
    private transactionService: TransactionService,
  ) {}

  ngOnInit() {}

  getTransactions(
    page: number,
    pageSize: number
  ): Observable<PaymentTransaction[]> {
    return this.transactionService.getTransactions(page, pageSize);
  }
}
