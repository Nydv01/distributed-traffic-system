import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/* ============================================================
   CLASSNAME UTILS
============================================================ */

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/* ============================================================
   ID & RANDOMNESS (IMPROVED)
============================================================ */

/**
 * Safer ID generator (timestamp + randomness)
 * Prevents collisions during fast parallel events
 */
export function generateId(prefix: string = ''): string {
  const rand = Math.random().toString(36).slice(2, 8)
  const time = Date.now().toString(36)
  return `${prefix}${time}-${rand}`
}

/**
 * Optional seeded random generator
 * Useful for reproducible demos / evaluations
 */
let RANDOM_SEED = Math.random()

export function setRandomSeed(seed: number) {
  RANDOM_SEED = seed
}

function seededRandom() {
  const x = Math.sin(RANDOM_SEED++) * 10000
  return x - Math.floor(x)
}

export function randomBetween(
  min: number,
  max: number,
  seeded: boolean = false
): number {
  const r = seeded ? seededRandom() : Math.random()
  return r * (max - min) + min
}

export function randomInt(
  min: number,
  max: number,
  seeded: boolean = false
): number {
  return Math.floor(randomBetween(min, max + 1, seeded))
}

/* ============================================================
   ASYNC / TIMING
============================================================ */

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * High precision timer (for metrics)
 */
export function now(): number {
  return performance.now()
}

/* ============================================================
   TIME FORMATTING
============================================================ */

export function formatTime(ms: number): string {
  if (ms < 1000) return `${ms.toFixed(0)} ms`
  if (ms < 60_000) return `${(ms / 1000).toFixed(2)} s`
  return `${(ms / 60000).toFixed(1)} min`
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

/**
 * Relative time: "2s ago", "1.4s ago"
 */
export function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp
  if (diff < 1000) return 'just now'
  if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`
  return `${Math.floor(diff / 60000)}m ago`
}

/* ============================================================
   CONGESTION HELPERS (RICH METADATA)
============================================================ */

export type CongestionLevel = 'low' | 'medium' | 'high' | 'severe'

export const CONGESTION_META: Record<CongestionLevel, {
  label: string
  color: string
  bg: string
  severity: number
}> = {
  low: {
    label: 'Low',
    color: 'text-success',
    bg: 'bg-success',
    severity: 1,
  },
  medium: {
    label: 'Medium',
    color: 'text-warning',
    bg: 'bg-warning',
    severity: 2,
  },
  high: {
    label: 'High',
    color: 'text-orange-500',
    bg: 'bg-orange-500',
    severity: 3,
  },
  severe: {
    label: 'Severe',
    color: 'text-destructive',
    bg: 'bg-destructive',
    severity: 4,
  },
}

export function getCongestionColor(level: CongestionLevel) {
  return CONGESTION_META[level].color
}

export function getCongestionBgColor(level: CongestionLevel) {
  return CONGESTION_META[level].bg
}

/* ============================================================
   NODE STATUS HELPERS
============================================================ */

export type NodeStatus = 'idle' | 'processing' | 'success' | 'failed'

export const STATUS_META: Record<NodeStatus, {
  label: string
  color: string
}> = {
  idle: {
    label: 'Idle',
    color: 'bg-muted-foreground',
  },
  processing: {
    label: 'Processing',
    color: 'bg-primary',
  },
  success: {
    label: 'Completed',
    color: 'bg-success',
  },
  failed: {
    label: 'Failed',
    color: 'bg-destructive',
  },
}

export function getStatusColor(status: NodeStatus): string {
  return STATUS_META[status].color
}

/* ============================================================
   REGION METADATA (UI + LOGIC)
============================================================ */

export type RegionId = 'north' | 'south' | 'east' | 'west'

export const REGION_META: Record<RegionId, {
  label: string
  bg: string
  text: string
  icon: string
}> = {
  north: {
    label: 'North',
    bg: 'bg-region-north',
    text: 'text-region-north',
    icon: '🏔️',
  },
  south: {
    label: 'South',
    bg: 'bg-region-south',
    text: 'text-region-south',
    icon: '🏖️',
  },
  east: {
    label: 'East',
    bg: 'bg-region-east',
    text: 'text-region-east',
    icon: '🏭',
  },
  west: {
    label: 'West',
    bg: 'bg-region-west',
    text: 'text-region-west',
    icon: '🏜️',
  },
}

export function getRegionColor(region: RegionId): string {
  return REGION_META[region].bg
}

export function getRegionTextColor(region: RegionId): string {
  return REGION_META[region].text
}

export function getRegionIcon(region: RegionId): string {
  return REGION_META[region].icon
}
