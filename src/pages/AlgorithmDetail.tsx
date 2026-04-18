import React, { useEffect, useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ALGORITHMS } from '../constants/algorithms';
import { useSimulationStore } from '../store/useSimulationStore';
import { Card } from '../components/ui/Card';
import { ProcessTable } from '../components/ProcessTable';
import { AlgorithmConfig } from '../components/AlgorithmConfig';
import { GanttChart } from '../components/GanttChart';
import { MetricsDashboard } from '../components/MetricsDashboard';
import { motion } from 'framer-motion';
import {
   ArrowLeft,
   CheckCircle2,
   XCircle,
   Lightbulb,
   Terminal,
   BookOpen,
   Cpu
} from 'lucide-react';

const AlgorithmDetail: React.FC = () => {
   const { id } = useParams<{ id: string }>();
   const { setSelectedAlgorithm, runSimulation } = useSimulationStore();

   const algo = useMemo(() => ALGORITHMS.find(a => a.id === id), [id]);

   useEffect(() => {
      if (algo) {
         setSelectedAlgorithm(algo.id);
         runSimulation();
      }
   }, [algo, setSelectedAlgorithm, runSimulation]);

   if (!algo) return <Navigate to="/" />;

   return (
      <div className="min-h-screen bg-background text-text-primary selection:bg-primary/30 pb-20">
         {/* Navbar Minimal */}
         <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/10 px-8 py-4 flex items-center gap-6">
            <Link to="/" className="p-2 overflow-hidden rounded-xl border border-white/5 hover:border-primary/50 text-text-muted hover:text-primary transition-all">
               <ArrowLeft size={20} />
            </Link>
            <div>
               <h1 className="text-lg font-bold leading-none">{algo.name}</h1>
               <span className="text-[10px] uppercase tracking-widest text-text-muted">Algorithm Deep Dive</span>
            </div>
         </nav>

         <main className="max-w-6xl mx-auto px-8 pt-12 space-y-16">
            {/* Hero Section */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
               <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
               >
                  <div className="flex gap-2 mb-6">
                     <span className="bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full border border-primary/20 uppercase">
                        {algo.complexity}
                     </span>
                     <span className={`text-[10px] font-bold px-3 py-1 rounded-full border uppercase ${algo.isPreemptive || algo.canBePreemptive ? 'bg-accent/10 text-accent border-accent/20' : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                        {algo.isPreemptive || algo.canBePreemptive ? 'Preemptive' : 'Non-Preemptive'}
                     </span>
                  </div>
                  <h2 className="text-5xl font-black mb-6 tracking-tight leading-tight">
                     Mastering <span className="text-primary">{algo.shortName}</span>
                  </h2>
                  <p className="text-xl text-text-muted leading-relaxed max-w-lg">
                     {algo.detailedDescription}
                  </p>
               </motion.div>

               <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative"
               >
                  <div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-full opacity-50" />
                  <Card className="relative z-10 p-2 overflow-hidden aspect-video flex items-center justify-center bg-gradient-to-br from-card to-background border-primary/20">
                     <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center border border-primary/30">
                           <Cpu size={40} className="text-primary animate-pulse" />
                        </div>
                        <p className="text-xs font-mono text-text-muted">Interactive Sandbox Loaded</p>
                     </div>
                  </Card>
               </motion.div>
            </section>

            {/* Breakdown Section */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <Card className="md:col-span-2" title="How it Works" subtitle="Step-by-step logic breakdown">
                  <div className="space-y-6 mt-6">
                     {algo.steps.map((step, i) => (
                        <div key={i} className="flex gap-4 items-start group">
                           <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-primary/50 group-hover:text-primary transition-all">
                              <span className="text-xs font-bold font-mono">{i + 1}</span>
                           </div>
                           <p className="text-text-muted leading-relaxed pt-1 group-hover:text-text-primary transition-colors">{step}</p>
                        </div>
                     ))}
                  </div>
               </Card>

               <div className="space-y-8">
                  <Card title="Use Cases" icon={<Lightbulb size={20} className="text-amber-400" />}>
                     <div className="flex flex-wrap gap-2 mt-4">
                        {algo.useCases.map((uc, i) => (
                           <span key={i} className="text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-text-muted">
                              {uc}
                           </span>
                        ))}
                     </div>
                  </Card>
               </div>
            </section>

            {/* Sandbox Integration */}
            <section className="space-y-8">
               <div className="flex items-center gap-3">
                  <Terminal size={24} className="text-primary" />
                  <h3 className="text-2xl font-bold">Live Execution Sandbox</h3>
               </div>

               <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                  <div className="xl:col-span-5 space-y-8">
                     <Card><ProcessTable /></Card>
                     <Card><AlgorithmConfig /></Card>
                  </div>
                  <div className="xl:col-span-7 space-y-8">
                     <Card><GanttChart /></Card>
                     <Card><MetricsDashboard /></Card>
                  </div>
               </div>
            </section>

            {/* Pros & Cons */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <Card className="border-accent/10 shadow-accent/5" title="Advantages" subtitle="Why choose this approach">
                  <div className="space-y-4 mt-6">
                     {algo.pros.map((pro, i) => (
                        <div key={i} className="flex gap-3 items-center text-sm text-text-muted">
                           <CheckCircle2 size={18} className="text-accent flex-shrink-0" />
                           {pro}
                        </div>
                     ))}
                  </div>
               </Card>
               <Card className="border-danger/10 shadow-danger/5" title="Disadvantages" subtitle="Potential drawbacks">
                  <div className="space-y-4 mt-6">
                     {algo.cons.map((con, i) => (
                        <div key={i} className="flex gap-3 items-center text-sm text-text-muted">
                           <XCircle size={18} className="text-danger flex-shrink-0" />
                           {con}
                        </div>
                     ))}
                  </div>
               </Card>
            </section>
         </main>
      </div>
   );
};

export default AlgorithmDetail;
