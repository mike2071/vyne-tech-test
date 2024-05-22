import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { PaginatedPaymentTransactionDto } from '../../api/payment-transaction-dto';
import { TransactionApiService } from '../../api/transaction/transaction-api.service';
import {
  PaginatedDetails,
  PaginatedPaymentTransaction,
  PaymentTransaction,
} from './payment-transaction.model';
import { TransactionService } from './transaction.service';

describe('TransactionService', () => {
  let service: TransactionService;
  let transactionApiService: jasmine.SpyObj<TransactionApiService>;

  beforeEach(() => {
    const transactionApiServiceSpy = jasmine.createSpyObj(
      'TransactionApiService',
      ['getTransactions']
    );

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TransactionService,
        TransactionApiService,
        { provide: TransactionApiService, useValue: transactionApiServiceSpy },
      ],
    });
    (service = TestBed.inject(TransactionService)),
      (transactionApiService = TestBed.inject(
        TransactionApiService
      ) as jasmine.SpyObj<TransactionApiService>);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Filter functions
 it('should return all transactions when status is NONE', (done) => {
    const transactions: PaymentTransaction[] = [
      {
        id: '1',
        amount: 100,
        currency: 'USD',
        description: 'Test 1',
        status: 'CREATED',
        createdAt: '2021-01-01T00:00:00Z',
      },
      {
        id: '2',
        amount: 200,
        currency: 'USD',
        description: 'Test 2',
        status: 'CAPTURED',
        createdAt: '2021-01-02T00:00:00Z',
      },
    ];
    service['transactionsSubject'].next(transactions);

    service.filterTransactions('NONE').subscribe((result) => {
      expect(result.length).toBe(2);
      expect(result).toEqual(transactions);
      done();
    });
  });

  it('should filter transactions by status', (done) => {
    const transactions: PaymentTransaction[] = [
      {
        id: '1',
        amount: 100,
        currency: 'USD',
        description: 'Test 1',
        status: 'CREATED',
        createdAt: '2021-01-01T00:00:00Z',
      },
      {
        id: '2',
        amount: 200,
        currency: 'USD',
        description: 'Test 2',
        status: 'CAPTURED',
        createdAt: '2021-01-02T00:00:00Z',
      },
    ];
    service['transactionsSubject'].next(transactions);

    service.filterTransactions('CREATED').subscribe((result) => {
      expect(result.length).toBe(1);
      expect(result[0].status).toBe('CREATED');
      expect(result[0].id).toBe('1');
      done();
    });
  });

  it('should return all transactions when status is not in statuses', (done) => {
    const transactions: PaymentTransaction[] = [
      {
        id: '1',
        amount: 100,
        currency: 'USD',
        description: 'Test 1',
        status: 'CREATED',
        createdAt: '2021-01-01T00:00:00Z',
      },
      {
        id: '2',
        amount: 200,
        currency: 'USD',
        description: 'Test 2',
        status: 'CAPTURED',
        createdAt: '2021-01-02T00:00:00Z',
      },
    ];
    service['transactionsSubject'].next(transactions);

    service.filterTransactions('INVALID_STATUS').subscribe((result) => {
      expect(result.length).toBe(2);
      expect(result).toEqual(transactions);
      done();
    });
  });

  it('should return empty array if there are no transactions with the given status', (done) => {
    const transactions: PaymentTransaction[] = [
      {
        id: '1',
        amount: 100,
        currency: 'USD',
        description: 'Test 1',
        status: 'CREATED',
        createdAt: '2021-01-01T00:00:00Z',
      },
      {
        id: '2',
        amount: 200,
        currency: 'USD',
        description: 'Test 2',
        status: 'CAPTURED',
        createdAt: '2021-01-02T00:00:00Z',
      },
    ];
    service['transactionsSubject'].next(transactions);

    service.filterTransactions('SETTLED').subscribe((result) => {
      expect(result.length).toBe(0);
      done();
    });
  });

  // Transaction functions

  it('should get transactions and update subjects', (done) => {
    const paginatedResponse: PaginatedPaymentTransactionDto = {
      currentPage: 1,
      hasNext: true,
      items: [
        {
          id: '1',
          amount: 100,
          currency: 'USD',
          description: 'Test 1',
          status: 'CREATED',
          createdAt: '2021-01-01T00:00:00Z',
        },
        {
          id: '2',
          amount: 200,
          currency: 'USD',
          description: 'Test 2',
          status: 'CAPTURED',
          createdAt: '2021-01-02T00:00:00Z',
        },
      ],
      numberOfPages: 3,
      pageSize: 10,
      totalNumberOfItems: 30,
    };

    transactionApiService.getTransactions.and.returnValue(
      of(paginatedResponse)
    );

    service.getTransactions(1, 10).subscribe((transactions) => {
      expect(transactions).toEqual(paginatedResponse.items);
      expect(service['paginatedTransactionsSubject'].value).toEqual(
        paginatedResponse
      );
      expect(service['transactionsSubject'].value).toEqual(
        paginatedResponse.items
      );
      done();
    });
  });

  // Pagination functions

  it('should return correct pagination details', () => {
    const paginatedData: PaginatedPaymentTransaction = {
      currentPage: 2,
      hasNext: true,
      items: [
        {
          id: '1',
          amount: 100,
          currency: 'USD',
          description: 'Test 1',
          status: 'CREATED',
          createdAt: '2021-01-01T00:00:00Z',
        },
      ],
      numberOfPages: 5,
      pageSize: 10,
      totalNumberOfItems: 50,
    };
    service['paginatedTransactionsSubject'].next(paginatedData);

    const paginationDetails: PaginatedDetails = service.getPaginationDetails();

    expect(paginationDetails.currentPage).toBe(2);
    expect(paginationDetails.hasNext).toBe(true);
    expect(paginationDetails.numberOfPages).toBe(5);
    expect(paginationDetails.pageSize).toBe(10);
    expect(paginationDetails.totalNumberOfItems).toBe(50);
  });

  it('should return default pagination details if no data is set', () => {
    const paginatedData: PaginatedPaymentTransaction = {
      currentPage: 0,
      hasNext: false,
      items: [
        {
          id: '1',
          amount: 100,
          currency: 'USD',
          description: 'Test 1',
          status: 'CREATED',
          createdAt: '2021-01-01T00:00:00Z',
        },
      ],
      numberOfPages: 0,
      pageSize: 10,
      totalNumberOfItems: 50,
    };

    service.setPaginatedTransactions(paginatedData);
    const paginationDetails: PaginatedDetails = service.getPaginationDetails();

    expect(paginationDetails.currentPage).toBe(0);
    expect(paginationDetails.hasNext).toBe(false);
    expect(paginationDetails.numberOfPages).toBe(0);
    expect(paginationDetails.pageSize).toBe(10);
    expect(paginationDetails.totalNumberOfItems).toBe(50);
  });

  // Set functions

  it('should set filtered transactions', () => {
    const transactions: PaymentTransaction[] = [
      {
        id: '1',
        amount: 100,
        currency: 'USD',
        description: 'Test 1',
        status: 'CREATED',
        createdAt: '2021-01-01T00:00:00Z',
      },
      {
        id: '2',
        amount: 200,
        currency: 'USD',
        description: 'Test 2',
        status: 'CAPTURED',
        createdAt: '2021-01-02T00:00:00Z',
      },
    ];

    service.setFilteredTransactions(transactions);

    service['filteredTransactionsSubject'].subscribe((filteredTransactions) => {
      expect(filteredTransactions).toEqual(transactions);
    });
  });

  it('should set paginated transactions', () => {
    const paginatedTransactions: PaginatedPaymentTransaction = {
      currentPage: 1,
      hasNext: true,
      items: [
        {
          id: '1',
          amount: 100,
          currency: 'USD',
          description: 'Test 1',
          status: 'CREATED',
          createdAt: '2021-01-01T00:00:00Z',
        },
        {
          id: '2',
          amount: 200,
          currency: 'USD',
          description: 'Test 2',
          status: 'CAPTURED',
          createdAt: '2021-01-02T00:00:00Z',
        },
      ],
      numberOfPages: 3,
      pageSize: 10,
      totalNumberOfItems: 30,
    };

    service.setPaginatedTransactions(paginatedTransactions);

    service['paginatedTransactionsSubject'].subscribe((paginatedData) => {
      expect(paginatedData).toEqual(paginatedTransactions);
    });
  });

  it('should set transactions', () => {
    const transactions: PaymentTransaction[] = [
      {
        id: '1',
        amount: 100,
        currency: 'USD',
        description: 'Test 1',
        status: 'CREATED',
        createdAt: '2021-01-01T00:00:00Z',
      },
      {
        id: '2',
        amount: 200,
        currency: 'USD',
        description: 'Test 2',
        status: 'CAPTURED',
        createdAt: '2021-01-02T00:00:00Z',
      },
    ];

    service.setTransactions(transactions);

    service['transactionsSubject'].subscribe((allTransactions) => {
      expect(allTransactions).toEqual(transactions);
    });
  });
});
