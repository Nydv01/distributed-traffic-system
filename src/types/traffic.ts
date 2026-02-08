/* ============================================================
   REGION & NODE TYPES
============================================================ */

// Import RegionId from centralized config
export type { RegionId } from '@/lib/designTokens'
import type { RegionId } from '@/lib/designTokens'

export type NodeStatus =
  | 'idle'
  | 'processing'
  | 'success'
  | 'failed';

export interface RegionNode {
  id: RegionId;
  name: string;

  status: NodeStatus;

  trafficLoad: number;        // 0–100 %
  processingTime: number;     // ms

  congestionScore: number;    // 0–100
  averageSpeed: number;       // km/h
  delayFactor: number;        // multiplier (>=1)

  lastUpdated: number;        // timestamp
}

/* ============================================================
   DEEP ANALYTICS TYPES
============================================================ */

/**
 * Per-node deep analytics for projection mode
 */
export interface RegionNodeAnalytics {
  regionId: string;  // state ID (e.g., 'delhi', 'maharashtra')

  // Packet metrics
  packetsProcessed: number;
  packetsDropped: number;

  // Latency metrics (ms)
  avgLatency: number;
  minLatency: number;
  maxLatency: number;

  // Performance metrics
  throughput: number;         // packets/second
  failureRate: number;        // 0–100%
  retryCount: number;

  // Timing
  startTime: number | null;
  endTime: number | null;
  executionTime: number;      // ms
}

/**
 * System-wide aggregate analytics
 */
export interface SystemAnalytics {
  totalLoad: number;              // sum across all nodes
  peakCongestion: number;         // highest region score
  avgCongestion: number;          // average across regions
  efficiencyPercent: number;      // parallel efficiency
  resourceUtilization: number;    // 0–100%

  nodesTotal: number;
  nodesCompleted: number;
  nodesFailed: number;
  nodesProcessing: number;

  totalPacketsProcessed: number;
  totalPacketsDropped: number;
  overallThroughput: number;      // aggregate packets/sec
}

/**
 * Complete simulation report for PDF export
 */
export interface SimulationReport {
  id: string;
  generatedAt: number;

  // Simulation config
  mode: 'parallel' | 'sequential';
  source: string;
  destination: string;

  // Results
  metrics: PerformanceMetrics;
  systemAnalytics: SystemAnalytics;
  nodeAnalytics: Record<string, RegionNodeAnalytics>;
  routeResult: RouteResult | null;

  // Metadata
  simulationDuration: number;     // ms
  regionsProcessed: string[];
}

/* ============================================================
   TRAFFIC DATA TYPES
============================================================ */

export type CongestionLevel = 'low' | 'medium' | 'high' | 'severe';

export interface RoadSegment {
  id: string;
  name: string;

  region: RegionId;

  distance: number;           // km
  vehicleDensity: number;     // vehicles/km
  currentSpeed: number;       // km/h
  maxSpeed: number;           // km/h

  congestionLevel: CongestionLevel;
}

export interface TrafficData {
  region: RegionId;

  roads: RoadSegment[];

  averageSpeed: number;       // km/h
  congestionScore: number;    // 0–100
  delayFactor: number;        // >=1

  timestamp: number;
}

/* ============================================================
   RPC (REMOTE PROCEDURE CALL) TYPES
============================================================ */

export type RPCType =
  | 'TRAFFIC_REQUEST'
  | 'ROUTE_REQUEST'
  | 'SYNC_REQUEST';

export interface RPCRequest<T = unknown> {
  id: string;
  from: string;
  to: RegionId | string;

  type: RPCType;
  payload: T;

  timestamp: number;
}

export interface RPCResponse<T = unknown> {
  id: string;
  requestId: string;

  from: RegionId | string;
  to: string;

  success: boolean;

  data?: T;
  error?: string;

  processingTime: number; // ms
  timestamp: number;
}

/* ============================================================
   ROUTE & GRAPH TYPES
============================================================ */

export interface Location {
  id: string;
  name: string;

  region: RegionId;

  x: number;   // UI coordinate (0–100)
  y: number;   // UI coordinate (0–100)
}

export interface RouteEdge {
  from: string;
  to: string;

  distance: number;        // km

  baseWeight: number;      // static cost
  dynamicWeight: number;  // cost + congestion
  congestionDelay: number;
}

export interface RouteResult {
  path: string[];                // location names
  pathIds: string[];             // location IDs

  totalDistance: number;         // km
  estimatedTime: number;         // minutes

  congestionLevel: CongestionLevel;
  affectedRegions: RegionId[];
}

/* ============================================================
   PERFORMANCE METRICS
============================================================ */

export interface LatencyMetric {
  region: RegionId;
  latency: number; // ms
}

export interface PerformanceMetrics {
  sequentialTime: number;   // ms
  parallelTime: number;     // ms

  speedupFactor: number;    // e.g. 3.2x
  efficiency: number;       // %

  responseLatencies: LatencyMetric[];

  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
}

/* ============================================================
   LOGGING TYPES
============================================================ */

export type LogType =
  | 'info'
  | 'rpc'
  | 'success'
  | 'error'
  | 'warning'
  | 'sync';

export interface LogEntry<T = unknown> {
  id: string;
  timestamp: number;

  type: LogType;
  source: string;
  message: string;
  region?: RegionId;

  details?: T;
}

/* ============================================================
   SIMULATION STATE
============================================================ */

export type SimulationPhase =
  | 'idle'
  | 'input'
  | 'requesting'
  | 'processing'
  | 'aggregating'
  | 'optimizing'
  | 'complete';

export type SelectionStage = 'idle' | 'picking-source' | 'picking-destination';

export interface SimulationState {
  phase: SimulationPhase;
  selectionStage: SelectionStage;

  source: string | null;
  destination: string | null;

  regions: Record<RegionId, RegionNode>;
  trafficData: Partial<Record<RegionId, TrafficData>>;

  routeResult: RouteResult | null;
  metrics: PerformanceMetrics | null;

  logs: LogEntry[];

  isRunning: boolean;
  error: string | null;
}

/* ============================================================
   GRAPH TYPES (DIJKSTRA)
============================================================ */

export interface GraphNode {
  id: string;
  name: string;
  region: RegionId;
}

export interface Graph {
  nodes: GraphNode[];
  edges: RouteEdge[];
}
