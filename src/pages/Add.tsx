import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Check } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import CategoryIcon from '@/components/CategoryIcon';
import { formatAmount, formatDate } from '@/utils/format';
import type { Expense } from '@/types';

export default function Add() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const { expenses, categories, types, settings, addExpense, updateExpense } = useAppStore();

  const editingExpense = useMemo(
    () => expenses.find((e) => e.id === editId),
    [expenses, editId]
  );

  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [typeId, setTypeId] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (editingExpense) {
      setCategoryId(editingExpense.categoryId);
      setTypeId(editingExpense.typeId);
      setAmount(String(editingExpense.amount));
      setDate(editingExpense.date);
      setNote(editingExpense.note);
    }
  }, [editingExpense]);

  useEffect(() => {
    const availableTypes = types.filter((t) => t.categoryId === categoryId);
    if (availableTypes.length > 0 && !availableTypes.find((t) => t.id === typeId)) {
      setTypeId(availableTypes[0].id);
    }
  }, [categoryId, types, typeId]);

  const availableTypes = useMemo(
    () => types.filter((t) => t.categoryId === categoryId),
    [types, categoryId]
  );

  const selectedCategory = categories.find((c) => c.id === categoryId);
  const selectedType = types.find((t) => t.id === typeId);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!categoryId) newErrors.category = 'Выберите категорию';
    if (!typeId) newErrors.type = 'Выберите тип';
    if (!amount || Number(amount) <= 0) newErrors.amount = 'Введите сумму больше 0';
    if (!date) newErrors.date = 'Выберите дату';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const data: Omit<Expense, 'id'> = {
      categoryId,
      typeId,
      amount: Number(amount),
      date,
      note,
      currency: settings.currency,
    };

    if (editingExpense) {
      updateExpense(editingExpense.id, data);
    } else {
      addExpense(data);
    }

    setSuccess(true);
    setTimeout(() => {
      if (!editingExpense) {
        setAmount('');
        setNote('');
        setDate(new Date().toISOString().split('T')[0]);
        setErrors({});
      }
      setSuccess(false);
      if (editingExpense) {
        navigate('/history');
      }
    }, 800);
  };

  return (
    <div className="page-transition">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-sm text-[var(--apple-muted)] hover:text-[var(--apple-text)] flex items-center gap-1 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Назад
      </button>

      <div className="mb-8">
        <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight mb-2">
          {editingExpense ? 'Редактировать трату' : 'Добавить трату'}
        </h1>
        <p className="text-[var(--apple-muted)] text-lg">
          Укажите категорию, тип и сумму
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={handleSubmit} className="glass-card p-6 animate-fade-in-up stagger-1">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Категория</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setCategoryId(category.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      categoryId === category.id
                        ? 'border-[var(--apple-accent)] bg-[var(--apple-accent)]/10'
                        : 'border-[var(--apple-border)] bg-[var(--apple-surface-2)] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CategoryIcon icon={category.icon} color={category.color} size="sm" />
                      <span className="text-sm font-medium truncate">{category.name}</span>
                    </div>
                  </button>
                ))}
              </div>
              {errors.category && <p className="text-[var(--apple-danger)] text-sm mt-1">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Тип расхода</label>
              <select
                value={typeId}
                onChange={(e) => setTypeId(e.target.value)}
                className="apple-input"
              >
                {availableTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              {errors.type && <p className="text-[var(--apple-danger)] text-sm mt-1">{errors.type}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Сумма</label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className="apple-input pr-12"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--apple-muted)]">
                  {settings.currency}
                </span>
              </div>
              {errors.amount && <p className="text-[var(--apple-danger)] text-sm mt-1">{errors.amount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Дата</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="apple-input"
              />
              {errors.date && <p className="text-[var(--apple-danger)] text-sm mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Заметка</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Например, обед с коллегами"
                className="apple-input"
              />
            </div>

            <button type="submit" className="apple-btn apple-btn-primary w-full">
              <Save className="w-4 h-4" />
              {editingExpense ? 'Сохранить изменения' : 'Добавить расход'}
            </button>

            {success && (
              <div className="flex items-center justify-center gap-2 text-[var(--apple-success)] text-sm animate-fade-in-up">
                <Check className="w-4 h-4" /> Сохранено
              </div>
            )}
          </div>
        </form>

        <div className="glass-card p-6 animate-fade-in-up stagger-2">
          <h2 className="text-xl font-semibold mb-6">Предпросмотр</h2>
          <div className="flex flex-col items-center justify-center py-8">
            {selectedCategory && selectedType && amount ? (
              <div className="text-center">
                <CategoryIcon icon={selectedCategory.icon} color={selectedCategory.color} size="lg" />
                <p className="mt-4 text-lg font-medium">{selectedType.name}</p>
                <p className="text-sm text-[var(--apple-muted)]">{selectedCategory.name}</p>
                <p className="mt-4 text-4xl font-semibold tracking-tight text-[var(--apple-accent)]">
                  {formatAmount(Number(amount) || 0, settings.currency)}
                </p>
                <p className="mt-2 text-sm text-[var(--apple-muted)]">
                  {date ? formatDate(date) : 'Дата не выбрана'}
                </p>
                {note && (
                  <p className="mt-3 text-sm text-[var(--apple-muted)] max-w-xs">{note}</p>
                )}
              </div>
            ) : (
              <div className="text-center text-[var(--apple-muted)]">
                <p className="text-lg mb-2">Заполните форму</p>
                <p className="text-sm">Здесь появится предпросмотр карточки</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
