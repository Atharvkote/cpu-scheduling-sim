import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Save,
  Settings2,
  Zap,
  Activity,
  ChevronRight,
  Database,
  History
} from 'lucide-react';

import { useProcessStore } from '../store/useProcessStore';
import { useSimulationStore } from '../store/useSimulationStore';
import { useSaveStore } from '../store/useSaveStore';
import { ALGORITHMS } from '../constants/algorithms';
import { Card } from '../components/ui/Card';
import { TableSkeleton, MetricSkeleton, ChartSkeleton } from '../components/ui/Skeleton';

// Internal Widgets (Lazy Loaded)
const ProcessTable = React.lazy(() => import('../components/ProcessTable').then(m => ({ default: m.ProcessTable })));
const GanttChart = React.lazy(() => import('../components/GanttChart').then(m => ({ default: m.GanttChart })));
const MetricsDashboard = React.lazy(() => import('../components/MetricsDashboard').then(m => ({ default: m.MetricsDashboard })));
const AlgorithmConfig = React.lazy(() => import('../components/AlgorithmConfig').then(m => ({ default: m.AlgorithmConfig })));
const ComparisonCharts = React.lazy(() => import('../components/ComparisonCharts').then(m => ({ default: m.ComparisonCharts })));
const ThemeToggle = React.lazy(() => import('../components/ThemeToggle').then(m => ({ default: m.ThemeToggle })));

