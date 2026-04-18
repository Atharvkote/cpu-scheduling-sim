import React from 'react';
import { useSimulationStore } from '../store/useSimulationStore';
import { ALGORITHMS } from '../constants/algorithms';
import { LayoutGrid, RotateCcw, Download, Moon } from 'lucide-react';
import { exportToCSV } from '../utils/helpers';

export const AlgorithmSelector: React.FC = () => {
  const { selectedAlgorithmId, setSelectedAlgorithm, reset, result } = useSimulationStore();

  const handleExport = () => {
    if (!result) return;
    const headers = ['Process ID', 'Name', 'Arrival Time', 'Burst Time', 'Completion Time', 'Turnaround Time', 'Waiting Time', 'Response Time'];
    const rows = result.metrics.processMetrics.map(pm => [
      pm.processId, pm.processName, pm.arrivalTime, pm.burstTime, pm.completionTime, pm.turnaroundTime, pm.waitingTime, pm.responseTime
    ]);
    exportToCSV(headers, rows, `cpu-scheduling-${selectedAlgorithmId}.csv`);
  };

  return (
    <div className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-white/10 px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2 mr-8">
        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
          <LayoutGrid className="text-primary" size={20} />
        </div>
        <div>
          <h1 className="text-lg font-bold leading-none">CPU Scheduler</h1>
          <span className="text-[10px] uppercase tracking-widest text-text-muted">Simulator Pro v1.0</span>
        </div>
      </div>

      <nav className="flex bg-card/50 p-1 rounded-xl border border-white/5">
        {ALGORITHMS.map((algo) => (
          <button
            key={algo.id}
            onClick={() => setSelectedAlgorithm(algo.id)}
            className={`
              px-5 py-2.5 rounded-lg flex flex-col items-center gap-0.5 transition-all
              ${selectedAlgorithmId === algo.id 
                ? 'bg-primary text-white shadow-lg shadow-primary/20 border border-primary/50' 
                : 'text-text-muted hover:text-text-primary hover:bg-white/5'}
            `}
          >
            <span className="text-sm font-semibold">{algo.shortName}</span>
            <span className={`text-[10px] px-1.5 rounded-full uppercase border ${
              selectedAlgorithmId === algo.id ? 'bg-white/20 border-transparent text-white' : 'bg-white/5 border-white/10 text-text-muted'
            }`}>
              {algo.isPreemptive || algo.canBePreemptive ? 'Preemptive' : 'Non-Pre'}
            </span>
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <button 
          onClick={() => reset()}
          className="p-2.5 rounded-xl bg-card border border-white/5 text-text-muted hover:text-primary hover:border-primary/30 transition-all group"
          title="Reset Simulation"
        >
          <RotateCcw size={18} className="group-hover:rotate-[-45deg] transition-transform" />
        </button>
        <button className="p-2.5 rounded-xl bg-card border border-white/5 text-text-muted hover:text-primary hover:border-primary/30 transition-all">
          <Moon size={18} />
        </button>
        <button 
          onClick={handleExport}
          className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg shadow-primary/20 border border-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!result}
        >
          <Download size={18} />
          <span>Export CSV</span>
        </button>
      </div>
    </div>
  );
};
