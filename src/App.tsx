import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import { ErrorPage } from './pages/ErrorPage';

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Simulation = lazy(() => import('./pages/Simulation'));

const PageSkeleton = () => (
  <div className="min-h-screen bg-background p-8 flex flex-col gap-8 animate-pulse">
    <div className="h-16 w-full bg-card rounded-2xl" />
    <div className="grid grid-cols-12 gap-8 flex-1">
      <div className="col-span-4 h-full bg-card rounded-2xl" />
      <div className="col-span-8 h-full bg-card rounded-2xl" />
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <ErrorBoundary 
      fallback={
        <ErrorPage 
          code="500" 
          title="System Exception" 
          message="A critical runtime error has occurred in the scheduling engine. Please reboot the session." 
          reset={() => window.location.reload()} 
        />
      }
    >
      <Router>
        <Suspense fallback={<PageSkeleton />}>
          <div className="bg-background min-h-screen text-text-primary selection:bg-primary/30 selection:text-white transition-colors duration-300">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/simulate/:algorithm" element={<Simulation />} />
              <Route path="*" element={<ErrorPage code="404" title="Page Not Found" message="The requested scheduling module or route does not exist in the current system context." />} />
            </Routes>
          </div>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
};

export default App;