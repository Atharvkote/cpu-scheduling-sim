import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, RefreshCcw, AlertTriangle } from 'lucide-react';

interface ErrorPageProps {
  code?: string;
  title?: string;
  message?: string;
  reset?: () => void;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({
  code = "404",
  title = "System Failure",
  message = "The requested module could not be executed or the simulation state has become unstable.",
  reset
}) => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >

        <div className="relative mb-12">
          <img src="/Logo.png" alt="Logo" className="w-24 h-24 mx-auto mb-8 " />
          <h1 className="text-[150px] font-black leading-none tracking-tighter text-primary select-none">
            {code}
          </h1>

        </div>

        <h2 className="text-3xl font-black mb-4 uppercase tracking-widest">{title}</h2>
        <p className="text-text-muted max-w-md mx-auto mb-12 leading-relaxed font-medium">
          {message}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl shadow-primary/20"
          >
            <Home size={18} /> RETURN TO DASHBOARD
          </Link>

          {reset && (
            <button
              onClick={reset}
              className="flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-text-primary rounded-2xl font-black text-sm hover:bg-white/10 transition-all"
            >
              <RefreshCcw size={18} /> REBOOT SESSION
            </button>
          )}
        </div>
      </motion.div>

      <div className="mt-20 flex items-center gap-2 text-[10px] uppercase font-black tracking-[0.3em] text-text-muted opacity-40">
        <span className="w-8 h-[1px] bg-white/10" />
        Academic Edition Diagnostic Protocol
        <span className="w-8 h-[1px] bg-white/10" />
      </div>
    </div>
  );
};
