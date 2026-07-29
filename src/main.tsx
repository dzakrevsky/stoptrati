import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { useAppStore } from './store/useAppStore';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (supabaseUrl && supabaseKey) {
  useAppStore.getState().loadFromServer();
} else {
  useAppStore.setState({
    isLoading: false,
    error: 'Не настроены переменные окружения Supabase (VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY). Данные сохраняются локально.',
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
