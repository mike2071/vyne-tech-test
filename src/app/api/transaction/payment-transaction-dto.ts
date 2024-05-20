export interface PaymentTransactionDto {
  amount: number;
  createdAt: string; // Alternatively, you could use Date if you parse the date strings
  currency: string;
  description: string;
  id: string;
  status: 'COMPLETED' | 'CREATED' | 'SETTLED'; // Adjust enum values as needed
}

export interface PaginatedPaymentTransactionDto {
  currentPage: number;
  hasNext: boolean;
  items: PaymentTransactionDto[];
  numberOfPages: number;
  pageSize: number;
  totalNumberOfItems: number;
}
