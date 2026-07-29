import { create } from 'zustand';
import type { Category, Expense, ExpenseType, Settings, Person } from '@/types';
import { PEOPLE } from '@/types';
import { loadSharedState, saveSharedState } from '@/lib/supabase';
import type { SharedState } from '@/lib/supabase';

const generateId = () => Math.random().toString(36).substring(2, 10);

const defaultCategories: Category[] = [
  { id: 'cat-1', name: 'Продукты', color: '#30d158', icon: 'ShoppingBasket', budgetLimit: 15000, dailyLimits: { 'Даня': 800, 'Лизун': 800 } },
  { id: 'cat-2', name: 'Транспорт', color: '#2997ff', icon: 'Bus', budgetLimit: 5000, dailyLimits: { 'Даня': 300, 'Лизун': 300 } },
  { id: 'cat-3', name: 'Развлечения', color: '#ff375f', icon: 'Gamepad2', budgetLimit: 8000, dailyLimits: { 'Даня': 400, 'Лизун': 400 } },
  { id: 'cat-4', name: 'Здоровье', color: '#af52de', icon: 'HeartPulse', budgetLimit: 6000, dailyLimits: { 'Даня': 300, 'Лизун': 300 } },
  { id: 'cat-5', name: 'Жильё', color: '#ff9500', icon: 'Home', budgetLimit: 30000, dailyLimits: { 'Даня': 1000, 'Лизун': 1000 } },
  { id: 'cat-6', name: 'Одежда', color: '#5ac8fa', icon: 'Shirt', budgetLimit: 7000, dailyLimits: { 'Даня': 500, 'Лизун': 500 } },
  { id: 'cat-7', name: 'Прочее', color: '#8e8e93', icon: 'MoreHorizontal', budgetLimit: 3000, dailyLimits: { 'Даня': 200, 'Лизун': 200 } },
];

const defaultTypes: ExpenseType[] = [
  { id: 'type-1', name: 'Супермаркет', categoryId: 'cat-1' },
  { id: 'type-2', name: 'Ресторан', categoryId: 'cat-1' },
  { id: 'type-3', name: 'Доставка', categoryId: 'cat-1' },
  { id: 'type-4', name: 'Такси', categoryId: 'cat-2' },
  { id: 'type-5', name: 'Метро', categoryId: 'cat-2' },
  { id: 'type-6', name: 'Бензин', categoryId: 'cat-2' },
  { id: 'type-7', name: 'Кино', categoryId: 'cat-3' },
  { id: 'type-8', name: 'Игры', categoryId: 'cat-3' },
  { id: 'type-9', name: 'Подписки', categoryId: 'cat-3' },
  { id: 'type-10', name: 'Аптека', categoryId: 'cat-4' },
  { id: 'type-11', name: 'Врач', categoryId: 'cat-4' },
  { id: 'type-12', name: 'Спорт', categoryId: 'cat-4' },
  { id: 'type-13', name: 'Аренда', categoryId: 'cat-5' },
  { id: 'type-14', name: 'Коммунальные', categoryId: 'cat-5' },
  { id: 'type-15', name: 'Ремонт', categoryId: 'cat-5' },
  { id: 'type-16', name: 'Обувь', categoryId: 'cat-6' },
  { id: 'type-17', name: 'Аксессуары', categoryId: 'cat-6' },
  { id: 'type-18', name: 'Подарки', categoryId: 'cat-7' },
];

const demoExpenses: Expense[] = [
  { id: 'exp-1', categoryId: 'cat-1', typeId: 'type-1', person: 'Даня', amount: 2450, date: new Date().toISOString().split('T')[0], note: 'Пятничная закупка', currency: '₽' },
  { id: 'exp-2', categoryId: 'cat-2', typeId: 'type-4', person: 'Лизун', amount: 380, date: new Date().toISOString().split('T')[0], note: 'До дома', currency: '₽' },
  { id: 'exp-3', categoryId: 'cat-3', typeId: 'type-9', person: 'Даня', amount: 599, date: new Date(Date.now() - 86400000).toISOString().split('T')[0], note: 'Подписка на стриминг', currency: '₽' },
];

