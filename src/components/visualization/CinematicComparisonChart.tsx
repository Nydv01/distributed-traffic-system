import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, Zap, Clock } from 'lucide-react'

interface CinematicComparisonChartProps {
    sequentialTime: number
    parallelTime: number
    speedup: number
    className?: string
}

/**
 * CinematicComparisonChart - Premium animated 2D comparison visualization
 * 
 * Features:
 * - Animated X/Y axis with labels
 * - Dynamic racing lines that animate in
 * - Gradient fills with glow effects
 * - Pulse animations on completion
 * - Apple-level micro-interactions
 */
export function CinematicComparisonChart({
    sequentialTime,
    parallelTime,
    speedup,
    className = '',
}: CinematicComparisonChartProps) {
    const [isVisible, setIsVisible] = useState(false)
    const [animationPhase, setAnimationPhase] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)

    // Trigger animation when component mounts
    useEffect(() => {
        const timer1 = setTimeout(() => setIsVisible(true), 100)
        const timer2 = setTimeout(() => setAnimationPhase(1), 500)
        const timer3 = setTimeout(() => setAnimationPhase(2), 1500)
        const timer4 = setTimeout(() => setAnimationPhase(3), 2500)

        return () => {
            clearTimeout(timer1)
            clearTimeout(timer2)
            clearTimeout(timer3)
            clearTimeout(timer4)
        }
    }, [])

    // Calculate percentages for bar widths
    const maxTime = Math.max(sequentialTime, parallelTime)
    const seqPercent = (sequentialTime / maxTime) * 100
    const parPercent = (parallelTime / maxTime) * 100

    // Time points for x-axis
    const timePoints = [0, Math.round(maxTime * 0.25), Math.round(maxTime * 0.5), Math.round(maxTime * 0.75), maxTime]

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-center mb-8"
            >
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                    Performance Comparison
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                    Sequential vs Parallel Execution Timeline
                </p>
            </motion.div>

            {/* Main Chart Container */}
            <div className="relative bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-950/80 backdrop-blur-xl rounded-3xl p-8 border border-white/5 overflow-hidden">
                {/* Ambient glow effects */}
                <div className="absolute top-0 left-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-[100px] pointer-events-none" />

                {/* Y-Axis Labels */}
                <div className="absolute left-0 top-8 bottom-20 flex flex-col justify-between text-xs text-muted-foreground/60 font-mono">
                    <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500/50" />
                        Sequential
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500/50" />
                        Parallel
                    </span>
                </div>

                {/* Chart Area */}
                <div className="ml-20 relative">
                    {/* Grid lines */}
                    <div className="absolute inset-0 flex justify-between pointer-events-none">
                        {timePoints.map((_, i) => (
                            <div
                                key={i}
                                className="w-px h-full bg-gradient-to-b from-white/5 via-white/10 to-white/5"
                            />
                        ))}
                    </div>

                    {/* Sequential Bar */}
                    <div className="relative h-16 mb-6">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: isVisible ? `${seqPercent}%` : 0 }}
                            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                            className="absolute inset-y-0 left-0 rounded-r-2xl overflow-hidden"
                        >
                            {/* Gradient fill */}
                            <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-orange-400" />

                            {/* Animated shine */}
                            <motion.div
                                animate={{ x: ['-100%', '200%'] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                            />

                            {/* Glow effect */}
                            <div className="absolute inset-0 shadow-[0_0_40px_rgba(239,68,68,0.4)]" />

                            {/* Time label */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: animationPhase >= 2 ? 1 : 0, scale: 1 }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-white font-bold"
                            >
                                <Clock className="w-4 h-4" />
                                {sequentialTime}ms
                            </motion.div>
                        </motion.div>

                        {/* Pulse at end */}
                        {animationPhase >= 2 && (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                style={{ left: `${seqPercent}%` }}
                                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-red-400"
                            />
                        )}
                    </div>

                    {/* Parallel Bar */}
                    <div className="relative h-16 mb-8">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: isVisible ? `${parPercent}%` : 0 }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
                            className="absolute inset-y-0 left-0 rounded-r-2xl overflow-hidden"
                        >
                            {/* Gradient fill */}
                            <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-green-500 to-emerald-400" />

                            {/* Animated shine */}
                            <motion.div
                                animate={{ x: ['-100%', '200%'] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                            />

                            {/* Glow effect */}
                            <div className="absolute inset-0 shadow-[0_0_40px_rgba(34,197,94,0.4)]" />

                            {/* Time label */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: animationPhase >= 2 ? 1 : 0, scale: 1 }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-white font-bold"
                            >
                                <Zap className="w-4 h-4" />
                                {parallelTime}ms
                            </motion.div>
                        </motion.div>

                        {/* Pulse at end */}
                        {animationPhase >= 2 && (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
                                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                style={{ left: `${parPercent}%` }}
                                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-green-400"
                            />
                        )}
                    </div>

                    {/* X-Axis */}
                    <div className="relative h-8 border-t border-white/10">
                        <div className="absolute inset-x-0 top-0 flex justify-between text-xs text-muted-foreground/60 font-mono pt-2">
                            {timePoints.map((time, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + i * 0.1 }}
                                >
                                    {time}ms
                                </motion.span>
                            ))}
                        </div>
                        <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 text-xs text-muted-foreground">
                            Execution Time →
                        </div>
                    </div>
                </div>

                {/* Speedup Badge */}
                <AnimatePresence>
                    {animationPhase >= 3 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ type: 'spring', bounce: 0.4 }}
                            className="absolute bottom-6 right-8"
                        >
                            <div className="relative">
                                {/* Glow ring */}
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute inset-0 rounded-2xl bg-amber-500/30 blur-xl"
                                />

                                {/* Badge */}
                                <div className="relative px-6 py-4 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 backdrop-blur-sm">
                                    <div className="flex items-center gap-3">
                                        <TrendingUp className="w-6 h-6 text-amber-400" />
                                        <div>
                                            <div className="text-3xl font-black text-amber-400">
                                                {speedup.toFixed(1)}x
                                            </div>
                                            <div className="text-xs text-amber-400/70 font-medium uppercase tracking-wider">
                                                Speedup Factor
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: animationPhase >= 3 ? 1 : 0, y: 0 }}
                className="grid grid-cols-3 gap-4 mt-6"
            >
                <div className="text-center p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="text-2xl font-bold text-red-400">{sequentialTime}ms</div>
                    <div className="text-xs text-muted-foreground mt-1">Sequential</div>
                </div>
                <div className="text-center p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="text-2xl font-bold text-green-400">{parallelTime}ms</div>
                    <div className="text-xs text-muted-foreground mt-1">Parallel</div>
                </div>
                <div className="text-center p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                    <div className="text-2xl font-bold text-amber-400">
                        {((1 - parallelTime / sequentialTime) * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Time Saved</div>
                </div>
            </motion.div>
        </div>
    )
}

export default CinematicComparisonChart
