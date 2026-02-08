import { RoadSegment, TrafficData, RegionId } from '@/types/traffic'
import { generateId } from './utils'

export type TrafficPreset = 'light' | 'normal' | 'rush' | 'accident'

export interface TrafficConfig {
  preset: TrafficPreset
  seed?: number
}

const PRESETS: Record<TrafficPreset, {
  densityRange: [number, number]
  speedPenalty: number
  roadCount: [number, number]
}> = {
  light: {
    densityRange: [10, 30],
    speedPenalty: 0.3,
    roadCount: [3, 4],
  },
  normal: {
    densityRange: [30, 55],
    speedPenalty: 0.45,
    roadCount: [3, 5],
  },
  rush: {
    densityRange: [55, 85],
    speedPenalty: 0.65,
    roadCount: [4, 6],
  },
  accident: {
    densityRange: [70, 100],
    speedPenalty: 0.85,
    roadCount: [4, 6],
  },
}

const ROAD_NAMES: Record<RegionId, string[]> = {
  north_india: ['Delhi Ring Road', 'NH-44 Highway', 'Grand Trunk Road', 'Outer Ring Road', 'Yamuna Expressway'],
  south_india: ['OMR Expressway', 'Bangalore-Chennai Highway', 'Marine Drive', 'Hosur Road', 'ECR Coastal Road'],
  east_india: ['Kolkata Bypass', 'NH-16 Highway', 'Salt Lake Sector V Road', 'Park Street', 'EM Bypass'],
  west_india: ['Mumbai-Pune Expressway', 'Western Express Highway', 'SV Road', 'Palm Beach Road', 'JVLR'],
  central_india: ['NH-7 Highway', 'Nagpur-Hyderabad Road', 'VIP Road', 'MP Expressway', 'Bhopal Bypass'],
  northeast_india: ['NH-37 Highway', 'Guwahati Bypass', 'GS Road', 'AT Road', 'Shillong Expressway'],
}

function mulberry32(seed: number) {
  let t = seed
  return function () {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), t | 1)
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

function rand(rng: () => number, min: number, max: number) {
  return min + rng() * (max - min)
}

function randInt(rng: () => number, min: number, max: number) {
  return Math.floor(rand(rng, min, max + 1))
}

function getCongestionLevel(density: number): 'low' | 'medium' | 'high' | 'severe' {
  if (density < 25) return 'low'
  if (density < 50) return 'medium'
  if (density < 75) return 'high'
  return 'severe'
}

function generateRoadSegment(
  region: RegionId,
  index: number,
  preset: TrafficPreset,
  rng: () => number
): RoadSegment {
  const presetCfg = PRESETS[preset]
  const roadNames = ROAD_NAMES[region]

  const vehicleDensity = rand(rng, presetCfg.densityRange[0], presetCfg.densityRange[1])
  const maxSpeed = randInt(rng, 60, 100)

  const congestionFactor = vehicleDensity / 100
  const speedReduction = congestionFactor * presetCfg.speedPenalty
  const currentSpeed = Math.max(
    15,
    Math.round(maxSpeed * (1 - speedReduction))
  )

  return {
    id: generateId(),
    name: roadNames[index % roadNames.length],
    distance: rand(rng, 2, 15),
    vehicleDensity,
    maxSpeed,
    currentSpeed,
    congestionLevel: getCongestionLevel(vehicleDensity),
    region,
  }
}

export function generateTrafficData(
  region: RegionId,
  config: TrafficConfig = { preset: 'normal' }
): TrafficData {
  const preset = config.preset ?? 'normal'
  const rng = config.seed !== undefined ? mulberry32(config.seed) : Math.random

  const presetCfg = PRESETS[preset]
  const roadCount = randInt(rng, presetCfg.roadCount[0], presetCfg.roadCount[1])

  const roads: RoadSegment[] = []
  for (let i = 0; i < roadCount; i++) {
    roads.push(generateRoadSegment(region, i, preset, rng))
  }

  const avgSpeed =
    roads.reduce((sum, r) => sum + r.currentSpeed, 0) / roads.length

  const avgDensity =
    roads.reduce((sum, r) => sum + r.vehicleDensity, 0) / roads.length

  const delayFactor =
    1 +
    (avgDensity / 100) *
    (preset === 'accident' ? 3 : preset === 'rush' ? 2.2 : 1.5)

  return {
    region,
    roads,
    averageSpeed: Math.round(avgSpeed * 10) / 10,
    congestionScore: Math.round(avgDensity * 10) / 10,
    delayFactor: Math.round(delayFactor * 100) / 100,
    timestamp: Date.now(),
  }
}

import { REGION_IDS } from './designTokens'

export function generateAllRegionsTraffic(
  config: TrafficConfig = { preset: 'normal' }
): Record<RegionId, TrafficData> {
  const result = {} as Record<RegionId, TrafficData>

  for (const regionId of REGION_IDS) {
    result[regionId] = generateTrafficData(regionId, config)
  }

  return result
}

export function calculateRegionCongestion(data: TrafficData): number {
  return data.congestionScore
}

export function getOverallCongestion(
  traffic: Record<RegionId, TrafficData>
): 'low' | 'medium' | 'high' | 'severe' {
  const values = Object.values(traffic)
  const avg = values.reduce((sum, t) => sum + t.congestionScore, 0) / values.length
  return getCongestionLevel(avg)
}
