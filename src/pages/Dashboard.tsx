import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, Calendar, Wallet, AlertCircle, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import ExpenseCard from '@/components/ExpenseCard';
import CategoryIcon from '@/components/CategoryIcon';
import { formatAmount } from '@/utils/format';
import { getStartOfDay, getStartOfWeek, getStartOfMonth } from '@/utils/format';

export default function Dashboard() {
  const { expenses, categories, settings, deleteExpense } = useAppStore();

  const stats = useMemo(() => {
    const today = getStartOfDay();
    const weekStart = getStartOfWeek();
    const monthStart = getStartOfMonth();

    const dayTotal = expenses
      .filter((e) => new Date(e.date) >= today)
      .reduce((sum, e) => sum + e.amount, 0);

    const weekTotal = expenses
      .filter((e) => new Date(e.date) >= weekStart)
      .reduce((sum, e) => sum + e.amount, 0);

    const monthTotal = expenses
      .filter((e) => new Date(e.date) >= monthStart)
      .reduce((sum, e) => sum + e.amount, 0);

    return { dayTotal, weekTotal, monthTotal };
  }, [expenses]);

  const categoryData = useMemo(() => {
    return categories
      .map((category) => {
        const total = expenses
          .filter((e) => e.categoryId === category.id)
          .reduce((sum, e) => sum + e.amount, 0);
        return {
          name: category.name,
          value: total,
          color: category.color,
          limit: category.budgetLimit,
          id: category.id,
        };
      })
      .filter((c) => c.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [categories, expenses]);

  const recentExpenses = useMemo(() => {
    return [...expenses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [expenses]);

  const overBudgetCategories = useMemo(() => {
    return categoryData.filter((c) => c.value > c.limit);
  }, [categoryData]);

  const dailyPercent = Math.min((stats.dayTotal / settings.dailyLimit) * 100, 100);
  const monthlyPercent = Math.min((stats.monthTotal / settings.monthlyLimit) * 100, 100);
  const isDailyOver = stats.dayTotal > settings.dailyLimit;
  const isMonthlyOver = stats.monthTotal > settings.monthlyLimit;

  const statCards = [
    { label: 'Сегодня', value: stats.dayTotal, icon: Calendar, delay: 'stagger-1' },
    { label: 'Неделя', value: stats.weekTotal, icon: TrendingUp, delay: 'stagger-2' },
    { label: 'Месяц', value: stats.monthTotal, icon: Wallet, delay: 'stagger-3' },
  ];

  return (
    <div className="page-transition">
      <div className="mb-10">
        <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight mb-2">
          Дашборд
        </h1>
        <p className="text-[var(--apple-muted)] text-lg">
          Ваши финансы под контролем
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className={`glass-card p-6 ${card.delay} opacity-0 animate-fade-in-up`}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--apple-accent)]/10 flex items-center justify-center">
                <card.icon className="w-5 h-5 text-[var(--apple-accent)]" />
              </div>
              <span className="text-[var(--apple-muted)] text-sm">{card.label}</span>
            </div>
            <p className="text-3xl font-semibold tracking-tight">
              {formatAmount(card.value, settings.currency)}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 animate-fade-in-up stagger-4">
        <div className="glass-card p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-[var(--apple-muted)]">Дневной лимит</span>
            <span className={isDailyOver ? 'text-[var(--apple-danger)] font-medium' : 'text-[var(--apple-muted)] text-sm'}>
              {formatAmount(stats.dayTotal, settings.currency)} / {formatAmount(settings.dailyLimit, settings.currency)}
            </span>
          </div>
          <div className="h-2.5 rounded-full bg-[var(--apple-surface-2)] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${dailyPercent}%`,
                backgroundColor: isDailyOver ? 'var(--apple-danger)' : 'var(--apple-accent)',
              }}
            />
          </div>
          {isDailyOver && (
            <p className="mt-2 text-xs text-[var(--apple-danger)]">Дневной лимит превышен</p>
          )}
        </div>
        <div className="glass-card p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-[var(--apple-muted)]">Месячный лимит</span>
            <span className={isMonthlyOver ? 'text-[var(--apple-danger)] font-medium' : 'text-[var(--apple-muted)] text-sm'}>
              {formatAmount(stats.monthTotal, settings.currency)} / {formatAmount(settings.monthlyLimit, settings.currency)}
            </span>
          </div>
          <div className="h-2.5 rounded-full bg-[var(--apple-surface-2)] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${monthlyPercent}%`,
                backgroundColor: isMonthlyOver ? 'var(--apple-danger)' : 'var(--apple-success)',
              }}
            />
          </div>
          {isMonthlyOver && (
            <p className="mt-2 text-xs text-[var(--apple-danger)]">Месячный лимит превышен</p>
          )}
        </div>
      </div>

      {(overBudgetCategories.length > 0 || isDailyOver || isMonthlyOver) && (
        <div className="glass-card p-4 mb-8 border-[var(--apple-danger)]/30 bg-[var(--apple-danger)]/5 animate-fade-in-up stagger-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[var(--apple-danger)] mt-0.5" />
            <div>
              <p className="font-medium text-[var(--apple-danger)]">Превышен лимит</p>
              <p className="text-sm text-[var(--apple-muted)]">
                {[
                  ...(isDailyOver ? ['дневной'] : []),
                  ...(isMonthlyOver ? ['месячный'] : []),
                  ...(overBudgetCategories.length > 0
                    ? [`категории: ${overBudgetCategories.map((c) => c.name).join(', ')}`]
                    : []),
                ].join('; ')}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="glass-card p-6 animate-fade-in-up stagger-4">
          <h2 className="text-xl font-semibold mb-6">Расходы по категориям</h2>
          {categoryData.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={2}
                    dataKey="value"
                    animationBegin={100}
                    animationDuration={800}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatAmount(value, settings.currency)}
                    contentStyle={{
                      backgroundColor: 'var(--apple-surface)',
                      border: '1px solid var(--apple-border)',
                      borderRadius: '12px',
                      color: 'var(--apple-text)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center text-[var(--apple-muted)]">
              Нет данных для отображения
            </div>
          )}
        </div>

        <div className="glass-card p-6 animate-fade-in-up stagger-5">
          <h2 className="text-xl font-semibold mb-6">Лимиты категорий</h2>
          <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
            {categories.map((category) => {
              const spent = expenses
                .filter((e) => e.categoryId === category.id)
                .reduce((sum, e) => sum + e.amount, 0);
              const percent = Math.min((spent / category.budgetLimit) * 100, 100);
              const isOver = spent > category.budgetLimit;

              return (
                <div key={category.id} className="flex items-center gap-3">
                  <CategoryIcon icon={category.icon} color={category.color} size="sm" />
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{category.name}</span>
                      <span className={isOver ? 'text-[var(--apple-danger)]' : 'text-[var(--apple-muted)]'}>
                        {formatAmount(spent, settings.currency)} / {formatAmount(category.budgetLimit, settings.currency)}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-[var(--apple-surface-2)] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percent}%`,
                          backgroundColor: isOver ? 'var(--apple-danger)' : category.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="glass-card p-6 animate-fade-in-up stagger-5">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Последние траты</h2>
          <Link
            to="/history"
            className="text-sm text-[var(--apple-accent)] hover:text-[var(--apple-accent-hover)] flex items-center gap-1 transition-colors"
          >
            Все записи <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-3">
          {recentExpenses.length > 0 ? (
            recentExpenses.map((expense) => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                onDelete={deleteExpense}
                showActions={false}
              />
            ))
          ) : (
            <p className="text-[var(--apple-muted)] text-center py-8">
              Пока нет записей. Добавьте первый расход.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
