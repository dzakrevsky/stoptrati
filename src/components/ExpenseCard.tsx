import { Link } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import CategoryIcon from '@/components/CategoryIcon';
import { formatAmount, formatDate } from '@/utils/format';
import type { Expense } from '@/types';

interface ExpenseCardProps {
  expense: Expense;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export default function ExpenseCard({ expense, onDelete, showActions = true }: ExpenseCardProps) {
  const { categories, types, settings } = useAppStore();
  const category = categories.find((c) => c.id === expense.categoryId);
  const type = types.find((t) => t.id === expense.typeId);

  if (!category || !type) return null;

  return (
    <div className="glass-card p-4 flex items-center gap-4 animate-fade-in-up">
      <CategoryIcon icon={category.icon} color={category.color} size="md" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-[var(--apple-text)] truncate">
            {type.name}
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${category.color}20`, color: category.color }}
          >
            {category.name}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--apple-accent)]/10 text-[var(--apple-accent)]">
            {expense.person}
          </span>
        </div>
        <p className="text-sm text-[var(--apple-muted)] truncate">
          {expense.note || 'Без заметки'} · {formatDate(expense.date)}
        </p>
      </div>
      <div className="text-right">
        <p className="font-semibold text-[var(--apple-text)]">
          {formatAmount(expense.amount, settings.currency)}
        </p>
      </div>
      {showActions && (
        <div className="flex items-center gap-1">
          <Link
            to={`/add?edit=${expense.id}`}
            className="p-2 rounded-lg text-[var(--apple-muted)] hover:text-[var(--apple-accent)] hover:bg-[var(--apple-accent)]/10 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </Link>
          <button
            onClick={() => onDelete?.(expense.id)}
            className="p-2 rounded-lg text-[var(--apple-muted)] hover:text-[var(--apple-danger)] hover:bg-[var(--apple-danger)]/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
