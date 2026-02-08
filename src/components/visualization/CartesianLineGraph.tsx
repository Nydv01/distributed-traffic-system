import { useEffect, useState, useMemo, useRef } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { TrendingUp, Clock, Zap, Activity, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CartesianLineGraphProps {
    sequentialTime: number
    parallelTime: number
    speedup: number
    className?: string
}

/**
 * CartesianLineGraph - Premium cinematic graph with zoom and dynamic effects
 * 
 * Features:
 * - Zoom in/out on mouse hover
 * - Parallax floating particles
 * - Animated gradient glows
 * - Pulsing data points
 * - Cinematic reveal animations
 * - Premium glassmorphism styling
 */
export function CartesianLineGraph({
    sequentialTime,
    parallelTime,
    speedup,
    className = '',
}: CartesianLineGraphProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [animationProgress, setAnimationProgress] = useState(0)
    const [isHovered, setIsHovered] = useState(false)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

    // Spring-based mouse tracking for parallax
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)
    const smoothX = useSpring(mouseX, { stiffness: 100, damping: 30 })
    const smoothY = useSpring(mouseY, { stiffness: 100, damping: 30 })

    // Zoom scale based on hover
    const scale = useSpring(1, { stiffness: 300, damping: 30 })

    // Track mouse for parallax effects
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height
        mouseX.set(x * 30)
        mouseY.set(y * 30)
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }

    const handleMouseEnter = () => {
        setIsHovered(true)
        scale.set(1.03)
    }

    const handleMouseLeave = () => {
        setIsHovered(false)
        scale.set(1)
        mouseX.set(0)
        mouseY.set(0)
    }

    // Animate on mount
    useEffect(() => {
        const start = performance.now()
        const duration = 2500

        const animate = (now: number) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            setAnimationProgress(1 - Math.pow(1 - progress, 4))
            if (progress < 1) requestAnimationFrame(animate)
        }

        requestAnimationFrame(animate)
    }, [])

    // Graph dimensions
    const graphWidth = 700
    const graphHeight = 350
    const padding = { top: 50, right: 70, bottom: 70, left: 90 }
    const innerWidth = graphWidth - padding.left - padding.right
    const innerHeight = graphHeight - padding.top - padding.bottom

    const maxTime = Math.max(sequentialTime, parallelTime) * 1.15
    const xScale = (val: number) => (val / maxTime) * innerWidth
    const yScale = (val: number) => innerHeight - (val / 100) * innerHeight

    // Generate line points
    const sequentialPoints = useMemo(() => {
        const points: { x: number; y: number }[] = []
        const steps = 60
        for (let i = 0; i <= steps; i++) {
            const progress = i / steps
            points.push({ x: xScale(progress * sequentialTime), y: yScale(progress * 100) })
        }
        return points
    }, [sequentialTime, innerWidth, innerHeight])

    const parallelPoints = useMemo(() => {
        const points: { x: number; y: number }[] = []
        const steps = 60
        for (let i = 0; i <= steps; i++) {
            const progress = i / steps
            points.push({ x: xScale(progress * parallelTime), y: yScale(Math.pow(progress, 0.75) * 100) })
        }
        return points
    }, [parallelTime, innerWidth, innerHeight])

    const createPath = (points: { x: number; y: number }[], progress: number) => {
        const visibleCount = Math.floor(points.length * progress)
        if (visibleCount < 2) return ''
        return points.slice(0, visibleCount).map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
    }

    const createAreaPath = (points: { x: number; y: number }[], progress: number) => {
        const visibleCount = Math.floor(points.length * progress)
        if (visibleCount < 2) return ''
        const visible = points.slice(0, visibleCount)
        const linePath = visible.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
        return `${linePath} L ${visible[visible.length - 1].x} ${innerHeight} L ${visible[0].x} ${innerHeight} Z`
    }

    const xGridLines = [0, 0.25, 0.5, 0.75, 1].map(p => Math.round(maxTime * p))
    const yGridLines = [0, 25, 50, 75, 100]

    return (
        <div className={cn('relative', className)}>
            {/* Floating Particles - parallax */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1.5 h-1.5 rounded-full bg-primary/20"
                        style={{
                            left: `${10 + Math.random() * 80}%`,
                            top: `${10 + Math.random() * 80}%`,
                            x: useTransform(smoothX, v => v * (0.5 + Math.random())),
                            y: useTransform(smoothY, v => v * (0.5 + Math.random())),
                        }}
                        animate={{
                            opacity: [0.2, 0.6, 0.2],
                            scale: [1, 1.5, 1],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-border backdrop-blur-sm mb-4">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                        Performance Analysis
                    </span>
                </div>
                <h3 className="text-3xl font-bold">
                    <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
                        Execution Timeline
                    </span>
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                    Completion progress vs execution time • Hover to zoom
                </p>
            </motion.div>

            {/* Graph Container with zoom */}
            <motion.div
                ref={containerRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{ scale }}
                className="relative rounded-3xl overflow-hidden cursor-crosshair"
            >
                {/* Premium gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/95 to-slate-950 border border-white/10 rounded-3xl" />

                {/* Animated ambient glows */}
                <motion.div
                    className="absolute top-0 left-0 w-64 h-64 bg-red-500/8 rounded-full blur-[100px]"
                    animate={{
                        x: isHovered ? mousePos.x * 0.1 - 100 : 0,
                        y: isHovered ? mousePos.y * 0.1 - 100 : 0,
                        scale: isHovered ? 1.2 : 1,
                    }}
                    transition={{ type: 'spring', stiffness: 100, damping: 30 }}
                />
                <motion.div
                    className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/8 rounded-full blur-[100px]"
                    animate={{
                        x: isHovered ? -mousePos.x * 0.1 + 100 : 0,
                        y: isHovered ? -mousePos.y * 0.1 + 100 : 0,
                        scale: isHovered ? 1.2 : 1,
                    }}
                    transition={{ type: 'spring', stiffness: 100, damping: 30 }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[120px]"
                    animate={{
                        scale: isHovered ? [1, 1.1, 1] : 1,
                        opacity: isHovered ? 0.8 : 0.4,
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                />

                {/* Scan line effect on hover */}
                {isHovered && (
                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <motion.div
                            className="absolute w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
                            animate={{ y: [0, 400, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        />
                    </motion.div>
                )}

                {/* Grid pattern overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                    }}
                />

                {/* SVG Graph */}
                <div className="relative p-8">
                    <svg viewBox={`0 0 ${graphWidth} ${graphHeight}`} className="w-full h-auto" style={{ maxHeight: '450px' }}>
                        <defs>
                            {/* Gradients */}
                            <linearGradient id="seqLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#ef4444" />
                                <stop offset="50%" stopColor="#f97316" />
                                <stop offset="100%" stopColor="#f59e0b" />
                            </linearGradient>
                            <linearGradient id="parLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#22c55e" />
                                <stop offset="50%" stopColor="#10b981" />
                                <stop offset="100%" stopColor="#14b8a6" />
                            </linearGradient>
                            <linearGradient id="seqAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                            </linearGradient>
                            <linearGradient id="parAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                            </linearGradient>
                            {/* Glow filters */}
                            <filter id="seqGlow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="4" result="blur" />
                                <feFlood floodColor="#ef4444" floodOpacity="0.5" />
                                <feComposite in2="blur" operator="in" />
                                <feMerge>
                                    <feMergeNode />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                            <filter id="parGlow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="4" result="blur" />
                                <feFlood floodColor="#22c55e" floodOpacity="0.5" />
                                <feComposite in2="blur" operator="in" />
                                <feMerge>
                                    <feMergeNode />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                            <filter id="pointGlow">
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Graph area */}
                        <g transform={`translate(${padding.left}, ${padding.top})`}>
                            {/* Grid lines with animation */}
                            {xGridLines.map((val, i) => (
                                <motion.g
                                    key={`x-${i}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.1 * i }}
                                >
                                    <line
                                        x1={xScale(val)} y1={0}
                                        x2={xScale(val)} y2={innerHeight}
                                        stroke="rgba(255,255,255,0.06)"
                                        strokeDasharray="6,6"
                                    />
                                    <text
                                        x={xScale(val)} y={innerHeight + 30}
                                        fill="rgba(255,255,255,0.4)"
                                        fontSize="11" textAnchor="middle"
                                        fontFamily="ui-monospace, monospace"
                                    >
                                        {val}ms
                                    </text>
                                </motion.g>
                            ))}
                            {yGridLines.map((val, i) => (
                                <motion.g
                                    key={`y-${i}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.1 * i }}
                                >
                                    <line
                                        x1={0} y1={yScale(val)}
                                        x2={innerWidth} y2={yScale(val)}
                                        stroke="rgba(255,255,255,0.06)"
                                        strokeDasharray="6,6"
                                    />
                                    <text
                                        x={-18} y={yScale(val) + 4}
                                        fill="rgba(255,255,255,0.4)"
                                        fontSize="11" textAnchor="end"
                                        fontFamily="ui-monospace, monospace"
                                    >
                                        {val}%
                                    </text>
                                </motion.g>
                            ))}

                            {/* Axes */}
                            <motion.line
                                x1={0} y1={innerHeight}
                                x2={innerWidth + 10} y2={innerHeight}
                                stroke="rgba(255,255,255,0.3)"
                                strokeWidth={2}
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.8 }}
                            />
                            <polygon points={`${innerWidth + 10},${innerHeight} ${innerWidth + 2},${innerHeight - 5} ${innerWidth + 2},${innerHeight + 5}`} fill="rgba(255,255,255,0.3)" />

                            <motion.line
                                x1={0} y1={innerHeight}
                                x2={0} y2={-10}
                                stroke="rgba(255,255,255,0.3)"
                                strokeWidth={2}
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.8 }}
                            />
                            <polygon points={`0,-10 -5,-2 5,-2`} fill="rgba(255,255,255,0.3)" />

                            {/* Axis Labels */}
                            <text x={innerWidth / 2} y={innerHeight + 55} fill="rgba(255,255,255,0.5)" fontSize="12" textAnchor="middle" fontWeight="500">
                                Execution Time (ms)
                            </text>
                            <text x={-innerHeight / 2} y={-65} fill="rgba(255,255,255,0.5)" fontSize="12" textAnchor="middle" fontWeight="500" transform="rotate(-90)">
                                Completion Progress (%)
                            </text>

                            {/* Area fills */}
                            <motion.path
                                d={createAreaPath(sequentialPoints, animationProgress)}
                                fill="url(#seqAreaGrad)"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.6 }}
                            />
                            <motion.path
                                d={createAreaPath(parallelPoints, animationProgress)}
                                fill="url(#parAreaGrad)"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.6 }}
                            />

                            {/* Lines */}
                            <motion.path
                                d={createPath(sequentialPoints, animationProgress)}
                                stroke="url(#seqLineGrad)"
                                strokeWidth={isHovered ? 4 : 3}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                                filter="url(#seqGlow)"
                            />
                            <motion.path
                                d={createPath(parallelPoints, animationProgress)}
                                stroke="url(#parLineGrad)"
                                strokeWidth={isHovered ? 4 : 3}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                                filter="url(#parGlow)"
                            />

                            {/* Animated endpoints */}
                            {animationProgress >= 1 && (
                                <>
                                    {/* Sequential endpoint */}
                                    <motion.g
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', bounce: 0.6 }}
                                    >
                                        <motion.circle
                                            cx={xScale(sequentialTime)} cy={yScale(100)}
                                            r={isHovered ? 12 : 10}
                                            fill="#ef4444" fillOpacity="0.2"
                                            animate={{ scale: [1, 1.3, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                        <circle
                                            cx={xScale(sequentialTime)} cy={yScale(100)}
                                            r={6} fill="#ef4444" filter="url(#pointGlow)"
                                        />
                                        <circle
                                            cx={xScale(sequentialTime)} cy={yScale(100)}
                                            r={3} fill="#fff"
                                        />
                                    </motion.g>

                                    {/* Parallel endpoint */}
                                    <motion.g
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', bounce: 0.6, delay: 0.2 }}
                                    >
                                        <motion.circle
                                            cx={xScale(parallelTime)} cy={yScale(100)}
                                            r={isHovered ? 12 : 10}
                                            fill="#22c55e" fillOpacity="0.2"
                                            animate={{ scale: [1, 1.3, 1] }}
                                            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                        />
                                        <circle
                                            cx={xScale(parallelTime)} cy={yScale(100)}
                                            r={6} fill="#22c55e" filter="url(#pointGlow)"
                                        />
                                        <circle
                                            cx={xScale(parallelTime)} cy={yScale(100)}
                                            r={3} fill="#fff"
                                        />
                                    </motion.g>
                                </>
                            )}
                        </g>
                    </svg>
                </div>

                {/* Legend - below graph */}
                <div className="flex justify-center gap-8 px-8 pb-6 pt-4">
                    <motion.div
                        className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
                        whileHover={{ scale: 1.05, y: -2 }}
                    >
                        <div className="w-6 h-1.5 rounded-full bg-gradient-to-r from-red-500 to-orange-500" />
                        <span className="text-sm text-muted-foreground">Sequential</span>
                        <span className="text-sm font-mono font-bold text-red-400">{sequentialTime}ms</span>
                    </motion.div>
                    <motion.div
                        className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
                        whileHover={{ scale: 1.05, y: -2 }}
                    >
                        <div className="w-6 h-1.5 rounded-full bg-gradient-to-r from-green-500 to-teal-500" />
                        <span className="text-sm text-muted-foreground">Parallel</span>
                        <span className="text-sm font-mono font-bold text-green-400">{parallelTime}ms</span>
                    </motion.div>
                </div>
            </motion.div>

            {/* Speedup Badge - cinematic reveal */}
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 2.5, type: 'spring', stiffness: 200 }}
                className="flex justify-center mt-8"
            >
                <motion.div
                    className="relative group cursor-default"
                    whileHover={{ scale: 1.05, y: -4 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    {/* Glow background */}
                    <motion.div
                        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute inset-0 rounded-2xl bg-amber-500/25 blur-2xl"
                    />

                    {/* Badge content */}
                    <div className="relative flex flex-col md:flex-row items-center gap-6 px-6 md:px-10 py-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-500/25 backdrop-blur-xl overflow-hidden text-center md:text-left">
                        {/* Shimmer effect */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
                            animate={{ translateX: ['calc(-100%)', 'calc(100%)'] }}
                            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                        />

                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                        >
                            <TrendingUp className="w-10 h-10 text-amber-400" />
                        </motion.div>

                        <div>
                            <motion.div
                                className="text-5xl font-black bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 bg-clip-text text-transparent"
                                animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                style={{ backgroundSize: '200%' }}
                            >
                                {speedup.toFixed(1)}x
                            </motion.div>
                            <div className="text-sm text-amber-400/80 font-semibold tracking-wide">
                                Speedup Factor
                            </div>
                        </div>

                        <div className="w-full md:w-auto border-t md:border-t-0 md:border-l border-amber-500/20 pt-4 md:pt-0 md:pl-6 md:ml-2 space-y-1 flex flex-col items-center md:items-start">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span className="font-semibold">{((1 - parallelTime / sequentialTime) * 100).toFixed(0)}% faster</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Zap className="w-4 h-4" />
                                <span className="font-semibold">{sequentialTime - parallelTime}ms saved</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    )
}

export default CartesianLineGraph
