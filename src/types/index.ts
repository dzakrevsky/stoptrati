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

export type Person = 'Даня' | 'Лизун';

export const PEOPLE: Person[] = ['Даня', 'Лизун'];

export interface Expense {
  id: string;
  categoryId: string;
  typeId: string;
  person: Person;
  amount: number;
  date: string;
  note: string;
  currency: string;
}

export interface Settings {
  currency: '₽' | '$' | '€' | '₸';
  darkMode: boolean;
  dailyLimit: number;
  monthlyLimit: number;
}

export type CurrencyCode = '₽' | '$' | '€' | '₸';
