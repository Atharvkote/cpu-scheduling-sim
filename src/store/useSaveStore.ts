import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SavedSimulation } from '../types';

interface SaveStore {
  history: SavedSimulation[];
  saveSimulation: (simulation: SavedSimulation) => void;
  removeSimulation: (id: string) => void;
  clearHistory: () => void;
}

export const useSaveStore = create<SaveStore>()(
  persist(
    (set) => ({
      history: [],
      saveSimulation: (sim) => set((state) => ({
        history: [sim, ...state.history].slice(0, 10), // Keep last 10
      })),
      removeSimulation: (id) => set((state) => ({
        history: state.history.filter((s) => s.id !== id),
      })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'simulation-history',
    }
  )
);
