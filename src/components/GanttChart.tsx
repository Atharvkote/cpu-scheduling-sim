import React, { useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulationStore } from '../store/useSimulationStore';
import { Zap, Clock, MousePointer2 } from 'lucide-react';

interface GanttChartProps {
  isSimulationPage?: boolean;
}

export const GanttChart: React.FC<GanttChartProps> = ({ isSimulationPage }) => {
  const { result, currentTick, status } = useSimulationStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const timeline = useMemo(() => {
    if (!result) return [];
    if (!isSimulationPage) return result.timeline;
    // On simulation page, show segments up to current time
    return result.timeline.map(segment => {
      if (segment.startTime >= currentTick) return null;
      const visibleEndTime = Math.min(segment.endTime, currentTick);
      return { ...segment, endTime: visibleEndTime };
    }).filter(Boolean) as typeof result.timeline;
  }, [result, currentTick, isSimulationPage]);

  const totalDuration = result?.timeline.length 
    ? result.timeline[result.timeline.length - 1].endTime 
    : 0;

  // Auto-scroll logic
  useEffect(() => {
    if (status === 'running' && scrollContainerRef.current) {
      const scrollPos = (currentTick * 40) - 200;
      scrollContainerRef.current.scrollTo({
        left: Math.max(0, scrollPos),
        behavior: 'smooth'
      });
    }
  }, [currentTick, status]);

  if (!result || result.timeline.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-text-muted bg-card/10 rounded-2xl border border-dashed border-white/5">
        <div className="p-4 bg-white/5 rounded-full mb-4">
           <Zap size={24} className="opacity-20" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em]">Kernel Idle • Awaiting Submission</p>
      </div>
    );
  }

  const BLOCK_WIDTH = 40;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-primary/20 rounded-lg">
              <Clock size={16} className="text-primary" />
           </div>
           <div>
              <h4 className="font-black text-xs uppercase tracking-widest text-text-primary">Execution Timeline</h4>
              <p className="text-[10px] text-text-muted uppercase font-bold tracking-tighter">Current Step: {currentTick}ms / {totalDuration}ms</p>
           </div>
        </div>
        
        <div className="flex gap-4">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-[9px] font-bold text-text-muted uppercase">Running</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-800" />
              <span className="text-[9px] font-bold text-text-muted uppercase">Idle</span>
           </div>
        </div>
      </div>

      <div 
        ref={scrollContainerRef}
        className="relative py-12 px-8 bg-card/[0.03] rounded-3xl border border-white/5 overflow-x-auto custom-scrollbar group/timeline select-none"
      >
        {/* Progress Vertical Line */}
        {isSimulationPage && (
          <motion.div 
            className="absolute top-0 bottom-0 z-20 w-px bg-primary flex flex-col items-center"
            style={{ left: `${32 + currentTick * BLOCK_WIDTH}px` }}
            animate={{ left: 32 + currentTick * BLOCK_WIDTH }}
            transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
          >
             <div className="w-3 h-3 bg-primary rounded-full -mt-1.5 shadow-lg shadow-primary/50" />
             <div className="flex-1 w-px bg-gradient-to-b from-primary via-primary/50 to-transparent" />
          </motion.div>
        )}

        {/* Timeline Grid Markers */}
        <div className="flex justify-start min-w-max pb-4 border-b border-white/5">
          {Array.from({ length: totalDuration + 1 }).map((_, i) => (
            <div key={i} className="relative flex flex-col items-center" style={{ width: `${BLOCK_WIDTH}px` }}>
              <div className={`h-2 w-px ${i % 5 === 0 ? 'bg-white/20 h-4' : 'bg-white/5'}`} />
              <span className={`absolute top-6 text-[8px] font-mono ${i === currentTick ? 'text-primary' : 'text-text-muted'}`}>
                {i}
              </span>
            </div>
          ))}
        </div>

        {/* Chart Blocks */}
        <div className="relative h-24 mt-8 flex" style={{ width: `${totalDuration * BLOCK_WIDTH}px` }}>
          <AnimatePresence mode="popLayout">
            {timeline.map((segment, index) => (
              <motion.div
                key={`${segment.processId}-${segment.startTime}-${index}`}
                initial={{ opacity: 0, scaleY: 0.5, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scaleY: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute flex flex-col items-center justify-center rounded-xl border border-white/10 group cursor-pointer overflow-hidden transition-all hover:z-30"
                style={{
                  left: `${segment.startTime * BLOCK_WIDTH}px`,
                  width: `${(segment.endTime - segment.startTime) * BLOCK_WIDTH}px`,
                  height: '64px',
                  backgroundColor: segment.color,
                  boxShadow: segment.processId ? `0 10px 30px -10px ${segment.color}88` : 'none',
                }}
              >
                {/* Visual texture */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                
                <span className="relative z-10 font-black text-xs text-white drop-shadow-lg scale-90 group-hover:scale-110 transition-transform">
                  {segment.processName}
                </span>

                {/* Micro Tooltip on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity backdrop-blur-sm">
                   <span className="text-[8px] font-black text-white/60 mb-1 uppercase tracking-widest">{segment.processName} Detail</span>
                   <span className="text-[10px] font-black text-white">{segment.startTime} - {segment.endTime}ms</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Simulation Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="flex gap-4 p-5 rounded-2xl bg-primary/5 border border-primary/10 items-center">
            <div className="p-3 bg-primary/10 rounded-xl">
               <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}>
                  <Zap size={18} className="text-primary" />
               </motion.div>
            </div>
            <div>
               <p className="text-[10px] font-black text-text-primary uppercase tracking-[0.2em]">Cycle Analysis</p>
               <p className="text-xs text-text-muted">Total execution time span spans <span className="text-primary font-bold">{totalDuration}ms</span> across the virtual CPU registry.</p>
            </div>
         </div>

         <div className="flex gap-4 p-5 rounded-2xl bg-card border border-white/5 items-center group hover:border-primary/30 transition-all">
            <div className="p-3 bg-white/5 rounded-xl group-hover:bg-primary/10 transition-colors">
               <MousePointer2 size={18} className="text-text-muted group-hover:text-primary transition-colors" />
            </div>
            <div className="flex-1">
               <p className="text-[10px] font-black text-text-primary uppercase tracking-[0.2em]">Interactive Navigation</p>
               <p className="text-xs text-text-muted">Hover over individual blocks to inspect precise cycle timings and thread state.</p>
            </div>
         </div>
      </div>
    </div>
  );
};
