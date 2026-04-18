import React from 'react';
import { Link } from 'react-router-dom';
import { ALGORITHMS } from '../constants/algorithms';
import { Card } from './ui/Card';
import { useSimulationStore } from '../store/useSimulationStore';
import { ArrowUpRight, Zap, Info, ExternalLink } from 'lucide-react';

export const AlgorithmGrid: React.FC = () => {
  const { selectedAlgorithmId, setSelectedAlgorithm } = useSimulationStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-8 py-8">
      {ALGORITHMS.map((algo) => (
        <div key={algo.id} className="relative group">
          <button
            onClick={() => setSelectedAlgorithm(algo.id)}
            className="text-left w-full h-full"
          >
            <Card className={`
              h-full interactive-glow relative overflow-hidden transition-all duration-500
              ${selectedAlgorithmId === algo.id ? 'border-primary ring-1 ring-primary/20 bg-primary/5' : 'bg-card/40 hover:bg-card/60'}
            `}>
              {selectedAlgorithmId === algo.id && (
                <div className="absolute top-4 right-4 text-primary">
                  <Zap size={16} fill="currentColor" />
                </div>
              )}
              
              <div className="flex items-start justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {algo.complexity}
                </span>
                <Link 
                  to={`/algorithm/${algo.id}`}
                  className="p-1.5 rounded-lg bg-white/5 text-text-muted hover:text-primary hover:bg-primary/10 transition-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={14} />
                </Link>
              </div>

              <h4 className="font-bold text-text-primary mb-2 flex items-center gap-2 group-hover:text-primary transition-colors">
                {algo.name}
              </h4>
              
              <p className="text-sm text-text-muted line-clamp-2 leading-relaxed h-10">
                {algo.description}
              </p>

              <div className="mt-6 pt-6 border-t border-white/5 flex gap-2">
                 {algo.isPreemptive || algo.canBePreemptive ? (
                   <span className="bg-accent/10 text-accent text-[10px] px-2 py-1 rounded">PREEMPTIVE</span>
                 ) : (
                   <span className="bg-text-muted/10 text-text-muted text-[10px] px-2 py-1 rounded">NON-PREEMPTIVE</span>
                 )}
                 <span className="bg-primary/10 text-primary text-[10px] px-2 py-1 rounded uppercase">{algo.complexity}</span>
              </div>
            </Card>
          </button>
        </div>
      ))}
    </div>
  );
};

