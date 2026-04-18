import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useProcessStore } from '../store/useProcessStore';
import { useSimulationStore } from '../store/useSimulationStore';
import type { Process } from '../types';
import { Trash2, GripVertical, Plus } from 'lucide-react';

interface SortableRowProps {
  process: Process;
  onUpdate: (id: string, updates: Partial<Process>) => void;
  onRemove: (id: string) => void;
  showPriority: boolean;
}

const SortableRow: React.FC<SortableRowProps> = ({ process, onUpdate, onRemove, showPriority }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: process.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    boxShadow: isDragging ? '0 10px 15px -3px rgba(0, 0, 0, 0.5)' : 'none',
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? 'bg-primary/10 border-primary/50' : 'hover:bg-white/5 border-white/5'} border-b transition-colors group`}
    >
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-text-muted hover:text-text-primary">
            <GripVertical size={16} />
          </button>
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: process.color }} />
          <span className="font-bold text-[11px] text-text-primary uppercase tracking-tighter">{process.name}</span>
        </div>
      </td>
      <td className="py-3 px-4 text-center">
        <input
          type="number"
          min="0"
          value={process.arrivalTime}
          onChange={(e) => onUpdate(process.id, { arrivalTime: parseInt(e.target.value) || 0 })}
          className="w-14 bg-card/60 border border-white/5 mx-auto rounded-lg px-2 py-1.5 text-xs text-center font-bold focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
        />
      </td>
      <td className="py-3 px-4 text-center">
        <input
          type="number"
          min="1"
          value={process.burstTime}
          onChange={(e) => onUpdate(process.id, { burstTime: parseInt(e.target.value) || 1 })}
          className="w-14 bg-card/60 border border-white/5 mx-auto rounded-lg px-2 py-1.5 text-xs text-center font-bold focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
        />
      </td>
      {showPriority && (
        <td className="py-3 px-4 text-center">
          <input
            type="number"
            min="1"
            value={process.priority}
            onChange={(e) => onUpdate(process.id, { priority: parseInt(e.target.value) || 1 })}
            className="w-14 bg-card/60 border border-white/5 mx-auto rounded-lg px-2 py-1.5 text-xs text-center font-bold focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
          />
        </td>
      )}
      <td className="py-3 px-4 text-right">
        <button
          onClick={() => onRemove(process.id)}
          className="p-2 text-text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={14} />
        </button>
      </td>
    </tr>
  );
};

export const ProcessTable: React.FC = () => {
  const { processes, setProcesses, updateProcess, removeProcess, addProcess } = useProcessStore();
  const { selectedAlgorithmId } = useSimulationStore();
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = processes.findIndex((p) => p.id === active.id);
      const newIndex = processes.findIndex((p) => p.id === over.id);
      setProcesses(arrayMove(processes, oldIndex, newIndex));
    }
  };

  const showPriority = selectedAlgorithmId === 'priority';

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="py-3 px-4 text-[10px] font-black text-text-muted uppercase tracking-widest">ID</th>
                <th className="py-3 px-4 text-[10px] font-black text-text-muted uppercase tracking-widest text-center">Arrival</th>
                <th className="py-3 px-4 text-[10px] font-black text-text-muted uppercase tracking-widest text-center">Burst</th>
                {showPriority && <th className="py-3 px-4 text-[10px] font-black text-text-muted uppercase tracking-widest text-center">Pri</th>}
                <th className="py-3 px-4 text-[10px] font-black text-text-muted uppercase tracking-widest text-right px-8">
                  <button 
                    onClick={addProcess}
                    className="p-1.5 bg-primary/20 text-primary hover:bg-primary hover:text-white rounded-lg transition-all"
                    title="Add Process"
                  >
                    <Plus size={14} />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              <SortableContext
                items={processes.map(p => p.id)}
                strategy={verticalListSortingStrategy}
              >
                {processes.map((p) => (
                  <SortableRow
                    key={p.id}
                    process={p}
                    onUpdate={updateProcess}
                    onRemove={removeProcess}
                    showPriority={showPriority}
                  />
                ))}
              </SortableContext>
            </tbody>
          </table>
        </DndContext>
        {processes.length === 0 && (
          <div className="py-12 text-center text-text-muted text-xs font-bold uppercase tracking-widest flex flex-col gap-4">
            <div className="w-12 h-12 bg-white/5 rounded-full border border-dashed border-white/10 flex items-center justify-center mx-auto">
               <Database className="opacity-20" size={20} />
            </div>
            Empty Database
          </div>
        )}
      </div>
    </div>
  );
};

const Database = ({ className, size }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <ellipse cx="12" cy="5" rx="9" ry="3"/>
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
  </svg>
);
