import { RegionNode, TrafficData, RegionId } from '@/types/traffic'
import { REGIONS, REGION_IDS, REGION_MAP } from './designTokens'
import { generateTrafficData } from './trafficSimulation'
import { delay, randomBetween } from './utils'

const MIN_PROCESSING_TIME = 400
const MAX_PROCESSING_TIME = 1500
const NODE_FAILURE_RATE = 0.02

const REGION_COMPLEXITY: Record<RegionId, number> = {
  north_india: 1.0,
  south_india: 0.9,
  east_india: 1.2,
  west_india: 1.1,
  central_india: 1.0,
  northeast_india: 1.15,
}

export interface NodeProcessingResult {
  success: boolean
  trafficData: TrafficData | null
  processingTime: number
  stepsCompleted: number
  failureType?: 'timeout' | 'compute' | 'network'
  retryable?: boolean
  error?: string
}

export function createInitialNode(id: RegionId): RegionNode {
  const config = REGION_MAP[id]

  return {
    id,
    name: config?.name ?? `${id} Region`,
    status: 'idle',
    trafficLoad: 0,
    processingTime: 0,
    congestionScore: 0,
    averageSpeed: 0,
    delayFactor: 1,
    lastUpdated: Date.now(),
  }
}

export function createInitialNodes(): Record<RegionId, RegionNode> {
  const nodes = {} as Record<RegionId, RegionNode>

  for (const region of REGIONS) {
    nodes[region.id] = createInitialNode(region.id)
  }

  return nodes
}

export async function processRegionNode(
  region: RegionId,
  onProgress?: (progress: number) => void,
  forceSuccess = false
): Promise<NodeProcessingResult> {
  const startTime = Date.now()

  const complexity = REGION_COMPLEXITY[region]
  const baseTime = randomBetween(MIN_PROCESSING_TIME, MAX_PROCESSING_TIME)
  const totalTime = baseTime * complexity

  const steps = 6
  let completedSteps = 0

  for (let step = 1; step <= steps; step++) {
    const cpuTime = totalTime * 0.12
    const ioWait = totalTime * 0.05

    await delay(cpuTime + randomBetween(0, ioWait))

    completedSteps++

    const progress =
      Math.min(100, Math.round((Math.pow(step / steps, 1.3)) * 100))

    onProgress?.(progress)

    if (
      !forceSuccess &&
      step < steps &&
      Math.random() < NODE_FAILURE_RATE / steps
    ) {
      const failureType =
        Math.random() < 0.4
          ? 'network'
          : Math.random() < 0.7
            ? 'timeout'
            : 'compute'

      return {
        success: false,
        trafficData: null,
        processingTime: Date.now() - startTime,
        stepsCompleted: completedSteps,
        failureType,
        retryable: failureType !== 'compute',
        error: `Region ${region} failed due to ${failureType} error`,
      }
    }
  }

  const trafficData = generateTrafficData(region)

  return {
    success: true,
    trafficData,
    processingTime: Date.now() - startTime,
    stepsCompleted: steps,
  }
}

export async function processAllRegionsParallel(
  onNodeProgress?: (region: RegionId, progress: number) => void,
  onNodeComplete?: (region: RegionId, result: NodeProcessingResult) => void
): Promise<Map<RegionId, NodeProcessingResult>> {
  const promises = REGION_IDS.map(async region => {
    const result = await processRegionNode(
      region,
      progress => onNodeProgress?.(region, progress)
    )

    onNodeComplete?.(region, result)
    return { region, result }
  })

  const results = await Promise.all(promises)

  const map = new Map<RegionId, NodeProcessingResult>()
  results.forEach(r => map.set(r.region, r.result))

  return map
}

export async function processAllRegionsSequential(
  onNodeProgress?: (region: RegionId, progress: number) => void,
  onNodeComplete?: (region: RegionId, result: NodeProcessingResult) => void
): Promise<Map<RegionId, NodeProcessingResult>> {
  const map = new Map<RegionId, NodeProcessingResult>()

  for (const region of REGION_IDS) {
    const result = await processRegionNode(
      region,
      progress => onNodeProgress?.(region, progress),
      true
    )

    onNodeComplete?.(region, result)
    map.set(region, result)
  }

  return map
}
