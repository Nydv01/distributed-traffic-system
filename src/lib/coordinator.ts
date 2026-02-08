import {
  RegionId,
  TrafficData,
  RouteResult,
  LogEntry,
  PerformanceMetrics,
  SimulationPhase,
} from '@/types/traffic'

import { REGION_IDS } from './designTokens'
import { rpcSimulator } from './rpcSimulator'
import { processAllRegionsParallel, NodeProcessingResult } from './regionNode'
import { createGraph, updateEdgeWeights, dijkstra, LOCATIONS } from './routeOptimization'
import { calculatePerformanceMetrics } from './performanceMetrics'
import { generateId, delay } from './utils'

export interface CoordinatorCallbacks {
  onPhaseChange: (phase: SimulationPhase) => void
  onLog: (log: LogEntry) => void
  onNodeProgress: (region: RegionId, progress: number) => void
  onNodeStatusChange: (
    region: RegionId,
    status: 'idle' | 'processing' | 'success' | 'failed',
    processingTime?: number
  ) => void
  onTrafficDataReceived: (region: RegionId, data: TrafficData) => void
  onMetricsCalculated: (metrics: PerformanceMetrics) => void
  onRouteCalculated: (route: RouteResult) => void
  onError: (error: string) => void
}

class Coordinator {
  private callbacks: CoordinatorCallbacks | null = null
  private trafficCache = new Map<RegionId, TrafficData>()

  setCallbacks(callbacks: CoordinatorCallbacks) {
    this.callbacks = callbacks
  }

  private log(
    type: LogEntry['type'],
    source: string,
    message: string,
    details?: unknown
  ) {
    this.callbacks?.onLog({
      id: generateId(),
      timestamp: Date.now(),
      type,
      source,
      message,
      details,
    })
  }

  async executeRouteOptimization(
    sourceId: string,
    destinationId: string
  ): Promise<{ route: RouteResult | null; metrics: PerformanceMetrics | null }> {
    const regions = REGION_IDS

    try {
      this.callbacks?.onPhaseChange('requesting')
      this.log('info', 'Coordinator', 'Route optimization request accepted')

      const sourceName = LOCATIONS.find(l => l.id === sourceId)?.name
      const destName = LOCATIONS.find(l => l.id === destinationId)?.name

      this.log('info', 'Coordinator', `Source selected: ${sourceName}`)
      this.log('info', 'Coordinator', `Destination selected: ${destName}`)

      await delay(300)

      this.log('rpc', 'Coordinator', 'Broadcasting traffic requests to all regions')

      rpcSimulator.setCallbacks({
        onRequestSent: req =>
          this.log('rpc', 'Coordinator', `RPC sent → ${req.to.toUpperCase()}`),

        onProcessing: req =>
          this.callbacks?.onNodeStatusChange(req.to as RegionId, 'processing'),

        onResponseReceived: res =>
          this.log(
            'success',
            res.from.toUpperCase(),
            `Response received (${res.processingTime} ms)`
          ),

        onError: (req, error) =>
          this.log('error', req.to.toUpperCase(), error),
      })

      this.callbacks?.onPhaseChange('processing')
      this.log('info', 'Coordinator', 'Executing parallel computation on region nodes')

      regions.forEach(r => {
        this.callbacks?.onNodeStatusChange(r, 'processing')
        this.callbacks?.onNodeProgress(r, 0)
      })

      const parallelStart = Date.now()

      const results = await processAllRegionsParallel(
        (region, progress) => this.callbacks?.onNodeProgress(region, progress),
        (region, result) => this.handleNodeResult(region, result)
      )

      const parallelEnd = Date.now()

      const metrics = calculatePerformanceMetrics(
        results,
        parallelStart,
        parallelEnd
      )

      this.callbacks?.onMetricsCalculated(metrics)

      this.log(
        'sync',
        'Coordinator',
        `Parallel barrier reached in ${metrics.parallelTime} ms`
      )
      this.log(
        'info',
        'Coordinator',
        `Sequential equivalent time: ${metrics.sequentialTime} ms`
      )
      this.log(
        'success',
        'Coordinator',
        `Speedup achieved: ${metrics.speedupFactor}x`
      )

      this.callbacks?.onPhaseChange('aggregating')
      this.log('info', 'Coordinator', 'Aggregating regional traffic data')

      await delay(400)

      const aggregatedTraffic: Record<RegionId, TrafficData> =
        {} as Record<RegionId, TrafficData>

      for (const [region, result] of results) {
        if (result.success && result.trafficData) {
          aggregatedTraffic[region] = result.trafficData
        } else if (this.trafficCache.has(region)) {
          aggregatedTraffic[region] = this.trafficCache.get(region)!
          this.log(
            'warning',
            'Coordinator',
            `Using cached traffic data for ${region}`
          )
        } else {
          const { generateTrafficData } = await import('./trafficSimulation')
          aggregatedTraffic[region] = generateTrafficData(region, { preset: 'normal' })
          this.log(
            'warning',
            'Coordinator',
            `Generated fallback traffic data for ${region}`
          )
        }
      }

      this.callbacks?.onPhaseChange('optimizing')
      this.log('info', 'Coordinator', 'Applying Dijkstra route optimization')

      await delay(300)

      let graph = createGraph()
      graph = updateEdgeWeights(graph, aggregatedTraffic)

      const route = dijkstra(graph, sourceId, destinationId)

      if (!route) {
        throw new Error('No valid route found between selected locations')
      }

      this.log('success', 'Coordinator', 'Optimal route successfully calculated')
      this.log('info', 'Coordinator', route.path.join(' → '))

      this.callbacks?.onPhaseChange('complete')
      this.callbacks?.onRouteCalculated(route)

      return { route, metrics }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected error'
      this.log('error', 'Coordinator', message)
      this.callbacks?.onError(message)
      return { route: null, metrics: null }
    }
  }

  private handleNodeResult(region: RegionId, result: NodeProcessingResult) {
    if (result.success && result.trafficData) {
      this.trafficCache.set(region, result.trafficData)
      this.callbacks?.onNodeStatusChange(region, 'success', result.processingTime)
      this.callbacks?.onTrafficDataReceived(region, result.trafficData)
    } else {
      this.callbacks?.onNodeStatusChange(region, 'failed', result.processingTime)
      this.log(
        'warning',
        'Coordinator',
        `Region ${region} failed — attempting fallback`
      )
    }
  }

  clearCache() {
    this.trafficCache.clear()
  }
}

export const coordinator = new Coordinator()