const Simulation: React.FC = () => {
  const { algorithm } = useParams<{ algorithm: string }>();
  const navigate = useNavigate();

  const { processes } = useProcessStore();
  const {
    selectedAlgorithmId,
    setSelectedAlgorithm,
    calculate,
    result,
    status,
    setStatus,
    tick,
    reset,
    speed,
    setSpeed,
    executionMode,
    setExecutionMode,
    isStudyMode,
    setStudyMode
  } = useSimulationStore();

  const { saveSimulation } = useSaveStore();

  const algoInfo = useMemo(() => ALGORITHMS.find(a => a.id === algorithm), [algorithm]);

  // Initial Setup
  useEffect(() => {
    if (!algoInfo) {
      navigate('/dashboard');
      return;
    }
    setSelectedAlgorithm(algoInfo.id as any);
  }, [algoInfo, setSelectedAlgorithm, navigate]);

  // Auto-calculate on changes
  useEffect(() => {
    calculate(processes);
  }, [processes, selectedAlgorithmId, calculate]);

  // Simulation Loop
  useEffect(() => {
    let interval: any;
    if (status === 'running' && executionMode === 'auto') {
      const delay = 1000 / (speed || 1);
      interval = setInterval(() => {
        tick();
      }, delay);
    }
    return () => clearInterval(interval);
  }, [status, executionMode, speed, tick]);

  const handleSave = () => {
    if (!result || !algoInfo) return;
    saveSimulation({
      id: Date.now().toString(),
      name: `Run for ${algoInfo.shortName}`,
      timestamp: Date.now(),
      algorithmId: algoInfo.id,
      processes: [...processes],
      config: useSimulationStore.getState().config,
      metrics: result.metrics,
    });
    alert('Simulation saved to history!');
  };

  return (
    <div className="min-h-screen bg-background text-text-primary px-8 pb-20">
      {/* Navbar */}
      <nav className="flex items-center justify-between py-6 max-w-[1700px] mx-auto">
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="p-3 bg-card border border-white/5 rounded-2xl text-text-muted hover:text-primary transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-black">{algoInfo?.name}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Execution Mode • Live Session</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <React.Suspense fallback={<div className="w-10 h-10 bg-white/5 rounded-2xl animate-pulse" />}>
             <ThemeToggle />
          </React.Suspense>
          <div className="flex bg-card/40 p-1.5 rounded-2xl border border-white/5">
            <button
              onClick={() => setStudyMode(!isStudyMode)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${isStudyMode ? 'bg-primary text-white shadow-lg' : 'text-text-muted hover:text-text-primary'
                }`}
            >
              <Zap size={14} />
              Study Mode {isStudyMode ? 'ON' : 'OFF'}
            </button>
          </div>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 bg-card/60 hover:bg-card border border-white/10 rounded-2xl text-text-muted hover:text-primary transition-all font-bold text-xs"
          >
            <Save size={16} />
            Save Run
          </button>
        </div>
      </nav>

      {/* Global Progress Bar */}
      <div className="max-w-[1700px] mx-auto mb-6 h-1.5 bg-card/40 rounded-full border border-white/5 overflow-hidden">
         <motion.div 
            className="h-full bg-primary shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            initial={{ width: 0 }}
            animate={{ width: `${(useSimulationStore.getState().currentTick / (result?.timeline[result.timeline.length-1]?.endTime || 1)) * 100}%` }}
         />
      </div>

      <div className="max-w-[1700px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-10 mt-6 items-start">

        {/* LEFT PANEL (40%) */}
        <div className="xl:col-span-5 space-y-8">
          {/* Controls Section */}
          <Card className="border-primary/10 overflow-visible">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h4 className="flex items-center gap-2 font-black uppercase text-xs tracking-widest text-text-muted">
                  <Activity size={16} className="text-primary" />
                  Playback Controls
                </h4>
                <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${status === 'running' ? 'bg-accent/10 text-accent' : status === 'completed' ? 'bg-primary/10 text-primary' : 'bg-white/5 text-text-muted'
                  }`}>
                  {status}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {status !== 'running' ? (
                  <button
                    onClick={() => {
                      setExecutionMode('auto');
                      setStatus('running');
                    }}
                    className="flex-1 py-4 bg-primary hover:bg-primary/90 text-white rounded-2xl flex items-center justify-center gap-2 font-black transition-all shadow-xl shadow-primary/20 active:scale-95"
                  >
                    <Play fill="currentColor" size={20} /> START
                  </button>
                ) : (
                  <button
                    onClick={() => setStatus('paused')}
                    className="flex-1 py-4 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-2xl flex items-center justify-center gap-2 font-black transition-all"
                  >
                    <Pause fill="currentColor" size={20} /> PAUSE
                  </button>
                )}
                <button
                  onClick={reset}
                  className="p-4 bg-card border border-white/5 rounded-2xl text-text-muted hover:text-danger hover:border-danger/30 transition-all"
                >
                  <RotateCcw size={20} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Simulation Speed</label>
                  <div className="flex items-center gap-3 px-4 py-3 bg-card/60 border border-white/5 rounded-2xl">
                    <input
                      type="range" min="1" max="10" step="1"
                      value={speed}
                      onChange={(e) => setSpeed(parseInt(e.target.value))}
                      className="flex-1 accent-primary h-1.5"
                    />
                    <span className="text-xs font-black text-primary w-6">{speed}x</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Execution Mode</label>
                  <div className="flex p-1 bg-card/60 border border-white/5 rounded-2xl h-full">
                    <button
                      onClick={() => setExecutionMode('auto')}
                      className={`flex-1 text-[9px] font-black uppercase rounded-xl transition-all ${executionMode === 'auto' ? 'bg-white/10 text-text-primary shadow-sm' : 'text-text-muted'}`}
                    >Auto</button>
                    <button
                      onClick={() => { setExecutionMode('step'); setStatus('paused'); }}
                      className={`flex-1 text-[9px] font-black uppercase rounded-xl transition-all ${executionMode === 'step' ? 'bg-white/10 text-text-primary shadow-sm' : 'text-text-muted'}`}
                    >Step</button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Process Management */}
          <Card className="p-0 overflow-hidden">
            <div className="p-6 border-b border-white/5 bg-card/20 flex items-center justify-between">
              <h4 className="flex items-center gap-2 font-black uppercase text-xs tracking-widest text-text-muted">
                <Database size={16} className="text-primary" />
                Process Database
              </h4>
            </div>
            <React.Suspense fallback={<TableSkeleton />}>
              <ProcessTable />
            </React.Suspense>
          </Card>

          {/* Algorithm Configuration */}
          <Card className="border-white/5">
            <React.Suspense fallback={<div className="h-40 bg-white/5 rounded-2xl animate-pulse" />}>
              <AlgorithmConfig />
            </React.Suspense>
          </Card>
        </div>

        {/* RIGHT PANEL (60%) */}
        <div className="xl:col-span-7 space-y-8">
          {/* Gantt Chart Section */}
          <Card className="relative overflow-visible">
            {isStudyMode && status === 'running' && (
              <div className="absolute -top-4 -right-4 z-20 px-4 py-2 bg-primary/90 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl animate-bounce">
                <p className="text-[10px] font-black text-white uppercase tracking-wider">Analyzing Step {useSimulationStore.getState().currentTick}...</p>
              </div>
            )}
            <React.Suspense fallback={<ChartSkeleton />}>
               <GanttChart isSimulationPage />
            </React.Suspense>
          </Card>

          {/* Real-time Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <React.Suspense fallback={<MetricSkeleton />}>
                <MetricsDashboard isSimulationPage />
              </React.Suspense>
            </Card>
            <Card className="flex flex-col justify-center items-center text-center p-8 bg-gradient-to-br from-card to-background border-dashed">
              {status === 'running' ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto border border-accent/30">
                    <Activity className="text-accent animate-pulse" size={32} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Execution Pipeline Active</p>
                    <p className="text-xs text-text-muted">Processing cycles in real-time...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
                    <History className="text-text-muted" size={32} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Idle State</p>
                    <p className="text-xs text-text-muted">Awaiting activation signal</p>
                  </div>
                </div>
              )}
            </Card>
          </div>

        </div>
        {/* Analytics Graphs */}
        <div className="pt-4 xl:col-span-12">
          <React.Suspense fallback={<ChartSkeleton />}>
            <ComparisonCharts />
          </React.Suspense>
        </div>

      </div>

      {/* Study Mode Overlay Footer */}
      <AnimatePresence>
        {isStudyMode && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-[100] px-8 py-6 bg-card/90 backdrop-blur-2xl border-t border-primary/30"
          >
            <div className="max-w-6xl mx-auto flex items-center gap-8">
              <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                <Zap className="text-primary" size={24} />
              </div>
              <div className="flex-1">
                <h5 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Study Insight • Tick {useSimulationStore.getState().currentTick}</h5>
                <p className="text-sm text-text-primary font-medium leading-relaxed h-10 line-clamp-2">
                  {status === 'running' || status === 'completed' || status === 'paused'
                    ? (result?.queueSnapshots.findLast(s => s.time <= useSimulationStore.getState().currentTick)?.explanation ||
                      `Evaluating process ${result?.timeline.find(t => t.startTime <= useSimulationStore.getState().currentTick && t.endTime > useSimulationStore.getState().currentTick)?.processName || 'IDLE'} thread...`)
                    : "Ready to analyze scheduling decisions. Start reproduction to see live insights."
                  }
                </p>
              </div>
              {executionMode === 'step' && (
                <button
                  onClick={() => tick()}
                  className="flex items-center gap-2 px-8 py-3 bg-primary text-white font-black rounded-xl text-xs hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95"
                >
                  NEXT STEP <ChevronRight size={16} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Simulation;
