# CPU Scheduling Simulator

A professional-grade, interactive educational platform built with React and TypeScript for visualizing and analyzing CPU scheduling algorithms. This tool allows users to study the intricacies of operating system process management through high-fidelity simulations, real-time metrics, and detailed algorithm breakdowns.

## Core Features

- Learning Mode (Dashboard): In-depth educational content for four foundational scheduling algorithms, including mathematical intuition, edge cases, and starvation analysis.
- Execution Mode (Simulation Lab): A split-screen environment for configuring processes, controlling execution flow, and analyzing real-time performance.
- Study Mode: Step-by-step insight generation that explains why a specific process was selected at any given time unit.
- Real-Time Visualization: Animated Gantt charts with progress tracking and context switch visualization.
- Performance Analytics: Comparative metrics including Average Waiting Time, Average Turnaround Time, CPU Utilization, and Throughput.
- Process Management: Dynamic process database with drag-and-drop support for reordering and color-coded identification.
- Data Persistence: Local history support to save and replay previous simulation scenarios.
- Modern UI: Premium dark/light mode interface built with Tailwind CSS v4 and Framer Motion for smooth transitions.

## Supported Algorithms

- First-Come, First-Served (FCFS): A non-preemptive algorithm that serves processes in their arrival order.
- Shortest Job First (SJF): Optimizes average waiting time by prioritizing processes with the smallest burst time. Supports both preemptive (SRTF) and non-preemptive modes.
- Priority Scheduling: Allocates CPU cycles based on assigned urgency levels. Supports preemptive interruptions by higher-priority tasks.
- Round Robin (RR): Ensures fair CPU time distribution using a fixed time quantum, ideal for time-sharing systems.

## Technical Stack

- Frontend Framework: React 18+
- Language: TypeScript (Strict Type Safety)
- Styling: Tailwind CSS v4 (Custom Design System)
- State Management: Zustand (Modular Store Architecture)
- Animations: Framer Motion
- Iconography: Lucide React
- Routing: React Router v6
- Drag and Drop: dnd-kit
- Progress Management: React Hook Form (where applicable)

## Architecture Overview

The application is structured into two primary modules:

1. Learning Module: Serves as the entry point, providing the conceptual framework and theoretical background for each algorithm.
2. Execution Module: The simulation engine responsible for processing the scheduling logic and generating the execution timeline.

The state is managed atomically using Zustand, ensuring that process updates, simulation parameters, and theme settings are efficiently propagated without unnecessary re-renders. Component-level lazy loading is implemented via React.lazy and Suspense to optimize initial payload delivery.

## Installation and Setup

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm

### Development Environment

1. Clone the repository to your local machine.
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the development server:
   ```bash
   pnpm dev
   ```
4. Build for production:
   ```bash
   pnpm build
   ```

## Development Standards

This project adheres to professional React development practices, including:
- Standardized components with consistent props interfaces.
- CSS variables for theme management.
- Pure scheduling logic separated from UI components for better testability.
- High-fidelity skeleton loaders for asynchronous resource acquisition.
- Error boundaries for runtime stability.


Academic Edition - Developed for Operating Systems Research and Education.
