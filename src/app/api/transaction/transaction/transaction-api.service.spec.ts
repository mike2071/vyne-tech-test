import { TestBed } from '@angular/core/testing';

import { TransactionApiService } from './transaction-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TransactionApiService', () => {
  let service: TransactionApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(TransactionApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
