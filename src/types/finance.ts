export type TransactionType = 'income' | 'expense';

export interface ParsedDateInfo {
  year: number;
  month: number;
  day: number;
  timestamp: number;
  formattedBn: string;
  formattedEn: string;
  rawIso: string;
}

export interface Transaction {
  id: string;
  date: string;
  parsedDate: ParsedDateInfo;
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  donorOrRecipient?: string;
  method?: string;
  notes?: string;
}

export interface FinanceSummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  totalTransactions: number;
  incomeCount: number;
  expenseCount: number;
  expenseRatio: number; // percentage 0-100
}

export interface FinanceApiResponse {
  success: boolean;
  transactions: Transaction[];
  summary: FinanceSummary;
  source: 'live' | 'fallback';
  timestamp: string;
}
