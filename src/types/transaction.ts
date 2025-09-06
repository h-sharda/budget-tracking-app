export interface Transaction {
  id: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  description?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFilters {
  month: string;
  year: string;
  type: string;
  category: string;
  sortBy: "date" | "amount";
  sortOrder: "asc" | "desc";
}

export interface TransactionFormData
  extends Omit<Transaction, "id" | "createdAt" | "updatedAt"> {
  id?: string;
}
