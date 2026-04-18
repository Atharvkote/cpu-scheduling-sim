import type { Process, AlgorithmResult, TimelineEntry, QueueSnapshot, SimulationConfig } from '../types';
import { calculateMetrics } from '../utils/metrics';

export function runRoundRobin(processes: Process[], config: SimulationConfig): AlgorithmResult {
  const quantum = config.timeQuantum || 2;
  const timeline: TimelineEntry[] = [];
  const queueSnapshots: QueueSnapshot[] = [];
  const processesCount = processes.length;
  
  if (processesCount === 0) {
    return { timeline: [], metrics: calculateMetrics([], []), queueSnapshots: [] };
  }

  const remainingBurstTime = new Map<string, number>();
  processes.forEach(p => remainingBurstTime.set(p.id, p.burstTime));

  const readyQueue: string[] = [];
  const visited = new Set<string>();
  
  let currentTime = 0;
  let completedCount = 0;

  const addArrivingProcesses = (time: number) => {
    processes
      .filter(p => p.arrivalTime <= time && !visited.has(p.id))
      .sort((a, b) => a.arrivalTime - b.arrivalTime)
      .forEach(p => {
        readyQueue.push(p.id);
        visited.add(p.id);
      });
  };

  addArrivingProcesses(currentTime);

  while (completedCount < processesCount) {
    if (readyQueue.length === 0) {
      const remainingProcesses = processes.filter(p => !visited.has(p.id));
      if (remainingProcesses.length > 0) {
        const nextArrival = Math.min(...remainingProcesses.map(p => p.arrivalTime));
        
        timeline.push({
          processId: null,
          processName: 'Idle',
          startTime: currentTime,
          endTime: nextArrival,
          color: '#1F2937',
        });

        queueSnapshots.push({
          time: currentTime,
          readyQueue: [],
          runningProcess: null,
          explanation: "Ready queue is empty. Waiting for next arrival at " + nextArrival
        });

        currentTime = nextArrival;
        addArrivingProcesses(currentTime);
      }
    }

    if (readyQueue.length > 0) {
      const currentProcessId = readyQueue.shift()!;
      const process = processes.find(p => p.id === currentProcessId)!;
      const remaining = remainingBurstTime.get(currentProcessId)!;
      const executionTime = Math.min(remaining, quantum);

      queueSnapshots.push({
        time: currentTime,
        readyQueue: [...readyQueue],
        runningProcess: currentProcessId,
        explanation: `${process.name} assigned ${executionTime}ms (Quantum: ${quantum}ms).`
      });

      timeline.push({
        processId: process.id,
        processName: process.name,
        startTime: currentTime,
        endTime: currentTime + executionTime,
        color: process.color,
      });

      // Capture state during execution if needed, but snapshots usually at decision points
      for(let t = 1; t <= executionTime; t++) {
         addArrivingProcesses(currentTime + t);
      }

      currentTime += executionTime;
      remainingBurstTime.set(currentProcessId, remaining - executionTime);

      if (remainingBurstTime.get(currentProcessId)! > 0) {
        readyQueue.push(currentProcessId);
      } else {
        completedCount++;
      }
    }
  }

  return { timeline, metrics: calculateMetrics(processes, timeline), queueSnapshots };
}
