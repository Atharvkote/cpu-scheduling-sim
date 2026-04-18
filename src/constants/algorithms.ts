import type { AlgorithmInfo } from '../types';

export const ALGORITHMS: AlgorithmInfo[] = [
  {
    id: 'fcfs',
    name: 'First Come First Served',
    shortName: 'FCFS',
    description: 'Executes processes in the exact order they arrive in the ready queue.',
    detailedDescription: 'First-Come, First-Served (FCFS) is the simplest scheduling algorithm. It simply queues processes in the order that they arrive in the ready queue. It is a non-preemptive algorithm.',
    isPreemptive: false,
    canBePreemptive: false,
    complexity: 'O(n)',
    pros: [
      'Simple to understand and implement',
      'Fair in terms of arrival order',
      'No starvation'
    ],
    cons: [
      'Convoy Effect: Short processes wait for long ones',
      'High average waiting time',
      'Not suitable for time-sharing systems'
    ],
    useCases: [
      'Batch systems where response time is not critical',
      'Simple embedded systems'
    ],
    steps: [
      'Sort processes by arrival time.',
      'Execute the first process until completion.',
      'Move to the next process in the sorted list.',
      'If CPU is idle, wait for the next arrival.'
    ],
    mathematicalIntuition: 'FCFS minimizes the overhead of scheduling decisions at the cost of potential high waiting times. It treats the CPU as a FIFO resource, making it predictable but inefficient for mixed-length workloads.',
    edgeCases: [
      'Very long process arriving first (Convoy Effect)',
      'Simultaneous arrivals (usually tied by PID)'
    ],
    starvationInfo: 'Starvation is impossible in FCFS because every process will eventually be served as long as they arrive. There is no concept of priority that could bypass a waiting process.'
  },
  {
    id: 'sjf',
    name: 'Shortest Job First',
    shortName: 'SJF',
    description: 'Selects the process with the smallest burst time next.',
    detailedDescription: 'Shortest Job First (SJF) selects the process with the minimum burst time. It can be non-preemptive or preemptive (Shortest Remaining Time First).',
    isPreemptive: false,
    canBePreemptive: true,
    complexity: 'O(n log n)',
    pros: [
      'Minimum average waiting time for a given set of processes',
      'High throughput'
    ],
    cons: [
      'Starvation: Long processes may never execute',
      'Burst time must be known in advance (difficult in practice)',
      'Not fair to long-running jobs'
    ],
    useCases: [
      'Long-term scheduling in batch systems',
      'Scenarios where burst times can be estimated'
    ],
    steps: [
      'Maintain a list of processes that have arrived.',
      'Pick the process with the smallest burst time.',
      'If preemptive, check at every arrival if a shorter job arrived.',
      'Execute the selected process.'
    ],
    mathematicalIntuition: 'By executing short jobs first, we reduce the amount of time other processes spent waiting in the queue. This mathematically minimizes the average waiting time across all processes.',
    edgeCases: [
      'Continuous stream of short jobs (causes starvation of long jobs)',
      'Identical burst times (tie broken by arrival time)'
    ],
    starvationInfo: 'Long-duration processes can suffer from starvation if short processes keep arriving in the system, as the scheduler will always prioritize the shorter tasks.'
  },
  {
    id: 'priority',
    name: 'Priority Scheduling',
    shortName: 'Priority',
    description: 'Executes processes based on assigned priority levels.',
    detailedDescription: 'Each process is assigned a priority. The CPU is allocated to the process with the highest priority. It can be preemptive or non-preemptive.',
    isPreemptive: false,
    canBePreemptive: true,
    complexity: 'O(n log n)',
    pros: [
      'Supports critical tasks that need urgent execution',
      'Flexible and customizable'
    ],
    cons: [
      'Starvation: Low priority processes may wait indefinitely',
      'Complexity in assigning priority'
    ],
    useCases: [
      'Real-time operating systems',
      'Systems with critical background tasks'
    ],
    steps: [
      'Sort ready processes by priority level.',
      'Select the highest priority process (usually lowest numerical value).',
      'If preemptive, an arriving higher priority process will interrupt current.',
      'Execute until completion or preemption.'
    ],
    mathematicalIntuition: 'Priority scheduling models the real-world requirement of urgency. It ensures that regardless of burst time, the most "important" work is completed with minimal latency.',
    edgeCases: [
      'Equal priority processes (FIFO used as tie-breaker)',
      'Preemption by a higher priority process'
    ],
    starvationInfo: 'Low-priority processes can starve. Modern systems resolve this with "Aging," where the priority of a process increases the longer it waits in the ready queue.'
  },
  {
    id: 'round-robin',
    name: 'Round Robin',
    shortName: 'Round Robin',
    description: 'Each process gets a small fixed unit of time (quantum).',
    detailedDescription: 'Round Robin (RR) is a preemptive algorithm where each process is assigned a fixed time slot (quantum) in a cyclic manner.',
    isPreemptive: true,
    canBePreemptive: false,
    complexity: 'O(n)',
    pros: [
      'Fair allocation of CPU time',
      'Excellent for time-sharing and interactive systems',
      'No starvation'
    ],
    cons: [
      'High context switching overhead',
      'Performance depends heavily on the time quantum',
      'Wait time can be high if quantum is large'
    ],
    useCases: [
      'Modern general-purpose operating systems',
      'Multi-user systems'
    ],
    steps: [
      'Processes are kept in a FIFO queue.',
      'CPU is allocated for a fixed time quantum.',
      'If process burst > quantum, it is put back at the end of the queue.',
      'If process burst <= quantum, it completes and exits.'
    ],
    mathematicalIntuition: 'Round Robin ensures a bounded maximum response time. If there are N processes and a quantum Q, no process ever waits more than (N-1) * Q time units.',
    edgeCases: [
      'Quantum larger than all burst times (becomes FCFS)',
      'Quantum very small (excessive context switching overhead)'
    ],
    starvationInfo: 'Starvation is impossible in RR because the circular queue ensures every process gets a turn within a predictable time frame.'
  }
];
