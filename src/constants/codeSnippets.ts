export const ALGO_CODE = {
  fcfs: `export function runFCFS(processes: Process[]): AlgorithmResult {
  const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const timeline: TimelineEntry[] = [];
  const queueSnapshots: QueueSnapshot[] = [];
  
  let currentTime = 0;

  for (const process of sortedProcesses) {
    if (currentTime < process.arrivalTime) {
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
    currentTime += process.burstTime;

    timeline.push({
      processId: process.id,
      processName: process.name,
      startTime,
      endTime: currentTime,
      color: process.color,
    });
  }

  return { timeline, metrics: calculateMetrics(processes, timeline), queueSnapshots };
}`,

  sjf: `export function runSJF(processes: Process[], config: SimulationConfig): AlgorithmResult {
  let currentTime = 0;
  let completedCount = 0;
  const remainingBurstTime = new Map(processes.map(p => [p.id, p.burstTime]));

  while (completedCount < processes.length) {
    const available = processes.filter(p => p.arrivalTime <= currentTime && remainingBurstTime.get(p.id)! > 0);

    if (available.length > 0) {
      const next = available.reduce((prev, curr) => 
        remainingBurstTime.get(curr.id)! < remainingBurstTime.get(prev.id)! ? curr : prev
      );

      if (config.isPreemptive) {
        remainingBurstTime.set(next.id, remainingBurstTime.get(next.id)! - 1);
        currentTime++;
        if (remainingBurstTime.get(next.id) === 0) completedCount++;
      } else {
        const burst = remainingBurstTime.get(next.id)!;
        currentTime += burst;
        remainingBurstTime.set(next.id, 0);
        completedCount++;
      }
    } else {
      currentTime++;
    }
  }
  // ... timeline generation ...
}`,

  priority: `export function runPriority(processes: Process[], config: SimulationConfig): AlgorithmResult {
  let currentTime = 0;
  let completedCount = 0;
  const remainingBurstTime = new Map(processes.map(p => [p.id, p.burstTime]));

  while (completedCount < processes.length) {
    const available = processes.filter(p => p.arrivalTime <= currentTime && remainingBurstTime.get(p.id)! > 0);

    if (available.length > 0) {
      const next = available.reduce((prev, curr) => 
        curr.priority < prev.priority ? curr : prev
      );

      if (config.isPreemptive) {
        remainingBurstTime.set(next.id, remainingBurstTime.get(next.id)! - 1);
        currentTime++;
        if (remainingBurstTime.get(next.id) === 0) completedCount++;
      } else {
        const burst = remainingBurstTime.get(next.id)!;
        currentTime += burst;
        remainingBurstTime.set(next.id, 0);
        completedCount++;
      }
    } else {
      currentTime++;
    }
  }
  // ... timeline generation ...
}`,

  'round-robin': `export function runRoundRobin(processes: Process[], config: SimulationConfig): AlgorithmResult {
  const quantum = config.timeQuantum || 2;
  const readyQueue: string[] = [];
  const remainingBurstTime = new Map(processes.map(p => [p.id, p.burstTime]));
  let currentTime = 0;

  while (completedCount < processes.length) {
    if (readyQueue.length > 0) {
      const id = readyQueue.shift()!;
      const burst = Math.min(remainingBurstTime.get(id)!, quantum);
      currentTime += burst;
      remainingBurstTime.set(id, remainingBurstTime.get(id)! - burst);
      
      // Check arrivals during execution...
      if (remainingBurstTime.get(id)! > 0) readyQueue.push(id);
      else completedCount++;
    } else {
      currentTime++;
    }
  }
}`
};
