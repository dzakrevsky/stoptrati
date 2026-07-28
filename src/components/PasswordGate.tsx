import { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

const CORRECT_PASSWORD = 'oleg';
const COOKIE_NAME = 'expense_tracker_auth';
const COOKIE_VALUE = 'oleg_authorized';

const setAuthCookie = () => {
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  document.cookie = `${COOKIE_NAME}=${COOKIE_VALUE}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
};

const hasAuthCookie = () => {
  return document.cookie.split('; ').some((cookie) => cookie === `${COOKIE_NAME}=${COOKIE_VALUE}`);
};

interface PasswordGateProps {
  children: React.ReactNode;
}

export default function PasswordGate({ children }: PasswordGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (hasAuthCookie()) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.trim() === CORRECT_PASSWORD) {
      setAuthCookie();
      setIsAuthenticated(true);
      setPassword('');
    } else {
      setError('Неверный пароль');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--apple-bg)]">
        <div className="w-8 h-8 border-2 border-[var(--apple-accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--apple-bg)] px-4">
      <div className="w-full max-w-md glass-card p-8 animate-fade-in-up">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[var(--apple-accent)]/10 flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-[var(--apple-accent)]" />
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-center">
            Доступ ограничен
          </h1>
          <p className="text-[var(--apple-muted)] text-center mt-2">
            Введите пароль, чтобы открыть трекер расходов
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
              autoFocus
              className="apple-input pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--apple-muted)] hover:text-[var(--apple-text)] transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {error && (
            <p className="text-[var(--apple-danger)] text-sm text-center animate-fade-in-up">
              {error}
            </p>
          )}

          <button type="submit" className="apple-btn apple-btn-primary w-full">
            <Lock className="w-4 h-4" />
            Войти
          </button>
        </form>

        <p className="text-xs text-[var(--apple-muted)] text-center mt-6">
          Авторизация сохраняется в cookie на 1 год
        </p>
      </div>
    </div>
  );
}
