import type { Process, AlgorithmResult, TimelineEntry, QueueSnapshot } from '../types';
import { calculateMetrics } from '../utils/metrics';

export function runFCFS(processes: Process[]): AlgorithmResult {
  const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const timeline: TimelineEntry[] = [];
  const queueSnapshots: QueueSnapshot[] = [];
  
  let currentTime = 0;

  for (const process of sortedProcesses) {
    // Handle CPU idle time
    if (currentTime < process.arrivalTime) {
      queueSnapshots.push({
        time: currentTime,
        readyQueue: [],
        runningProcess: null,
        explanation: `CPU is idle. Waiting for the next process (${process.name}) at time ${process.arrivalTime}.`
      });

      timeline.push({
        processId: null,
        processName: 'Idle',
        startTime: currentTime,
        endTime: process.arrivalTime,
        color: '#1F2937',
      });
      currentTime = process.arrivalTime;
    }

    const startTime = currentTime;
    
    // In FCFS, we can generate snapshots for each time unit of the burst if we want, 
    // but for simplicity we'll do once per process start.
    queueSnapshots.push({
      time: startTime,
      readyQueue: sortedProcesses.filter(p => p.arrivalTime <= startTime && p !== process).map(p => p.id),
      runningProcess: process.id,
      explanation: `${process.name} started execution because it was the first to arrive in the queue.`
    });

    currentTime += process.burstTime;

    timeline.push({
      processId: process.id,
      processName: process.name,
      startTime,
      endTime: currentTime,
      color: process.color,
    });
  }

  const metrics = calculateMetrics(processes, timeline);

  return {
    timeline,
    metrics,
    queueSnapshots,
  };
}
