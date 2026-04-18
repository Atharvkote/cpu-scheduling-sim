export interface Process {
  id: string;
  name: string;
  arrivalTime: number;
  burstTime: number;
  priority: number;
  color: string;
}

export interface TimelineEntry {
  processId: string | null;
  processName: string;
  startTime: number;
  endTime: number;
  color: string;
}

export interface ProcessMetrics {
  processId: string;
  processName: string;
  arrivalTime: number;
  burstTime: number;
  completionTime: number;
  turnaroundTime: number;
  waitingTime: number;
  responseTime: number;
}

export interface Metrics {
  avgWaitingTime: number;
  avgTurnaroundTime: number;
  avgResponseTime: number;
  cpuUtilization: number;
  throughput: number;
  processMetrics: ProcessMetrics[];
}

export interface AlgorithmResult {
  timeline: TimelineEntry[];
  metrics: Metrics;
  queueSnapshots: QueueSnapshot[];
}

export interface QueueSnapshot {
  time: number;
  readyQueue: string[];
  runningProcess: string | null;
  explanation?: string; // For Study Mode
}

export type AlgorithmType = 'fcfs' | 'sjf' | 'priority' | 'round-robin';

export interface AlgorithmInfo {
  id: AlgorithmType;
  name: string;
  shortName: string;
  description: string;
  detailedDescription: string;
  isPreemptive: boolean;
  canBePreemptive: boolean;
  complexity: string;
  pros: string[];
  cons: string[];
  useCases: string[];
  steps: string[];
  mathematicalIntuition: string; // New
  edgeCases: string[]; // New
  starvationInfo: string; // New
}

export interface SimulationConfig {
  timeQuantum: number;
  isPreemptive: boolean;
}

export interface SavedSimulation {
  id: string;
  name: string;
  timestamp: number;
  algorithmId: AlgorithmType;
  processes: Process[];
  config: SimulationConfig;
  metrics: Metrics;
}