export interface AppState {
  expenses: Expense[];
  categories: Category[];
  types: ExpenseType[];
  settings: Settings;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, data: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, data: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addType: (type: Omit<ExpenseType, 'id'>) => void;
  updateType: (id: string, data: Partial<ExpenseType>) => void;
  deleteType: (id: string) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  resetAll: () => void;
  hasExpensesForCategory: (categoryId: string) => boolean;
  loadFromServer: () => Promise<void>;
  setError: (error: string | null) => void;
}

const initialData = {
  expenses: demoExpenses,
  categories: defaultCategories,
  types: defaultTypes,
  settings: { currency: '₽' as const, darkMode: true, monthlyLimit: 60000 },
};

const migrateCategoryDailyLimits = (categories: Category[]): Category[] => {
  return categories.map((category) => {
    if (category.dailyLimits && PEOPLE.every((p) => typeof category.dailyLimits[p] === 'number')) {
      return category;
    }
    const defaultDaily = Math.max(100, Math.round(category.budgetLimit / 30 / PEOPLE.length));
    return {
      ...category,
      dailyLimits: {
        'Даня': category.dailyLimits?.['Даня'] ?? defaultDaily,
        'Лизун': category.dailyLimits?.['Лизун'] ?? defaultDaily,
      } as Record<Person, number>,
    };
  });
};

export const useAppStore = create<AppState>()((set, get) => ({
  ...initialData,
  isLoading: true,
  isSaving: false,
  error: null,
  addExpense: (expense) =>
    set((state) => ({
      expenses: [...state.expenses, { ...expense, id: generateId() }],
    })),
  updateExpense: (id, data) =>
    set((state) => ({
      expenses: state.expenses.map((e) => (e.id === id ? { ...e, ...data } : e)),
    })),
  deleteExpense: (id) =>
    set((state) => ({
      expenses: state.expenses.filter((e) => e.id !== id),
    })),
  addCategory: (category) =>
    set((state) => ({
      categories: [...state.categories, { ...category, id: generateId() }],
    })),
  updateCategory: (id, data) =>
    set((state) => ({
      categories: state.categories.map((c) => (c.id === id ? { ...c, ...data } : c)),
    })),
  deleteCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
      types: state.types.filter((t) => t.categoryId !== id),
    })),
  addType: (type) =>
    set((state) => ({
      types: [...state.types, { ...type, id: generateId() }],
    })),
  updateType: (id, data) =>
    set((state) => ({
      types: state.types.map((t) => (t.id === id ? { ...t, ...data } : t)),
    })),
  deleteType: (id) =>
    set((state) => ({
      types: state.types.filter((t) => t.id !== id),
    })),
  updateSettings: (settings) =>
    set((state) => ({
      settings: { ...state.settings, ...settings },
    })),
  resetAll: () => set({ ...initialData, expenses: [], isLoading: false, isSaving: false, error: null }),
  hasExpensesForCategory: (categoryId) =>
    get().expenses.some((e) => e.categoryId === categoryId),
  loadFromServer: async () => {
    try {
      set({ isLoading: true, error: null });
      const serverState = await loadSharedState();
      if (serverState) {
        set({
          expenses: serverState.expenses ?? initialData.expenses,
          categories: migrateCategoryDailyLimits(serverState.categories ?? initialData.categories),
          types: serverState.types ?? initialData.types,
          settings: { ...initialData.settings, ...(serverState.settings ?? {}) },
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (err) {
      set({ isLoading: false, error: err instanceof Error ? err.message : 'Ошибка загрузки данных' });
    }
  },
  setError: (error) => set({ error }),
}));

let saveTimeout: ReturnType<typeof setTimeout> | null = null;

export const saveStoreToServer = async () => {
  const state = useAppStore.getState();
  const payload: SharedState = {
    expenses: state.expenses,
    categories: state.categories,
    types: state.types,
    settings: state.settings,
  };

  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(async () => {
    try {
      useAppStore.setState({ isSaving: true, error: null });
      await saveSharedState(payload);
      useAppStore.setState({ isSaving: false });
    } catch (err) {
      useAppStore.setState({
        isSaving: false,
        error: err instanceof Error ? err.message : 'Ошибка сохранения данных',
      });
    }
  }, 800);
};
