import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { REGIONS } from '@/lib/designTokens'
import type { PerformanceMetrics } from '@/types/traffic'

interface Comparison3DProps {
    metrics: PerformanceMetrics | null
    className?: string
}

export function Comparison3D({ metrics, className = '' }: Comparison3DProps) {
    // Generate bar data for visualization
    const bars = useMemo(() => {
        if (!metrics) return []

        const sequentialTime = metrics.sequentialTime
        const parallelTime = metrics.parallelTime
        const maxTime = Math.max(sequentialTime, parallelTime)

        return REGIONS.map((region, index) => {
            // Simulate individual region times (proportional distribution)
            const regionSeqTime = sequentialTime / REGIONS.length
            const regionParTime = parallelTime * (0.7 + Math.random() * 0.3) // Slight variation

            return {
                region,
                index,
                sequentialHeight: (regionSeqTime / maxTime) * 100,
                parallelHeight: (regionParTime / maxTime) * 80,
                delay: index * 0.1,
            }
        })
    }, [metrics])

    if (!metrics) {
        return (
            <div className={`glass-card p-8 ${className}`}>
                <div className="text-center text-muted-foreground">
                    Complete a simulation to see 3D comparison
                </div>
            </div>
        )
    }

    return (
        <div className={`glass-card p-8 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold">3D Performance Comparison</h3>
                    <p className="text-sm text-muted-foreground">
                        Sequential vs Parallel execution across regions
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-gradient-to-b from-red-400 to-red-600" />
                        <span className="text-sm">Sequential</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-gradient-to-b from-green-400 to-green-600" />
                        <span className="text-sm">Parallel</span>
                    </div>
                </div>
            </div>

            {/* 3D Isometric Grid */}
            <div
                className="relative h-80 perspective-1000"
                style={{ perspective: '1000px' }}
            >
                <div
                    className="absolute inset-0 flex items-end justify-center gap-6 pb-12"
                    style={{
                        transform: 'rotateX(15deg) rotateY(-15deg)',
                        transformStyle: 'preserve-3d',
                    }}
                >
                    {bars.map(({ region, index, sequentialHeight, parallelHeight, delay }) => (
                        <motion.div
                            key={region.id}
                            className="flex flex-col items-center gap-2"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        >
                            {/* Bar Group */}
                            <div className="flex gap-2 items-end h-48">
                                {/* Sequential Bar (Red) */}
                                <motion.div
                                    className="w-6 rounded-t-lg relative"
                                    style={{
                                        background: 'linear-gradient(180deg, #f87171 0%, #dc2626 100%)',
                                        boxShadow: '4px 4px 0 rgba(0,0,0,0.2), inset -2px 0 0 rgba(255,255,255,0.1)',
                                        transformStyle: 'preserve-3d',
                                    }}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${sequentialHeight}%` }}
                                    transition={{ delay: delay + 0.2, duration: 0.8, ease: 'easeOut' }}
                                >
                                    {/* 3D Side Face */}
                                    <div
                                        className="absolute right-0 top-0 bottom-0 w-2"
                                        style={{
                                            background: 'linear-gradient(180deg, #ef4444 0%, #b91c1c 100%)',
                                            transform: 'translateX(100%) skewY(-45deg)',
                                            transformOrigin: 'left top',
                                        }}
                                    />
                                </motion.div>

                                {/* Parallel Bar (Green) */}
                                <motion.div
                                    className="w-6 rounded-t-lg relative"
                                    style={{
                                        background: 'linear-gradient(180deg, #4ade80 0%, #16a34a 100%)',
                                        boxShadow: '4px 4px 0 rgba(0,0,0,0.2), inset -2px 0 0 rgba(255,255,255,0.1)',
                                        transformStyle: 'preserve-3d',
                                    }}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${parallelHeight}%` }}
                                    transition={{ delay: delay + 0.4, duration: 0.8, ease: 'easeOut' }}
                                >
                                    {/* 3D Side Face */}
                                    <div
                                        className="absolute right-0 top-0 bottom-0 w-2"
                                        style={{
                                            background: 'linear-gradient(180deg, #22c55e 0%, #15803d 100%)',
                                            transform: 'translateX(100%) skewY(-45deg)',
                                            transformOrigin: 'left top',
                                        }}
                                    />
                                </motion.div>
                            </div>

                            {/* Region Label */}
                            <div className="flex flex-col items-center">
                                <span className="text-xl">{region.emoji}</span>
                                <span className="text-xs text-muted-foreground font-medium">
                                    {region.shortName}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Floor Grid */}
                <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-24 opacity-30"
                    style={{
                        background: 'linear-gradient(90deg, transparent 49%, hsl(var(--border)) 49%, hsl(var(--border)) 51%, transparent 51%), linear-gradient(0deg, transparent 49%, hsl(var(--border)) 49%, hsl(var(--border)) 51%, transparent 51%)',
                        backgroundSize: '40px 40px',
                        transform: 'rotateX(60deg) translateZ(-20px)',
                    }}
                />
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border/50">
                <div className="text-center">
                    <div className="text-2xl font-bold text-destructive">
                        {metrics.sequentialTime}ms
                    </div>
                    <div className="text-xs text-muted-foreground">Sequential Time</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-success">
                        {metrics.parallelTime}ms
                    </div>
                    <div className="text-xs text-muted-foreground">Parallel Time</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                        {metrics.speedupFactor}x
                    </div>
                    <div className="text-xs text-muted-foreground">Speedup Factor</div>
                </div>
            </div>
        </div>
    )
}
