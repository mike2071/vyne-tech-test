import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  PaginatedPaymentTransactionDto
} from '../payment-transaction-dto';

@Injectable({
  providedIn: 'root',
})
export class TransactionApiService {
  // Parts of this should be a config file
  private apiUrl = 'http://localhost:8080/api/v1/payments';

  constructor(private http: HttpClient) {}

  getTransactions(
    page: number,
    size: number,
    status = ''
  ): Observable<PaginatedPaymentTransactionDto> {
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(`${'user'}:${'userPass'}`),
    });

    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('status', status);

    return this.http.get<PaginatedPaymentTransactionDto>(this.apiUrl, {
      headers,
      params,
    });
  }
}
