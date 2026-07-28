import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import ExpenseCard from '@/components/ExpenseCard';
import { formatAmount } from '@/utils/format';

export default function History() {
  const { expenses, categories, settings, deleteExpense } = useAppStore();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filteredExpenses = useMemo(() => {
    return [...expenses]
      .filter((expense) => {
        const category = categories.find((c) => c.id === expense.categoryId);
        const type = useAppStore.getState().types.find((t) => t.id === expense.typeId);
        const matchesSearch =
          !search ||
          category?.name.toLowerCase().includes(search.toLowerCase()) ||
          type?.name.toLowerCase().includes(search.toLowerCase()) ||
          expense.note.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = !categoryFilter || expense.categoryId === categoryFilter;
        const matchesDateFrom = !dateFrom || expense.date >= dateFrom;
        const matchesDateTo = !dateTo || expense.date <= dateTo;
        return matchesSearch && matchesCategory && matchesDateFrom && matchesDateTo;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, categories, search, categoryFilter, dateFrom, dateTo]);

  const totalFiltered = useMemo(
    () => filteredExpenses.reduce((sum, e) => sum + e.amount, 0),
    [filteredExpenses]
  );

  const hasFilters = search || categoryFilter || dateFrom || dateTo;

  const clearFilters = () => {
    setSearch('');
    setCategoryFilter('');
    setDateFrom('');
    setDateTo('');
  };

  return (
    <div className="page-transition">
      <div className="mb-8">
        <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight mb-2">
          История расходов
        </h1>
        <p className="text-[var(--apple-muted)] text-lg">
          Все ваши траты в одном месте
        </p>
      </div>

      <div className="glass-card p-6 mb-6 animate-fade-in-up stagger-1">
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal className="w-5 h-5 text-[var(--apple-accent)]" />
          <h2 className="font-semibold">Фильтры</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--apple-muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск..."
              className="apple-input pl-10"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="apple-input"
          >
            <option value="">Все категории</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="apple-input"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="apple-input"
          />
        </div>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="mt-4 text-sm text-[var(--apple-muted)] hover:text-[var(--apple-text)] flex items-center gap-1 transition-colors"
          >
            <X className="w-4 h-4" /> Сбросить фильтры
          </button>
        )}
      </div>

      <div className="glass-card p-6 mb-6 animate-fade-in-up stagger-2 flex items-center justify-between">
        <div>
          <p className="text-sm text-[var(--apple-muted)]">Найдено записей</p>
          <p className="text-2xl font-semibold">{filteredExpenses.length}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-[var(--apple-muted)]">Общая сумма</p>
          <p className="text-2xl font-semibold text-[var(--apple-accent)]">
            {formatAmount(totalFiltered, settings.currency)}
          </p>
        </div>
      </div>

      <div className="space-y-3 animate-fade-in-up stagger-3">
        {filteredExpenses.length > 0 ? (
          filteredExpenses.map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              onDelete={deleteExpense}
            />
          ))
        ) : (
          <div className="glass-card p-12 text-center">
            <p className="text-[var(--apple-muted)] text-lg mb-2">Ничего не найдено</p>
            <p className="text-[var(--apple-muted)] text-sm">
              Попробуйте изменить фильтры или добавьте новую запись
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
