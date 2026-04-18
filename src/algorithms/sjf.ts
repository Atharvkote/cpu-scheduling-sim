import type { Process, AlgorithmResult, TimelineEntry, QueueSnapshot, SimulationConfig } from '../types';
import { calculateMetrics } from '../utils/metrics';

export function runSJF(processes: Process[], config: SimulationConfig): AlgorithmResult {
  const timeline: TimelineEntry[] = [];
  const queueSnapshots: QueueSnapshot[] = [];
  const processesCount = processes.length;
  
  if (processesCount === 0) {
    return { timeline: [], metrics: calculateMetrics([], []), queueSnapshots: [] };
  }

  const remainingBurstTime = new Map<string, number>();
  processes.forEach(p => remainingBurstTime.set(p.id, p.burstTime));

  let currentTime = 0;
  let completedCount = 0;
  let currentProcessId: string | null = null;
  let segmentStartTime = 0;

  while (completedCount < processesCount) {
    const availableProcesses = processes.filter(
      p => p.arrivalTime <= currentTime && (remainingBurstTime.get(p.id) || 0) > 0
    );

    let nextProcessId: string | null = null;
    let explanation = "";

    if (availableProcesses.length > 0) {
      // Pick process with shortest burst time
      const nextProcess = availableProcesses.reduce((prev, curr) => {
        const prevBurst = remainingBurstTime.get(prev.id) || 0;
        const currBurst = remainingBurstTime.get(curr.id) || 0;
        if (currBurst < prevBurst) return curr;
        if (currBurst === prevBurst && curr.arrivalTime < prev.arrivalTime) return curr;
        return prev;
      });
      nextProcessId = nextProcess.id;
      explanation = `${nextProcess.name} selected because it has the shortest remaining burst time (${remainingBurstTime.get(nextProcessId)}ms) among available processes.`;
    } else {
      explanation = "No processes have arrived yet. CPU is in IDLE state.";
    }

    // Handle Preemption or process change
    if (nextProcessId !== currentProcessId) {
      if (currentProcessId !== null) {
        const p = processes.find(proc => proc.id === currentProcessId)!;
        timeline.push({
          processId: p.id,
          processName: p.name,
          startTime: segmentStartTime,
          endTime: currentTime,
          color: p.color,
        });
      } else if (currentTime > 0 && timeline.length > 0 && timeline[timeline.length - 1].processId === null) {
        timeline[timeline.length - 1].endTime = currentTime;
      }

      if (nextProcessId === null) {
        timeline.push({
          processId: null,
          processName: 'Idle',
          startTime: currentTime,
          endTime: currentTime,
          color: '#1F2937',
        });
      }
      
      currentProcessId = nextProcessId;
      segmentStartTime = currentTime;
    }

    // Capture snapshot for every tick if we want fine-grained study mode
    queueSnapshots.push({
      time: currentTime,
      readyQueue: availableProcesses.filter(p => p.id !== currentProcessId).map(p => p.id),
      runningProcess: currentProcessId,
      explanation
    });

    // Move time forward
    if (currentProcessId !== null) {
      const remaining = remainingBurstTime.get(currentProcessId)!;
      if (config.isPreemptive) {
        remainingBurstTime.set(currentProcessId, remaining - 1);
        currentTime++;
        if (remainingBurstTime.get(currentProcessId) === 0) {
          completedCount++;
        }
      } else {
        currentTime += remaining;
        remainingBurstTime.set(currentProcessId, 0);
        completedCount++;
      }
    } else {
      const nextArrival = Math.min(...processes.filter(p => p.arrivalTime > currentTime).map(p => p.arrivalTime));
      currentTime = isFinite(nextArrival) ? nextArrival : currentTime + 1;
    }
  }

  // Final segment
  if (currentProcessId !== null) {
    const p = processes.find(proc => proc.id === currentProcessId)!;
    timeline.push({
      processId: p.id,
      processName: p.name,
      startTime: segmentStartTime,
      endTime: currentTime,
      color: p.color,
    });
  }

  const metrics = calculateMetrics(processes, timeline);

  return { timeline, metrics, queueSnapshots };
}
