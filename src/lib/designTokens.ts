/**
 * Design Tokens - Centralized UI Constants
 * 
 * This module provides type-safe design tokens for motion, colors,
 * and other UI constants used throughout the application.
 */

// --- Motion Tokens ---

export const MOTION = {
    /** Standard enter animation timing */
    enter: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1] as const,
    },
    /** Exit animation timing */
    exit: {
        duration: 0.25,
        ease: [0.4, 0, 1, 1] as const,
    },
    /** Subtle pulse for processing states */
    pulse: {
        duration: 1.5,
        ease: 'easeInOut' as const,
    },
    /** Progress bar animations */
    progress: {
        duration: 0.35,
        ease: 'easeOut' as const,
    },
    /** Stagger delay between children */
    stagger: 0.08,
    /** Spring configuration for bouncy animations */
    spring: {
        type: 'spring' as const,
        stiffness: 400,
        damping: 30,
    },
} as const

export type MotionPreset = keyof typeof MOTION

// --- Elevation Tokens ---

export const ELEVATION = {
    card: {
        boxShadow: '0 10px 30px rgb(0 0 0 / 0.08)',
        backdropFilter: 'blur(16px)',
    },
    hover: {
        boxShadow: '0 20px 40px rgb(0 0 0 / 0.12)',
        transform: 'translateY(-2px)',
    },
    active: {
        boxShadow: '0 5px 15px rgb(0 0 0 / 0.1)',
        transform: 'translateY(0)',
    },
    focus: {
        boxShadow: '0 0 0 3px hsl(var(--ring) / 0.3)',
    },
} as const

// --- Typography Scale ---

export const TYPOGRAPHY = {
    display: {
        fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
        fontWeight: 800,
        letterSpacing: '-0.02em',
        lineHeight: 1.1,
    },
    title: {
        fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
        fontWeight: 700,
        letterSpacing: '-0.01em',
        lineHeight: 1.2,
    },
    body: {
        fontSize: '1rem',
        fontWeight: 400,
        lineHeight: 1.6,
    },
    mono: {
        fontFamily: '"SF Mono", "Fira Code", "Consolas", monospace',
        fontSize: '0.875rem',
        fontWeight: 500,
    },
} as const

// --- Semantic Colors ---

export const SEMANTIC_COLORS = {
    success: 'hsl(142 71% 45%)',
    warning: 'hsl(38 92% 50%)',
    error: 'hsl(0 84% 60%)',
    info: 'hsl(217 91% 60%)',
} as const

// --- Region Configuration ---

export type RegionId =
    | 'north_india'
    | 'south_india'
    | 'east_india'
    | 'west_india'
    | 'central_india'
    | 'northeast_india'

export interface RegionConfig {
    id: RegionId
    name: string
    shortName: string
    emoji: string
    color: string
    gradient: string
    bgColor: string
    textColor: string
}

export const REGIONS: RegionConfig[] = [
    {
        id: 'north_india',
        name: 'North India Region',
        shortName: 'North',
        emoji: '🏔️',
        color: '#3B82F6', // blue-500
        gradient: 'from-blue-500 to-blue-600',
        bgColor: 'bg-blue-500',
        textColor: 'text-blue-500',
    },
    {
        id: 'south_india',
        name: 'South India Region',
        shortName: 'South',
        emoji: '🏖️',
        color: '#22C55E', // green-500
        gradient: 'from-green-500 to-green-600',
        bgColor: 'bg-green-500',
        textColor: 'text-green-500',
    },
    {
        id: 'east_india',
        name: 'East India Region',
        shortName: 'East',
        emoji: '🏭',
        color: '#F59E0B', // amber-500
        gradient: 'from-amber-500 to-orange-500',
        bgColor: 'bg-amber-500',
        textColor: 'text-amber-500',
    },
    {
        id: 'west_india',
        name: 'West India Region',
        shortName: 'West',
        emoji: '🏜️',
        color: '#8B5CF6', // purple-500
        gradient: 'from-purple-500 to-violet-600',
        bgColor: 'bg-purple-500',
        textColor: 'text-purple-500',
    },
    {
        id: 'central_india',
        name: 'Central India Region',
        shortName: 'Central',
        emoji: '🏛️',
        color: '#6366F1', // indigo-500
        gradient: 'from-indigo-500 to-indigo-600',
        bgColor: 'bg-indigo-500',
        textColor: 'text-indigo-500',
    },
    {
        id: 'northeast_india',
        name: 'Northeast India Region',
        shortName: 'Northeast',
        emoji: '🌲',
        color: '#14B8A6', // teal-500
        gradient: 'from-teal-500 to-teal-600',
        bgColor: 'bg-teal-500',
        textColor: 'text-teal-500',
    },
]

export const REGION_IDS = REGIONS.map(r => r.id)

export const REGION_MAP = REGIONS.reduce((acc, region) => {
    acc[region.id] = region
    return acc
}, {} as Record<RegionId, RegionConfig>)

// --- Helper Functions ---

export function getRegionConfig(id: RegionId): RegionConfig {
    return REGION_MAP[id]
}

export function getRegionColor(id: RegionId): string {
    return REGION_MAP[id]?.color ?? '#6B7280'
}

export function getRegionGradient(id: RegionId): string {
    return REGION_MAP[id]?.gradient ?? 'from-gray-500 to-gray-600'
}

export function getRegionEmoji(id: RegionId): string {
    return REGION_MAP[id]?.emoji ?? '📍'
}

export function isValidRegionId(id: string): id is RegionId {
    return REGION_IDS.includes(id as RegionId)
}

// --- Reduced Motion Helper ---

export function getPrefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function getMotionProps(preset: MotionPreset = 'enter') {
    if (getPrefersReducedMotion()) {
        return { duration: 0 }
    }
    return MOTION[preset]
}
