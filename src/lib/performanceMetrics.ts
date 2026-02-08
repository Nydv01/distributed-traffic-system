import { PerformanceMetrics, RegionId } from '@/types/traffic'
import { NodeProcessingResult } from './regionNode'

export function calculatePerformanceMetrics(
  parallelResults: Map<RegionId, NodeProcessingResult>,
  parallelStartTime: number,
  parallelEndTime: number
): PerformanceMetrics & {
  overheadTime: number
  throughput: number
  loadImbalance: number
  reliability: number
  scalabilityScore: number
} {
  const parallelTime = parallelEndTime - parallelStartTime

  let sequentialTime = 0
  let maxProcessingTime = 0
  let minProcessingTime = Infinity

  const responseLatencies: { region: RegionId; latency: number }[] = []

  let successfulRequests = 0
  let failedRequests = 0

  parallelResults.forEach((result, region) => {
    sequentialTime += result.processingTime

    maxProcessingTime = Math.max(maxProcessingTime, result.processingTime)
    minProcessingTime = Math.min(minProcessingTime, result.processingTime)

    responseLatencies.push({
      region,
      latency: result.processingTime,
    })

    if (result.success) {
      successfulRequests++
    } else {
      failedRequests++
    }
  })

  const numProcessors = parallelResults.size || 1

  const speedupFactor = sequentialTime / parallelTime
  const efficiency = (speedupFactor / numProcessors) * 100

  const overheadTime = parallelTime * numProcessors - sequentialTime
  const throughput = successfulRequests / (parallelTime / 1000)

  const loadImbalance =
    maxProcessingTime === 0
      ? 0
      : (maxProcessingTime - minProcessingTime) / maxProcessingTime

  const reliability = (successfulRequests / numProcessors) * 100

  const scalabilityScore = Math.min(
    100,
    (speedupFactor / numProcessors) * 120
  )

  return {
    sequentialTime,
    parallelTime,
    speedupFactor: round(speedupFactor),
    efficiency: round(efficiency),
    responseLatencies,
    totalRequests: numProcessors,
    successfulRequests,
    failedRequests,
    overheadTime: Math.max(0, Math.round(overheadTime)),
    throughput: round(throughput),
    loadImbalance: round(loadImbalance * 100),
    reliability: round(reliability),
    scalabilityScore: round(scalabilityScore),
  }
}

export function formatSpeedup(speedup: number): string {
  return `${speedup.toFixed(2)}x`
}

export function getSpeedupColor(speedup: number): string {
  if (speedup >= 3.5) return 'text-success'
  if (speedup >= 2.5) return 'text-primary'
  if (speedup >= 1.5) return 'text-warning'
  return 'text-muted-foreground'
}

export function getEfficiencyRating(efficiency: number): {
  label: string
  color: string
} {
  if (efficiency >= 80) return { label: 'Excellent', color: 'text-success' }
  if (efficiency >= 60) return { label: 'Good', color: 'text-primary' }
  if (efficiency >= 40) return { label: 'Fair', color: 'text-warning' }
  return { label: 'Poor', color: 'text-destructive' }
}

export function getScalabilityRating(score: number): string {
  if (score >= 85) return 'Highly Scalable'
  if (score >= 65) return 'Moderately Scalable'
  if (score >= 45) return 'Limited Scalability'
  return 'Poor Scalability'
}

function round(value: number, digits = 2): number {
  return Math.round(value * Math.pow(10, digits)) / Math.pow(10, digits)
}
