import { create } from 'zustand'
import {
  SimulationState,
  SimulationPhase,
  RegionId,
  RegionNode,
  TrafficData,
  RouteResult,
  PerformanceMetrics,
  LogEntry,
  RegionNodeAnalytics,
  SystemAnalytics,
  SelectionStage,
} from '@/types/traffic'
import { createInitialNodes } from '@/lib/regionNode'
import { coordinator } from '@/lib/coordinator'
import { generateId } from '@/lib/utils'

// --- Extra Types (Realism & Control) ---

export type SimulationScenario = 'light' | 'normal' | 'rush' | 'accident'

interface SimulationConfig {
  scenario: SimulationScenario
  seed?: number
}

// --- Store Interface ---

interface TrafficStore extends SimulationState {
  // Config
  scenario: SimulationScenario
  seed?: number

  // Runtime stats
  startedAt: number | null
  finishedAt: number | null

  // Deep analytics
  nodeAnalytics: Record<string, RegionNodeAnalytics>
  systemAnalytics: SystemAnalytics | null

  // UI modes
  projectionMode: boolean
  resultsLocked: boolean
  theme: 'light' | 'dark'

  // Actions
  setPhase: (phase: SimulationPhase) => void
  setSelectionStage: (stage: SelectionStage) => void
  setSource: (source: string | null) => void
  setDestination: (destination: string | null) => void
  setScenario: (scenario: SimulationScenario) => void
  setSeed: (seed?: number) => void

  updateNodeStatus: (region: RegionId, status: RegionNode['status']) => void
  updateNodeResult: (region: RegionId, status: RegionNode['status'], processingTime: number) => void
  updateNodeProgress: (region: RegionId, progress: number) => void
  updateTrafficData: (region: RegionId, data: TrafficData) => void

  // Analytics actions
  updateNodeAnalytics: (regionId: string, data: Partial<RegionNodeAnalytics>) => void
  setSystemAnalytics: (analytics: SystemAnalytics | null) => void
  setProjectionMode: (mode: boolean) => void
  finalizeResults: () => void

  setRouteResult: (route: RouteResult | null) => void
  setMetrics: (metrics: PerformanceMetrics | null) => void

  addLog: (log: LogEntry) => void
  clearLogs: () => void

  setIsRunning: (running: boolean) => void
  setError: (error: string | null) => void
  setTheme: (theme: 'light' | 'dark') => void

  reset: () => void

  // Main action
  startSimulation: () => Promise<void>
}

// --- Initial State ---

const initialState: SimulationState = {
  phase: 'idle',
  selectionStage: 'idle',
  source: null,
  destination: null,
  regions: createInitialNodes(),
  trafficData: {} as Record<RegionId, TrafficData>,
  routeResult: null,
  metrics: null,
  logs: [],
  isRunning: false,
  error: null,
}

// --- Store Implementation ---

