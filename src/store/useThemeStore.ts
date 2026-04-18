import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeStore {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (mode: 'light' | 'dark') => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      mode: 'dark',
      toggleTheme: () => set((state) => ({ mode: state.mode === 'light' ? 'dark' : 'light' })),
      setTheme: (mode) => set({ mode }),
    }),
    {
      name: 'theme-storage',
    }
  )
);
