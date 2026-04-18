import type { Process } from '../types';

export const PROCESS_COLORS = [
  '#6366F1',
  '#22C55E',
  '#F59E0B',
  '#EC4899',
  '#8B5CF6',
  '#06B6D4',
  '#F97316',
  '#14B8A6',
  '#E11D48',
  '#A855F7',
];

let idCounter = 0;

export function generateId(): string {
  return `p-${Date.now()}-${++idCounter}`;
}

export function getProcessColor(index: number): string {
  return PROCESS_COLORS[index % PROCESS_COLORS.length];
}

export function formatMetric(value: number): string {
  return value.toFixed(2);
}

export function createDefaultProcesses(): Process[] {
  return [
    { id: generateId(), name: 'P1', arrivalTime: 0, burstTime: 5, priority: 2, color: PROCESS_COLORS[0] },
    { id: generateId(), name: 'P2', arrivalTime: 1, burstTime: 3, priority: 1, color: PROCESS_COLORS[1] },
    { id: generateId(), name: 'P3', arrivalTime: 2, burstTime: 8, priority: 4, color: PROCESS_COLORS[2] },
    { id: generateId(), name: 'P4', arrivalTime: 3, burstTime: 6, priority: 3, color: PROCESS_COLORS[3] },
  ];
}

export function exportToCSV(headers: string[], rows: (string | number)[][], filename: string): void {
  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
