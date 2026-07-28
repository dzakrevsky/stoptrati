import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  History,
  PlusCircle,
  Shield,
  Settings,
  Wallet,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: 'Дашборд', icon: LayoutDashboard },
  { path: '/history', label: 'История', icon: History },
  { path: '/add', label: 'Добавить', icon: PlusCircle },
  { path: '/admin', label: 'Админ', icon: Shield },
  { path: '/settings', label: 'Настройки', icon: Settings },
];

export default function Navigation() {
  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 h-screen w-64 flex-col border-r border-[var(--apple-border)] bg-[var(--apple-surface)]/50 backdrop-blur-xl z-50">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--apple-accent)] flex items-center justify-center shadow-lg shadow-[var(--apple-accent)]/20">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Expense</h1>
              <p className="text-xs text-[var(--apple-muted)]">Трекер расходов</p>
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-[var(--apple-accent)]/10 text-[var(--apple-accent)]'
                    : 'text-[var(--apple-muted)] hover:text-[var(--apple-text)] hover:bg-white/5'
                )
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="p-6 text-xs text-[var(--apple-muted)]">
          © 2026 Expense Tracker
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[var(--apple-surface)]/80 backdrop-blur-xl border-t border-[var(--apple-border)] z-50">
        <div className="flex items-center justify-around h-full px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200',
                  isActive
                    ? 'text-[var(--apple-accent)]'
                    : 'text-[var(--apple-muted)]'
                )
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px]">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
