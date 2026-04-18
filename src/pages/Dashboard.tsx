import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ALGORITHMS } from '../constants/algorithms';
import { Card } from '../components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ShieldCheck, 
  AlertCircle,
  Lightbulb,
  Binary,
  Cpu,
  Star
} from 'lucide-react';
import { useSimulationStore } from '../store/useSimulationStore';
import { ThemeToggle } from '../components/ThemeToggle';
import { ALGO_CODE } from '../constants/codeSnippets';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { selectedAlgorithmId, setSelectedAlgorithm } = useSimulationStore();
  const currentAlgo = ALGORITHMS.find(a => a.id === selectedAlgorithmId) || ALGORITHMS[0];

  const handleStartSimulation = () => {
    navigate(`/simulate/${currentAlgo.id}`);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Top Section – Algorithm Selector */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5 px-8 py-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30">
                <Cpu className="text-primary" size={24} />
             </div>
             <div>
                <h1 className="text-xl font-black tracking-tight leading-none uppercase">CPU Scheduler</h1>
                <p className="text-[10px] text-text-muted mt-1 font-bold tracking-[0.2em] uppercase">Academic Edition v2.0</p>
             </div>
             <div className="ml-4">
                <ThemeToggle />
             </div>
          </div>

          <div className="flex bg-card/40 p-1.5 rounded-2xl border border-white/5 space-x-1">
            {ALGORITHMS.map((algo) => (
              <button
                key={algo.id}
                onClick={() => setSelectedAlgorithm(algo.id)}
                className={`
                  relative px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300
                  ${selectedAlgorithmId === algo.id 
                    ? 'text-white' 
                    : 'text-text-muted hover:text-text-primary hover:bg-white/5'}
                `}
              >
                {selectedAlgorithmId === algo.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/30 border border-primary/50"
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {algo.shortName}
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-md border ${
                    selectedAlgorithmId === algo.id ? 'bg-white/20 border-white/20' : 'bg-white/5 border-white/5'
                  }`}>
                    {algo.isPreemptive || algo.canBePreemptive ? 'P' : 'N'}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 pt-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentAlgo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            {/* Middle Section – Detailed Algorithm Info */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
               {/* Intro Column */}
               <div className="lg:col-span-12">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                       {currentAlgo.complexity}
                    </span>
                    <span className="text-text-muted text-xs font-medium">Type: {currentAlgo.isPreemptive || currentAlgo.canBePreemptive ? 'Preemptive' : 'Non-Preemptive'}</span>
                  </div>
                  <h2 className="text-6xl font-black mb-8 tracking-tight">
                    {currentAlgo.name}
                  </h2>
                  <p className="text-2xl text-text-muted leading-relaxed max-w-4xl">
                    {currentAlgo.detailedDescription}
                  </p>
               </div>

               {/* Mathematical Intuition & Starvation */}
               <div className="lg:col-span-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <Card className="border-primary/10 bg-primary/[0.02]" title="Mathematical Intuition">
                        <div className="flex gap-4 items-start mt-2">
                           <Binary className="text-primary flex-shrink-0" size={24} />
                           <p className="text-sm text-text-muted leading-relaxed italic">
                             "{currentAlgo.mathematicalIntuition}"
                           </p>
                        </div>
                     </Card>
                     <Card className="border-danger/10 bg-danger/[0.02]" title="Starvation Analysis">
                        <div className="flex gap-4 items-start mt-2">
                           <AlertCircle className="text-danger flex-shrink-0" size={24} />
                           <p className="text-sm text-text-muted leading-relaxed">
                             {currentAlgo.starvationInfo}
                           </p>
                        </div>
                     </Card>
                  </div>

                  <Card title="Operational Workflow" subtitle="Step-by-step logic execution">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mt-6">
                       {currentAlgo.steps.map((step, i) => (
                         <div key={i} className="flex gap-4 group">
                            <span className="text-primary font-black opacity-30 group-hover:opacity-100 transition-opacity">0{i+1}</span>
                            <p className="text-sm text-text-muted group-hover:text-text-primary transition-colors">{step}</p>
                         </div>
                       ))}
                    </div>
                  </Card>
               </div>

               {/* Advantages / Disadvantages */}
               <div className="lg:col-span-4 space-y-8">
                  <Card className="border-accent/10" title="Advantages">
                     <ul className="space-y-4 mt-4">
                        {currentAlgo.pros.map((pro, i) => (
                           <li key={i} className="flex items-start gap-2 text-xs text-text-muted">
                              <ShieldCheck className="text-accent flex-shrink-0" size={16} />
                              {pro}
                           </li>
                        ))}
                     </ul>
                  </Card>
                  <Card className="border-white/5" title="Edge Cases">
                     <ul className="space-y-4 mt-4">
                        {currentAlgo.edgeCases.map((ec, i) => (
                           <li key={i} className="flex items-start gap-2 text-xs text-text-muted">
                              <Lightbulb className="text-amber-400 flex-shrink-0" size={16} />
                              {ec}
                           </li>
                        ))}
                     </ul>
                  </Card>
               </div>

               {/* Code Preview Section */}
               <div className="lg:col-span-12 mt-8">
                  <header className="flex items-center justify-between mb-6">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl">
                           <Binary size={18} className="text-primary" />
                        </div>
                        <div>
                           <h4 className="text-sm font-black uppercase tracking-widest text-text-primary">Algorithm Implementation</h4>
                           <p className="text-[10px] text-text-muted font-bold uppercase tracking-tighter">TypeScript Core v4.0</p>
                        </div>
                     </div>
                     <span className="text-[9px] font-black text-text-muted bg-white/5 border border-white/5 px-2 py-0.5 rounded-full">Read-Only Source</span>
                  </header>

                  <div className="relative group">
                     {/* Glass Blur Effect */}
                     <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur opacity-25 group-hover:opacity-40 transition-opacity" />
                     
                     <div className="relative bg-card/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                        <div className="flex items-center gap-2 px-6 py-4 bg-white/5 border-b border-white/5">
                           <div className="flex gap-1.5">
                              <div className="w-2.5 h-2.5 rounded-full bg-danger/50" />
                              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                              <div className="w-2.5 h-2.5 rounded-full bg-accent/50" />
                           </div>
                           <span className="text-[10px] font-mono text-text-muted ml-4">{currentAlgo.id}.ts</span>
                        </div>
                        
                        <div className="p-4 overflow-x-auto custom-scrollbar">
                           <SyntaxHighlighter
                              language="typescript"
                              style={vscDarkPlus}
                              customStyle={{
                                 backgroundColor: 'transparent',
                                 padding: '1.5rem',
                                 margin: 0,
                                 fontSize: '11px',
                                 lineHeight: '1.6',
                              }}
                              codeTagProps={{
                                 className: 'font-mono'
                              }}
                           >
                              {ALGO_CODE[currentAlgo.id as keyof typeof ALGO_CODE]}
                           </SyntaxHighlighter>
                        </div>
                        
                        <div className="px-6 py-3 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                           <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Compiler Target: ESNext</p>
                           <p className="text-[9px] font-bold text-primary uppercase tracking-widest">Optimized for O({currentAlgo.complexity.split('O(')[1] || 'n'})</p>
                        </div>
                     </div>
                  </div>
               </div>

            </section>

            {/* Static Preview Section */}
            <section className="bg-card/30 rounded-3xl p-12 border border-white/5 flex flex-col items-center">
               <div className="flex items-center gap-2 mb-8">
                  <Star className="text-primary animate-pulse" size={20} fill="currentColor" />
                  <h3 className="text-xl font-bold uppercase tracking-widest text-text-muted">Gantt Visualization Preview</h3>
               </div>
               
               <div className="w-full max-w-4xl h-24 bg-background/50 rounded-2xl border border-white/5 flex items-center px-4 gap-2 overflow-hidden opacity-40 grayscale group-hover:grayscale-0 transition-all">
                  <div className="h-12 w-32 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/20">P1</div>
                  <div className="h-12 w-16 bg-accent/20 rounded-lg flex items-center justify-center border border-accent/20">P2</div>
                  <div className="h-12 w-48 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-500/20">P3</div>
                  <div className="h-12 flex-1 bg-slate-800/10 rounded-lg border border-dashed border-white/5 flex items-center justify-center text-[10px] text-text-muted uppercase">Interactive Controls Disabled</div>
               </div>

               <p className="mt-8 text-sm text-text-muted text-center max-w-md">
                 Static visualization intended for structural guidance. Launch the simulation suite for real-time data input and execution.
               </p>
            </section>

            {/* Bottom Section – Action */}
            <div className="flex flex-col items-center pt-8">
               <button
                  onClick={handleStartSimulation}
                  className="group relative px-12 py-6 bg-primary rounded-2xl font-black text-xl text-white shadow-2xl shadow-primary/40 hover:scale-105 transition-all active:scale-95 overflow-hidden"
               >
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                    className="absolute -top-4 -right-4 w-12 h-12 bg-white/20 blur-xl rounded-full"
                  />
                  <span className="relative z-10 flex items-center gap-3">
                    Start Simulation
                    <ChevronRight size={28} className="group-hover:translate-x-1 transition-transform" />
                  </span>
               </button>
               <p className="mt-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.3em]">
                 Enter Execution Mode • Multi-core engine ready
               </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Dashboard;
