import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Observable,
  catchError,
  delay,
  retryWhen,
  scan,
  tap,
  throwError,
} from 'rxjs';
import { PaginatedPaymentTransactionDto } from '../payment-transaction-dto';

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

    return this.http
      .get<PaginatedPaymentTransactionDto>(this.apiUrl, { headers, params })
      .pipe(
        retryWhen((errors: Observable<any>) =>
          errors.pipe(
            scan((retryCount: number, error: any) => {
              if (retryCount >= 3) {
                throw error;
              } else {
                return retryCount + 1;
              }
            }, 0),
            delay(2000),
            tap((retryCount: number) => {
              if (retryCount >= 3) {
                console.error(
                  `Failed to fetch transactions after ${retryCount} retries.`
                );
              }
            })
          )
        ),
        catchError((error: any) => {
          console.error('Failed to fetch transactions:', error);
          return throwError(error);
        })
      );
  }
}
