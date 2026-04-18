import type { Process, TimelineEntry, Metrics, ProcessMetrics } from '../types';

export function calculateMetrics(processes: Process[], timeline: TimelineEntry[]): Metrics {
  if (processes.length === 0 || timeline.length === 0) {
    return {
      avgWaitingTime: 0,
      avgTurnaroundTime: 0,
      avgResponseTime: 0,
      cpuUtilization: 0,
      throughput: 0,
      processMetrics: [],
    };
  }

  const processMetrics: ProcessMetrics[] = processes.map((p) => {
    const processTimeline = timeline.filter((t) => t.processId === p.id);

    // Completion Time: The finish time of the last segment in the timeline
    const completionTime = processTimeline.length > 0
      ? Math.max(...processTimeline.map(t => t.endTime))
      : 0;

    // First Response Time: The start time of the first segment in the timeline
    const firstResponse = processTimeline.length > 0
      ? Math.min(...processTimeline.map(t => t.startTime))
      : 0;

    const turnaroundTime = completionTime - p.arrivalTime;
    const waitingTime = turnaroundTime - p.burstTime;
    const responseTime = firstResponse - p.arrivalTime;

    return {
      processId: p.id,
      processName: p.name,
      arrivalTime: p.arrivalTime,
      burstTime: p.burstTime,
      completionTime,
      turnaroundTime: Math.max(0, turnaroundTime),
      waitingTime: Math.max(0, waitingTime),
      responseTime: Math.max(0, responseTime),
    };
  });

  const totalProcesses = processMetrics.length;
  const avgWaitingTime = processMetrics.reduce((sum, pm) => sum + pm.waitingTime, 0) / totalProcesses;
  const avgTurnaroundTime = processMetrics.reduce((sum, pm) => sum + pm.turnaroundTime, 0) / totalProcesses;
  const avgResponseTime = processMetrics.reduce((sum, pm) => sum + pm.responseTime, 0) / totalProcesses;

  const totalTime = Math.max(...timeline.map((t) => t.endTime));
  const busyTime = timeline
    .filter((t) => t.processId !== null)
    .reduce((sum, t) => sum + (t.endTime - t.startTime), 0);

  const cpuUtilization = (busyTime / totalTime) * 100;
  const throughput = totalProcesses / totalTime;

  return {
    avgWaitingTime,
    avgTurnaroundTime,
    avgResponseTime,
    cpuUtilization,
    throughput,
    processMetrics,
  };
}
