export interface PaymentTransaction {
  amount: number;
  createdAt: string; // Alternatively, you could use Date if you parse the date strings
  currency: string;
  description: string;
  id: string;
  status: 'COMPLETED' | 'CREATED' | 'SETTLED' | 'CAPTURED'; // Adjust enum values as needed
}

export interface PaginatedPaymentTransaction {
  currentPage: number;
  hasNext: boolean;
  items: PaymentTransaction[];
  numberOfPages: number;
  pageSize: number;
  totalNumberOfItems: number;
}

export interface PaginatedDetails  {
  currentPage: number;
  hasNext: boolean;
  numberOfPages: number;
  pageSize: number;
  totalNumberOfItems: number;
}
