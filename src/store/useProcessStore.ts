import { create } from 'zustand';
import type { Process } from '../types';
import { createDefaultProcesses, generateId, getProcessColor } from '../utils/helpers';

interface ProcessStore {
  processes: Process[];
  setProcesses: (processes: Process[]) => void;
  addProcess: () => void;
  removeProcess: (id: string) => void;
  updateProcess: (id: string, updates: Partial<Process>) => void;
  resetProcesses: () => void;
}

export const useProcessStore = create<ProcessStore>((set) => ({
  processes: createDefaultProcesses(),
  
  setProcesses: (processes) => set({ processes }),
  
  addProcess: () => set((state) => {
    const nextNum = state.processes.length + 1;
    const newProcess: Process = {
      id: generateId(),
      name: `P${nextNum}`,
      arrivalTime: 0,
      burstTime: 5,
      priority: 1,
      color: getProcessColor(state.processes.length),
    };
    return { processes: [...state.processes, newProcess] };
  }),
  
  removeProcess: (id) => set((state) => ({
    processes: state.processes.filter((p) => p.id !== id),
  })),
  
  updateProcess: (id, updates) => set((state) => ({
    processes: state.processes.map((p) => (p.id === id ? { ...p, ...updates } : p)),
  })),
  
  resetProcesses: () => set({ processes: createDefaultProcesses() }),
}));
