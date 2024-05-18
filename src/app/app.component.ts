import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { TransactionService } from './features/transaction/transaction.service';
import { PaymentTransaction } from './features/transaction/payment-transaction';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, MatCardModule],
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

  constructor(private transactionService: TransactionService, private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
  }
  
  getTransactions(
    page: number,
    pageSize: number
  ): Observable<PaymentTransaction[]> {
    return this.transactionService.getTransactions(page, pageSize);
  }
}
