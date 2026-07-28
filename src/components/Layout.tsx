import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import Navigation from '@/components/Navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { settings } = useAppStore();

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(settings.darkMode ? 'dark' : 'light');
  }, [settings.darkMode]);

  return (
    <div className="min-h-screen flex">
      <Navigation />
      <main className="flex-1 md:pl-64 pb-20 md:pb-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
