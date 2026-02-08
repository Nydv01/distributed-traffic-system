# 🚦 Distributed Traffic System

A high-performance, distributed computing simulation designed to optimize traffic flow across India's major metropolitan regions. This system demonstrates the power of parallel processing and distributed consensus algorithms in solving complex, real-time routing problems.

---

## 🚀 Project Overview

The **Distributed Traffic System (DTS)** allows users to simulate and visualize traffic data processing across multiple regional nodes (North, South, East, West, Central, Northeast). It uses a leader-follower architecture where edge nodes process local telemetry data in parallel, while a central coordinator aggregates results to calculate the optimal path using a dynamic, traffic-aware Dijkstra algorithm.

### Core Capabilities
-   **Parallel Execution Engine**: Simulates concurrent data processing across 6 regional nodes, demonstrating significant speedup over sequential methods.
-   **Dynamic Pathfinding**: Real-time routing that adapts to changing congestion levels, road incidents, and node latency.
-   **Resilient RPC Layer**: A simulated Remote Procedure Call (RPC) system that handles network latency, packet loss, and automatic retries with exponential backoff.
-   **Immersive Visualization**: A premium 3D and 2D interface featuring a dynamic map of India, real-time metric dashboards, and cinematic data flow animations.

---

## 🏗️ System Architecture

The application is built on a robust React-based frontend that mimics a full-stack distributed system environment.

### 1. Distributed Coordinator Pattern
The system acts as a central "Brain" (Coordinator) that dispatches tasks to isolated "Edge Nodes".
-   **Coordinator**: Manages the global state, initiates route requests, and aggregates responses.
-   **Edge Nodes**: Autonomous workers that generate varying traffic conditions (congestion, flow rate, incidents) based on their region's characteristics.

### 2. Algorithmic Core
We utilize a modified **Dijkstra’s Algorithm** where edge weights are not static distances but dynamic "Travel Costs":
$$ Cost = \frac{Distance}{Speed \times (1 - Congestion)} + \text{LatencyPenalty} $$
This ensures the system routes around congestion even if the path is physically shorter.

### 3. Performance Metrics
Real-time comparison of execution strategies:
-   **Speedup Factor**: $T_{sequential} / T_{parallel}$
-   **Efficiency**: Resource utilization across the distributed cluster.
-   **Latency Analysis**: Per-node response times including network jitter simulation.

---

## 🛠️ Technology Stack

-   **Frontend**: React 18, TypeScript, Vite
-   **State Management**: Zustand, TanStack Query
-   **Visuals & 3D**: Three.js (via React Three Fiber), Framer Motion, Tailwind CSS
-   **UI Components**: Radix UI, Lucide React
-   **Charts**: Recharts, Custom SVG visualizations

---

## 🏁 Getting Started

1.  **Installation**
    ```bash
    npm install
    ```

2.  **Development Server**
    ```bash
    npm run dev
    ```

3.  **Run Tests**
    ```bash
    npm test
    ```

---

## 🌟 Key Features

-   **Cinematic Intro & UI**: A high-fidelity "glassmorphism" interface with fluid transitions and physics-based interactions.
-   **Interactive Simulation**: Users can trigger specific scenarios (Rush Hour, Accidents) and watch how the network reacts.
-   **Detailed Analytics**: Exportable PDF reports and deep-dive logs into every RPC call and state change.
-   **Fault Tolerance**: The system demonstrates circuit breaking logic—if a region fails, the system reroutes or retries automatically.

---

## 🔮 Roadmap

-   **WebSocket Integration**: Connect to a real backend for live multi-user simulations.
-   **Machine Learning**: Implement predictive traffic models based on historical simulation data.
-   **Mobile App**: React Native view for field agents.