export const useTrafficStore = create<TrafficStore>((set, get) => ({
  ...initialState,

  scenario: 'normal',
  seed: undefined,

  startedAt: null,
  finishedAt: null,

  // Analytics
  nodeAnalytics: {},
  systemAnalytics: null,

  // UI modes
  projectionMode: false,
  resultsLocked: false,
  theme: 'dark',

  /* -------------------------
     BASIC SETTERS
  ------------------------- */

  setPhase: (phase) => set({ phase }),

  setSelectionStage: (selectionStage) => set({ selectionStage }),

  setSource: (source) => set({ source }),

  setDestination: (destination) => set({ destination }),

  setScenario: (scenario) => set({ scenario }),

  setSeed: (seed) => set({ seed }),

  setIsRunning: (running) => set({ isRunning: running }),

  setError: (error) => set({ error }),

  setTheme: (theme) => set({ theme }),

  /* -------------------------
     NODE UPDATES
  ------------------------- */

  updateNodeStatus: (region, status) =>
    set((state) => ({
      regions: {
        ...state.regions,
        [region]: {
          ...state.regions[region],
          status,
          lastUpdated: Date.now(),
        },
      },
    })),

  updateNodeResult: (region, status, processingTime) =>
    set((state) => ({
      regions: {
        ...state.regions,
        [region]: {
          ...state.regions[region],
          status,
          processingTime,
          lastUpdated: Date.now(),
        },
      },
    })),

  updateNodeProgress: (region, progress) =>
    set((state) => ({
      regions: {
        ...state.regions,
        [region]: {
          ...state.regions[region],
          trafficLoad: progress,
        },
      },
    })),

  updateTrafficData: (region, data) =>
    set((state) => ({
      trafficData: {
        ...state.trafficData,
        [region]: data,
      },
      regions: {
        ...state.regions,
        [region]: {
          ...state.regions[region],
          congestionScore: data.congestionScore,
          averageSpeed: data.averageSpeed,
          delayFactor: data.delayFactor,
        },
      },
    })),

  /* -------------------------
     ANALYTICS UPDATES
  ------------------------- */

  updateNodeAnalytics: (regionId, data) =>
    set((state) => ({
      nodeAnalytics: {
        ...state.nodeAnalytics,
        [regionId]: {
          ...(state.nodeAnalytics[regionId] || {
            regionId,
            packetsProcessed: 0,
            packetsDropped: 0,
            avgLatency: 0,
            minLatency: 0,
            maxLatency: 0,
            throughput: 0,
            failureRate: 0,
            retryCount: 0,
            startTime: null,
            endTime: null,
            executionTime: 0,
          }),
          ...data,
        },
      },
    })),

  setSystemAnalytics: (analytics) => set({ systemAnalytics: analytics }),

  setProjectionMode: (mode) => set({ projectionMode: mode }),

  finalizeResults: () => set({ resultsLocked: true }),

  /* -------------------------
     RESULTS & METRICS
  ------------------------- */

  setRouteResult: (route) => set({ routeResult: route }),

  setMetrics: (metrics) => set({ metrics }),

  /* -------------------------
     LOGGING
  ------------------------- */

  addLog: (log) =>
    set((state) => ({
      logs: [...state.logs, log],
    })),

  clearLogs: () => set({ logs: [] }),

  /* -------------------------
     RESET
  ------------------------- */

  reset: () =>
    set({
      ...initialState,
      regions: createInitialNodes(),
      logs: [],
      startedAt: null,
      finishedAt: null,
    }),

  /* =========================================================
     MAIN SIMULATION PIPELINE
  ========================================================= */

  startSimulation: async () => {
    const {
      source,
      destination,
      scenario,
      seed,
      addLog,
      setPhase,
      updateNodeStatus,
      updateNodeProgress,
      updateTrafficData,
      setMetrics,
      setRouteResult,
      setIsRunning,
      setError,
    } = get()

    if (!source || !destination) {
      setError('Please select both source and destination')
      return
    }

    // Reset runtime state (but keep config)
    set({
      phase: 'requesting',
      regions: createInitialNodes(),
      trafficData: {} as Record<RegionId, TrafficData>,
      routeResult: null,
      metrics: null,
      logs: [],
      isRunning: true,
      error: null,
      startedAt: Date.now(),
      finishedAt: null,
    })

    addLog({
      id: generateId(),
      timestamp: Date.now(),
      type: 'info',
      source: 'System',
      message: `Simulation started | Scenario=${scenario.toUpperCase()}${seed ? ` | Seed=${seed}` : ''}`,
    })

    coordinator.setCallbacks({
      onPhaseChange: setPhase,
      onLog: addLog,
      onNodeProgress: updateNodeProgress,
      onNodeStatusChange: (region, status, time) => {
        if (time !== undefined) {
          get().updateNodeResult(region, status, time)
        } else {
          get().updateNodeStatus(region, status)
        }
      },
      onTrafficDataReceived: updateTrafficData,
      onMetricsCalculated: setMetrics,
      onRouteCalculated: setRouteResult,
      onError: setError,
    })

    try {
      await coordinator.executeRouteOptimization(source, destination)
      set({ finishedAt: Date.now() })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Simulation failed')
    } finally {
      setIsRunning(false)
    }
  },
}))
