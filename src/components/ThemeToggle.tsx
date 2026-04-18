import React, { useEffect } from 'react';
import { useThemeStore } from '../store/useThemeStore';
import { Moon, Sun } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const { mode, toggleTheme } = useThemeStore();

  useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  return (
    <button
      onClick={toggleTheme}
      className="p-3 bg-card/60 backdrop-blur-md border border-white/10 rounded-2xl text-text-muted hover:text-primary transition-all flex items-center justify-center shadow-lg"
      aria-label="Toggle Theme"
    >
      {mode === 'dark' ? (
        <Sun size={20} className="hover:rotate-45 transition-transform" />
      ) : (
        <Moon size={20} className="hover:-rotate-12 transition-transform" />
      )}
    </button>
  );
};
