import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import Navigation from '@/components/Navigation';
import { Loader2, AlertCircle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { settings, isLoading, isSaving, error } = useAppStore();

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(settings.darkMode ? 'dark' : 'light');
  }, [settings.darkMode]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--apple-bg)] px-4">
        <Loader2 className="w-10 h-10 text-[var(--apple-accent)] animate-spin mb-4" />
        <p className="text-[var(--apple-muted)]">Загрузка данных...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <Navigation />
      <main className="flex-1 md:pl-64 pb-20 md:pb-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {error && (
            <div className="mb-6 glass-card p-4 border-[var(--apple-danger)]/30 bg-[var(--apple-danger)]/5 flex items-start gap-3 animate-fade-in-up">
              <AlertCircle className="w-5 h-5 text-[var(--apple-danger)] mt-0.5 shrink-0" />
              <p className="text-sm text-[var(--apple-danger)]">{error}</p>
            </div>
          )}
          {isSaving && (
            <div className="mb-6 flex items-center justify-end gap-2 text-sm text-[var(--apple-muted)] animate-fade-in-up">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Сохранение...</span>
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
