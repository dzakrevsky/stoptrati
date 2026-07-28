import { useState, useMemo } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Tag,
  Layers,
  CircleDollarSign,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import CategoryIcon, { availableIcons } from '@/components/CategoryIcon';
import { cn } from '@/lib/utils';
import { formatAmount } from '@/utils/format';
import { PEOPLE } from '@/types';
import type { Person } from '@/types';

type Tab = 'categories' | 'types' | 'limits';

const predefinedColors = [
  '#30d158', '#2997ff', '#ff375f', '#af52de', '#ff9500',
  '#5ac8fa', '#8e8e93', '#ffcc00', '#5856d6', '#ff6b6b',
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState<Tab>('categories');
  const {
    categories,
    types,
    settings,
    addCategory,
    updateCategory,
    deleteCategory,
    addType,
    updateType,
    deleteType,
    hasExpensesForCategory,
  } = useAppStore();

  // Category form
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState(predefinedColors[0]);
  const [newCategoryIcon, setNewCategoryIcon] = useState(availableIcons[0]);
  const [newCategoryLimit, setNewCategoryLimit] = useState('10000');

  // Type form
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeCategory, setNewTypeCategory] = useState(categories[0]?.id || '');

  // Inline editing
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editCategoryLimit, setEditCategoryLimit] = useState('');
  const [editingType, setEditingType] = useState<string | null>(null);
  const [editTypeName, setEditTypeName] = useState('');

  const typesByCategory = useMemo(() => {
    return types.reduce((acc, type) => {
      if (!acc[type.categoryId]) acc[type.categoryId] = [];
      acc[type.categoryId].push(type);
      return acc;
    }, {} as Record<string, typeof types>);
  }, [types]);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    const budgetLimit = Number(newCategoryLimit) || 0;
    const defaultDaily = Math.max(100, Math.round(budgetLimit / 30 / PEOPLE.length));
    addCategory({
      name: newCategoryName.trim(),
      color: newCategoryColor,
      icon: newCategoryIcon,
      budgetLimit,
      dailyLimits: {
        'Даня': defaultDaily,
        'Лизун': defaultDaily,
      } as Record<Person, number>,
    });
    setNewCategoryName('');
    setNewCategoryLimit('10000');
  };

  const handleAddType = () => {
    if (!newTypeName.trim() || !newTypeCategory) return;
    addType({ name: newTypeName.trim(), categoryId: newTypeCategory });
    setNewTypeName('');
  };

  const startEditCategory = (id: string, name: string, limit: number) => {
    setEditingCategory(id);
    setEditCategoryName(name);
    setEditCategoryLimit(String(limit));
  };

  const saveEditCategory = (id: string) => {
    if (!editCategoryName.trim()) return;
    updateCategory(id, {
      name: editCategoryName.trim(),
      budgetLimit: Number(editCategoryLimit) || 0,
    });
    setEditingCategory(null);
  };

  const startEditType = (id: string, name: string) => {
    setEditingType(id);
    setEditTypeName(name);
  };

  const saveEditType = (id: string) => {
    if (!editTypeName.trim()) return;
    updateType(id, { name: editTypeName.trim() });
    setEditingType(null);
  };

  const tabs = [
    { id: 'categories' as Tab, label: 'Категории', icon: Tag },
    { id: 'types' as Tab, label: 'Типы трат', icon: Layers },
    { id: 'limits' as Tab, label: 'Лимиты', icon: CircleDollarSign },
  ];

  return (
    <div className="page-transition">
      <div className="mb-8">
        <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight mb-2">
          Админ-панель
        </h1>
        <p className="text-[var(--apple-muted)] text-lg">
          Управляйте категориями, типами и лимитами
        </p>
      </div>

      <div className="glass-card p-2 mb-6 inline-flex animate-fade-in-up stagger-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              activeTab === tab.id
                ? 'bg-[var(--apple-accent)] text-white'
                : 'text-[var(--apple-muted)] hover:text-[var(--apple-text)]'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'categories' && (
        <div className="space-y-6 animate-fade-in-up stagger-2">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4">Добавить категорию</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              <div className="lg:col-span-2">
                <label className="block text-sm text-[var(--apple-muted)] mb-1">Название</label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Например, Спорт"
                  className="apple-input"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--apple-muted)] mb-1">Лимит</label>
                <input
                  type="number"
                  value={newCategoryLimit}
                  onChange={(e) => setNewCategoryLimit(e.target.value)}
                  className="apple-input"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--apple-muted)] mb-1">Цвет</label>
                <div className="flex gap-2 flex-wrap">
                  {predefinedColors.slice(0, 6).map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewCategoryColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        newCategoryColor === color ? 'border-white scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <button onClick={handleAddCategory} className="apple-btn apple-btn-primary">
                <Plus className="w-4 h-4" /> Добавить
              </button>
            </div>
            <div className="mt-4">
              <label className="block text-sm text-[var(--apple-muted)] mb-2">Иконка</label>
              <div className="flex gap-2 flex-wrap">
                {availableIcons.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setNewCategoryIcon(icon)}
                    className={`p-2 rounded-lg border transition-all ${
                      newCategoryIcon === icon
                        ? 'border-[var(--apple-accent)] bg-[var(--apple-accent)]/10'
                        : 'border-[var(--apple-border)] hover:border-white/20'
                    }`}
                  >
                    <CategoryIcon icon={icon} color={newCategoryColor} size="sm" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4">Список категорий</h2>
            <div className="space-y-2">
              {categories.map((category) => {
                const isEditing = editingCategory === category.id;
                const hasExpenses = hasExpensesForCategory(category.id);

                return (
                  <div
                    key={category.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-[var(--apple-surface-2)]/50 border border-[var(--apple-border)]"
                  >
                    <CategoryIcon icon={category.icon} color={category.color} size="md" />
                    <div className="flex-1">
                      {isEditing ? (
                        <div className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={editCategoryName}
                            onChange={(e) => setEditCategoryName(e.target.value)}
                            className="apple-input w-48"
                          />
                          <input
                            type="number"
                            value={editCategoryLimit}
                            onChange={(e) => setEditCategoryLimit(e.target.value)}
                            className="apple-input w-32"
                          />
                        </div>
                      ) : (
                        <>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-sm text-[var(--apple-muted)]">
                            Лимит: {formatAmount(category.budgetLimit, settings.currency)}
                          </p>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => saveEditCategory(category.id)}
                            className="p-2 rounded-lg text-[var(--apple-success)] hover:bg-[var(--apple-success)]/10"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingCategory(null)}
                            className="p-2 rounded-lg text-[var(--apple-muted)] hover:bg-white/5"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditCategory(category.id, category.name, category.budgetLimit)}
                            className="p-2 rounded-lg text-[var(--apple-muted)] hover:text-[var(--apple-accent)] hover:bg-[var(--apple-accent)]/10"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteCategory(category.id)}
                            disabled={hasExpenses}
                            title={hasExpenses ? 'Нельзя удалить категорию с записями' : ''}
                            className="p-2 rounded-lg text-[var(--apple-muted)] hover:text-[var(--apple-danger)] hover:bg-[var(--apple-danger)]/10 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'types' && (
        <div className="space-y-6 animate-fade-in-up stagger-2">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4">Добавить тип расхода</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="md:col-span-2">
                <label className="block text-sm text-[var(--apple-muted)] mb-1">Название</label>
                <input
                  type="text"
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                  placeholder="Например, Кофе"
                  className="apple-input"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--apple-muted)] mb-1">Категория</label>
                <select
                  value={newTypeCategory}
                  onChange={(e) => setNewTypeCategory(e.target.value)}
                  className="apple-input"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <button onClick={handleAddType} className="apple-btn apple-btn-primary">
                <Plus className="w-4 h-4" /> Добавить
              </button>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4">Типы по категориям</h2>
            <div className="space-y-6">
              {categories.map((category) => (
                <div key={category.id}>
                  <div className="flex items-center gap-2 mb-3">
                    <CategoryIcon icon={category.icon} color={category.color} size="sm" />
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {(typesByCategory[category.id] || []).map((type) => {
                      const isEditing = editingType === type.id;
                      return (
                        <div
                          key={type.id}
                          className="flex items-center gap-2 p-3 rounded-xl bg-[var(--apple-surface-2)]/50 border border-[var(--apple-border)]"
                        >
                          {isEditing ? (
                            <input
                              type="text"
                              value={editTypeName}
                              onChange={(e) => setEditTypeName(e.target.value)}
                              className="apple-input flex-1 text-sm"
                            />
                          ) : (
                            <span className="flex-1 text-sm">{type.name}</span>
                          )}
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => saveEditType(type.id)}
                                className="p-1.5 rounded-lg text-[var(--apple-success)] hover:bg-[var(--apple-success)]/10"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setEditingType(null)}
                                className="p-1.5 rounded-lg text-[var(--apple-muted)] hover:bg-white/5"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => startEditType(type.id, type.name)}
                                className="p-1.5 rounded-lg text-[var(--apple-muted)] hover:text-[var(--apple-accent)]"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteType(type.id)}
                                className="p-1.5 rounded-lg text-[var(--apple-muted)] hover:text-[var(--apple-danger)]"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'limits' && (
        <div className="space-y-6 animate-fade-in-up stagger-2">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-6">Месячные лимиты по категориям</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="p-4 rounded-xl bg-[var(--apple-surface-2)]/50 border border-[var(--apple-border)] flex items-center gap-4"
                >
                  <CategoryIcon icon={category.icon} color={category.color} size="md" />
                  <div className="flex-1">
                    <p className="font-medium">{category.name}</p>
                    <p className="text-sm text-[var(--apple-muted)]">
                      Текущий лимит: {formatAmount(category.budgetLimit, settings.currency)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      defaultValue={category.budgetLimit}
                      onBlur={(e) =>
                        updateCategory(category.id, { budgetLimit: Number(e.target.value) || 0 })
                      }
                      className="apple-input w-28 text-right"
                    />
                    <span className="text-[var(--apple-muted)]">{settings.currency}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-2">Дневные лимиты по категориям и людям</h2>
            <p className="text-sm text-[var(--apple-muted)] mb-6">
              Укажите, сколько Даня и Лизун могут потратить в день в каждой категории
            </p>
            <div className="space-y-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="p-4 rounded-xl bg-[var(--apple-surface-2)]/50 border border-[var(--apple-border)]"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <CategoryIcon icon={category.icon} color={category.color} size="sm" />
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {PEOPLE.map((person) => (
                      <div key={person}>
                        <label className="block text-sm text-[var(--apple-muted)] mb-1">{person}</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={category.dailyLimits[person] ?? 0}
                            onChange={(e) =>
                              updateCategory(category.id, {
                                dailyLimits: {
                                  ...category.dailyLimits,
                                  [person]: Number(e.target.value) || 0,
                                },
                              })
                            }
                            className="apple-input text-right"
                          />
                          <span className="text-[var(--apple-muted)]">{settings.currency}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
