import { useState } from 'react';
import { Moon, Sun, Coins, Trash2, AlertTriangle, Gauge } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import type { CurrencyCode } from '@/types';

const currencies: { code: CurrencyCode; label: string }[] = [
  { code: '₽', label: 'Российский рубль' },
  { code: '$', label: 'Доллар США' },
  { code: '€', label: 'Евро' },
  { code: '₸', label: 'Казахстанский тенге' },
];

export default function Settings() {
  const { settings, updateSettings, resetAll } = useAppStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    resetAll();
    setShowResetConfirm(false);
  };

  return (
    <div className="page-transition">
      <div className="mb-8">
        <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight mb-2">
          Настройки
        </h1>
        <p className="text-[var(--apple-muted)] text-lg">
          Персонализация приложения
        </p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <div className="glass-card p-6 animate-fade-in-up stagger-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--apple-accent)]/10 flex items-center justify-center">
                {settings.darkMode ? (
                  <Moon className="w-5 h-5 text-[var(--apple-accent)]" />
                ) : (
                  <Sun className="w-5 h-5 text-[var(--apple-accent)]" />
                )}
              </div>
              <div>
                <h2 className="font-semibold">Тёмная тема</h2>
                <p className="text-sm text-[var(--apple-muted)]">
                  Переключить внешний вид приложения
                </p>
              </div>
            </div>
            <button
              onClick={() => updateSettings({ darkMode: !settings.darkMode })}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                settings.darkMode ? 'bg-[var(--apple-accent)]' : 'bg-[var(--apple-surface-2)]'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white transition-transform ${
                  settings.darkMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="glass-card p-6 animate-fade-in-up stagger-2">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--apple-success)]/10 flex items-center justify-center">
              <Coins className="w-5 h-5 text-[var(--apple-success)]" />
            </div>
            <div>
              <h2 className="font-semibold">Валюта</h2>
              <p className="text-sm text-[var(--apple-muted)]">
                Выберите валюту для отображения сумм
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {currencies.map((currency) => (
              <button
                key={currency.code}
                onClick={() => updateSettings({ currency: currency.code })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  settings.currency === currency.code
                    ? 'border-[var(--apple-success)] bg-[var(--apple-success)]/10'
                    : 'border-[var(--apple-border)] bg-[var(--apple-surface-2)] hover:border-white/20'
                }`}
              >
                <span className="text-lg font-semibold">{currency.code}</span>
                <p className="text-xs text-[var(--apple-muted)] mt-1">{currency.label}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 animate-fade-in-up stagger-3">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--apple-warning)]/10 flex items-center justify-center">
              <Gauge className="w-5 h-5 text-[var(--apple-warning)]" />
            </div>
            <div>
              <h2 className="font-semibold">Месячный лимит</h2>
              <p className="text-sm text-[var(--apple-muted)]">
                Общий месячный лимит расходов
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 max-w-xs">
            <input
              type="number"
              value={settings.monthlyLimit}
              onChange={(e) => updateSettings({ monthlyLimit: Number(e.target.value) || 0 })}
              className="apple-input"
            />
            <span className="text-[var(--apple-muted)]">{settings.currency}</span>
          </div>
          <p className="mt-3 text-sm text-[var(--apple-muted)]">
            Дневные лимиты настраиваются в админ-панели отдельно для каждой категории и каждого человека.
          </p>
        </div>

        <div className="glass-card p-6 animate-fade-in-up stagger-4 border-[var(--apple-danger)]/30">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--apple-danger)]/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-[var(--apple-danger)]" />
            </div>
            <div>
              <h2 className="font-semibold text-[var(--apple-danger)]">Опасная зона</h2>
              <p className="text-sm text-[var(--apple-muted)]">
                Удаление всех данных без возможности восстановления
              </p>
            </div>
          </div>

          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="apple-btn apple-btn-danger"
            >
              <Trash2 className="w-4 h-4" /> Очистить все данные
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-[var(--apple-muted)]">
                Вы уверены? Это действие удалит все траты, категории и настройки.
              </p>
              <div className="flex gap-3">
                <button onClick={handleReset} className="apple-btn apple-btn-danger">
                  Да, очистить
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="apple-btn apple-btn-secondary"
                >
                  Отмена
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
