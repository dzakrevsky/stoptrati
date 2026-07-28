export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  budgetLimit: number;
}

export interface ExpenseType {
  id: string;
  name: string;
  categoryId: string;
}

export interface Expense {
  id: string;
  categoryId: string;
  typeId: string;
  amount: number;
  date: string;
  note: string;
  currency: string;
}

export interface Settings {
  currency: '₽' | '$' | '€' | '₸';
  darkMode: boolean;
}

export type CurrencyCode = '₽' | '$' | '€' | '₸';
