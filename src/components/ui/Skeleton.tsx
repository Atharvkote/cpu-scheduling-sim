import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
  <div className={`animate-pulse bg-white/5 rounded-2xl ${className}`} />
);

export const TableSkeleton: React.FC = () => (
  <div className="space-y-4 p-6">
    <Skeleton className="h-8 w-full" />
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-12 w-full" />
  </div>
);

export const MetricSkeleton: React.FC = () => (
  <div className="grid grid-cols-2 gap-4">
    <div className="h-32 bg-white/5 rounded-2xl animate-pulse" />
    <div className="h-32 bg-white/5 rounded-2xl animate-pulse" />
    <div className="h-32 bg-white/5 rounded-2xl animate-pulse" />
    <div className="h-32 bg-white/5 rounded-2xl animate-pulse" />
  </div>
);

export const ChartSkeleton: React.FC = () => (
  <div className="h-64 w-full bg-white/5 rounded-3xl animate-pulse flex items-center justify-center">
    <div className="p-4 bg-primary/10 rounded-full">
       <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  </div>
);
