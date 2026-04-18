import { create } from 'zustand';
import type { AlgorithmType, AlgorithmResult, SimulationConfig } from '../types';
import { runFCFS } from '../algorithms/fcfs';
import { runSJF } from '../algorithms/sjf';
import { runPriority } from '../algorithms/priority';
import { runRoundRobin } from '../algorithms/roundRobin';

interface SimulationStore {
  selectedAlgorithmId: AlgorithmType;
  config: SimulationConfig;
  result: AlgorithmResult | null;
  
  // Execution state
  status: 'idle' | 'running' | 'paused' | 'completed';
  currentTick: number;
  speed: number; // 1 to 10 scale
  isStudyMode: boolean;
  executionMode: 'auto' | 'step';
  
  // Actions
  setSelectedAlgorithm: (algo: AlgorithmType) => void;
  setConfig: (updates: Partial<SimulationConfig>) => void;
  setResult: (result: AlgorithmResult | null) => void;
  setStatus: (status: SimulationStore['status']) => void;
  setSpeed: (speed: number) => void;
  setStudyMode: (isStudyMode: boolean) => void;
  setExecutionMode: (mode: 'auto' | 'step') => void;
  tick: () => void;
  reset: () => void;
  calculate: (processes: any[]) => void;
}

export const useSimulationStore = create<SimulationStore>((set, get) => ({
  selectedAlgorithmId: 'fcfs',
  config: {
    timeQuantum: 2,
    isPreemptive: false,
  },
  result: null,
  status: 'idle',
  currentTick: 0,
  speed: 5,
  isStudyMode: false,
  executionMode: 'auto',

  setSelectedAlgorithm: (algo) => set({ selectedAlgorithmId: algo }),
  setConfig: (updates) => set((state) => ({ config: { ...state.config, ...updates } })),
  setResult: (result) => set({ result }),
  setStatus: (status) => set({ status }),
  setSpeed: (speed) => set({ speed }),
  setStudyMode: (isStudyMode) => set({ isStudyMode }),
  setExecutionMode: (mode) => set({ executionMode: mode }),

  calculate: (processes) => {
    const { selectedAlgorithmId, config } = get();
    if (processes.length === 0) {
      set({ result: null });
      return;
    }

    let result: AlgorithmResult;
    switch (selectedAlgorithmId) {
      case 'fcfs': result = runFCFS(processes); break;
      case 'sjf': result = runSJF(processes, config); break;
      case 'priority': result = runPriority(processes, config); break;
      case 'round-robin': result = runRoundRobin(processes, config); break;
      default: result = runFCFS(processes);
    }
    set({ result, status: 'idle', currentTick: 0 });
  },

  tick: () => set((state) => {
    if (!state.result) return state;
    const maxTick = state.result.timeline.length > 0 
      ? state.result.timeline[state.result.timeline.length - 1].endTime 
      : 0;
    
    if (state.currentTick >= maxTick) {
      return { ...state, status: 'completed' };
    }
    return { ...state, currentTick: state.currentTick + 1 };
  }),

  reset: () => set({
    status: 'idle',
    currentTick: 0,
  }),
}));
