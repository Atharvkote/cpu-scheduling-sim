import React from 'react';
import { useSimulationStore } from '../store/useSimulationStore';
import { ALGORITHMS } from '../constants/algorithms';
import { Settings, Clock, ShieldCheck, Zap } from 'lucide-react';

export const AlgorithmConfig: React.FC = () => {
  const { selectedAlgorithmId, config, setConfig } = useSimulationStore();
  const algo = ALGORITHMS.find(a => a.id === selectedAlgorithmId);

  if (!algo) return null;

  const showQuantum = selectedAlgorithmId === 'round-robin';
  const showPreemptive = algo.canBePreemptive;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h4 className="flex items-center gap-2 font-black uppercase text-xs tracking-widest text-text-muted">
           <Settings size={16} className="text-primary" />
           Configuration
        </h4>
      </div>

      <div className="space-y-6">
        {showQuantum && (
          <div className="space-y-4">
             <div className="flex justify-between items-center px-1">
                <label className="text-[10px] uppercase font-black text-text-muted tracking-widest flex items-center gap-2">
                   <Clock size={12} className="text-primary" />
                   Time Quantum
                </label>
                <span className="text-xs font-black font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-lg border border-primary/20">
                   {config.timeQuantum}ms
                </span>
             </div>
             <input 
               type="range" 
               min="1" 
               max="10" 
               step="1"
               value={config.timeQuantum}
               onChange={(e) => setConfig({ timeQuantum: parseInt(e.target.value) })}
               className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-primary"
             />
             <div className="flex justify-between text-[8px] text-text-muted font-black uppercase tracking-tighter">
                <span>1ms (High Context Switch)</span>
                <span>10ms (Low Context Switch)</span>
             </div>
          </div>
        )}

        {showPreemptive && (
          <div className="space-y-3">
             <label className="text-[10px] uppercase font-black text-text-muted tracking-widest flex items-center gap-2 px-1">
                <ShieldCheck size={12} className="text-accent" />
                Interruption Logic
             </label>
             <button 
               onClick={() => setConfig({ isPreemptive: !config.isPreemptive })}
               className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all group ${
                 config.isPreemptive 
                   ? 'bg-accent/10 border-accent/20' 
                   : 'bg-white/5 border-white/5 hover:border-white/10'
               }`}
             >
                <div className="flex items-center gap-3">
                   <div className={`p-2 rounded-xl transition-colors ${config.isPreemptive ? 'bg-accent/20 text-accent' : 'bg-white/10 text-text-muted'}`}>
                      <ShieldCheck size={18} />
                   </div>
                   <div className="text-left">
                      <p className="text-xs font-black text-text-primary uppercase tracking-tight">Preemptive Mode</p>
                      <p className="text-[9px] text-text-muted font-bold uppercase">Dynamic CPU Reclaim</p>
                   </div>
                </div>
                <div className={`w-10 h-6 rounded-full p-1 transition-all ${config.isPreemptive ? 'bg-accent' : 'bg-white/10'}`}>
                   <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-all transform ${config.isPreemptive ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
             </button>
             <p className="text-[9px] text-text-muted text-center px-4 italic leading-relaxed">
               Allowing preemption may reduce average turnaround time but increases context switching overhead.
             </p>
          </div>
        )}

        {!showQuantum && !showPreemptive && (
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center gap-4 text-center">
             <div className="p-3 bg-white/5 rounded-xl">
                <Zap size={20} className="text-text-muted opacity-30" />
             </div>
             <div className="space-y-1">
                <p className="text-xs font-black text-text-primary uppercase tracking-widest">Static Algorithm</p>
                <p className="text-[10px] text-text-muted font-bold uppercase leading-relaxed">
                   This algorithm operates on fixed non-preemptive logic. No additional parameters required.
                </p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
