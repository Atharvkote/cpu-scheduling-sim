import { useSimulationStore } from '../store/useSimulationStore';
import { motion } from 'framer-motion';
import { Timer, Activity, TrendingUp, Cpu, Hash, Clock, CheckCircle2 } from 'lucide-react';
import { formatMetric } from '../utils/helpers';

interface MetricsDashboardProps {
  isSimulationPage?: boolean;
}

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({ isSimulationPage }) => {
  const { result, status, currentTick } = useSimulationStore();

  if (!result) return (
     <div className="py-12 flex flex-col items-center justify-center text-text-muted gap-4">
        <Activity className="opacity-10" size={48} />
        <p className="text-[10px] uppercase font-black tracking-widest">Waiting for Engine Result</p>
     </div>
  );

  const { metrics } = result;

  const currentMetrics = [
    {
      title: 'Avg Waiting',
      value: `${formatMetric(metrics.avgWaitingTime)}ms`,
      icon: <Timer size={18} />,
      color: 'text-primary'
    },
    {
      title: 'Avg Turnaround',
      value: `${formatMetric(metrics.avgTurnaroundTime)}ms`,
      icon: <Activity size={18} />,
      color: 'text-accent'
    },
    {
      title: 'Utilization',
      value: `${formatMetric(metrics.cpuUtilization)}%`,
      icon: <Cpu size={18} />,
      color: 'text-blue-400'
    },
    {
      title: 'Throughput',
      value: `${formatMetric(metrics.throughput)}`,
      icon: <TrendingUp size={18} />,
      color: 'text-purple-400'
    }
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
         <h4 className="font-black text-xs uppercase tracking-widest text-text-muted flex items-center gap-2">
            <Hash size={14} /> Result Analysis
         </h4>
         {status === 'completed' && (
           <div className="flex items-center gap-1.5 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
              <CheckCircle2 className="text-accent" size={12} />
              <span className="text-[10px] font-black text-accent uppercase">Finalized</span>
           </div>
         )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {currentMetrics.map((card, i) => (
          <div key={i} className="bg-card/40 p-5 rounded-2xl border border-white/5 group hover:border-primary/20 transition-all">
            <div className="flex items-center justify-between mb-4">
               <div className={`p-2 bg-white/5 rounded-xl border border-white/5 ${card.color}`}>
                  {card.icon}
               </div>
               <span className="text-[8px] font-black text-text-muted uppercase tracking-[0.2em]">{card.title}</span>
            </div>
            <div className="flex items-baseline gap-1">
               <span className="text-2xl font-black text-text-primary font-mono tracking-tighter">
                  {card.value.split('ms')[0].split('%')[0]}
               </span>
               <span className="text-[10px] text-text-muted font-bold uppercase">
                  {card.value.includes('ms') ? 'ms' : card.value.includes('%') ? '%' : 'p/s'}
               </span>
            </div>
          </div>
        ))}
      </div>

      {!isSimulationPage && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/5 shadow-2xl">
          <table className="w-full text-left bg-card/10">
            <thead>
                <tr className="bg-white/5 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
                    <th className="py-4 px-6">Process</th>
                    <th className="py-4 px-6">Wait</th>
                    <th className="py-4 px-6">Turnaround</th>
                </tr>
            </thead>
            <tbody>
                {metrics.processMetrics.map((pm, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6 text-xs font-black text-text-primary uppercase tracking-tighter">{pm.processName}</td>
                        <td className="py-4 px-6 font-mono text-xs text-text-muted">{pm.waitingTime}ms</td>
                        <td className="py-4 px-6 font-mono text-xs text-text-muted">{pm.turnaroundTime}ms</td>
                    </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {isSimulationPage && (
        <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
           <div className="flex items-center gap-3 mb-4">
              <Clock className="text-text-muted" size={14} />
              <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Real-time Cycle Delta</span>
           </div>
           <div className="space-y-3">
              {metrics.processMetrics.slice(0, 4).map((pm, i) => {
                 const isFinished = pm.completionTime <= currentTick;
                 const isRunning = result.timeline.find(t => t.startTime <= currentTick && t.endTime > currentTick && t.processId === pm.processId);
                 
                 return (
                   <div key={i} className="flex items-center justify-between group">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-primary animate-pulse' : isFinished ? 'bg-accent' : 'bg-white/10'}`} />
                        <span className="text-[10px] font-bold text-text-muted tracking-tight">{pm.processName}</span>
                      </div>
                      <div className="h-1 flex-1 mx-4 bg-white/5 rounded-full overflow-hidden">
                         <motion.div 
                           className={`h-full ${isFinished ? 'bg-accent' : 'bg-primary'}`}
                           initial={{ width: 0 }}
                           animate={{ width: isFinished ? '100%' : isRunning ? '50%' : '0%' }}
                         />
                      </div>
                      <span className="text-[10px] font-mono text-text-muted">{isFinished ? 'DONE' : isRunning ? 'BUSY' : 'WAIT'}</span>
                   </div>
                 );
              })}
           </div>
        </div>
      )}
    </div>
  );
};
