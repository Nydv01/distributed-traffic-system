import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
    Settings,
    Play,
    RotateCcw,
    Sliders,
    Activity,
    Cpu,
    Gauge,
    Eye,
    EyeOff,
    Download,
    RefreshCw,
    AlertTriangle,
    CheckCircle,
    Clock,
    Zap,
    Network,
    BarChart3,
    Layers,
    MapPin,
    Shield,
    Globe,
    Terminal,
    ChevronRight,
    TrendingUp,
    X,
    Info,
    Server,
    Wifi,
    Database,
    ArrowUp,
    ArrowDown,
    Hash,
    Timer,
    Radio,
} from 'lucide-react'
import { useTrafficStore, SimulationScenario } from '@/stores/trafficStore'
import { Button } from '@/components/ui/button'
import { cn, getStatusColor } from '@/lib/utils'
import { REGIONS, REGION_MAP, RegionId } from '@/lib/designTokens'
import { toast } from 'sonner'

function FloatingParticles() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(25)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-primary/30 rounded-full"
                    initial={{
                        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                        y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                    }}
                    animate={{
                        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                        y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                    }}
                    transition={{
                        duration: 12 + Math.random() * 15,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'linear',
                    }}
                />
            ))}
        </div>
    )
}

function NodeDetailModal({
    node,
    nodeId,
    isOpen,
    onClose,
}: {
    node: any
    nodeId: string
    isOpen: boolean
    onClose: () => void
}) {
    const region = REGIONS.find(r => r.id === nodeId)
    const zone = REGION_MAP[nodeId as RegionId]
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    if (!isOpen || !node || !mounted) return null

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9990]"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 50 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="w-full max-w-lg bg-card/95 backdrop-blur-xl rounded-3xl border border-border shadow-2xl overflow-hidden pointer-events-auto">
                            {/* Header */}
                            <div className="relative px-6 py-5 border-b border-border bg-gradient-to-r from-primary/10 to-transparent">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/10 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="flex items-center gap-4">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.1, type: 'spring' }}
                                        className={cn(
                                            'w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg',
                                            zone?.bgColor ?? 'bg-muted'
                                        )}
                                    >
                                        {zone?.emoji ?? '📍'}
                                    </motion.div>
                                    <div>
                                        <h2 className="text-xl font-bold">{node.name}</h2>
                                        <p className="text-sm text-muted-foreground">{zone?.name ?? 'Regional Node'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-6">
                                {/* Status Row */}
                                <div className="flex items-center gap-4">
                                    <motion.div
                                        className={cn('w-4 h-4 rounded-full', getStatusColor(node.status))}
                                        animate={node.status === 'processing' ? { scale: [1, 1.3, 1] } : {}}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    />
                                    <span className="text-lg font-semibold capitalize">{node.status}</span>
                                    {node.status === 'processing' && (
                                        <motion.div
                                            className="flex items-center gap-1 text-primary text-sm"
                                            animate={{ opacity: [1, 0.5, 1] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        >
                                            <Radio className="w-3 h-3" />
                                            Live
                                        </motion.div>
                                    )}
                                </div>

                                {/* Progress */}
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-muted-foreground">Traffic Load</span>
                                        <span className="font-bold">{Math.round(node.trafficLoad)}%</span>
                                    </div>
                                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                                        <motion.div
                                            className={cn(
                                                'h-full rounded-full relative',
                                                node.status === 'success' ? 'bg-emerald-500' :
                                                    node.status === 'failed' ? 'bg-red-500' : 'bg-primary'
                                            )}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${node.trafficLoad}%` }}
                                            transition={{ duration: 0.8, ease: 'easeOut' }}
                                        >
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                                animate={{ x: ['-100%', '200%'] }}
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                            />
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Metrics Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { icon: Timer, label: 'Latency', value: `${node.processingTime || Math.floor(50 + Math.random() * 100)}ms`, color: 'text-blue-400' },
                                        { icon: Activity, label: 'Throughput', value: `${Math.floor(70 + Math.random() * 30)}%`, color: 'text-emerald-400' },
                                        { icon: Cpu, label: 'CPU Usage', value: `${Math.floor(30 + Math.random() * 50)}%`, color: 'text-amber-400' },
                                        { icon: Database, label: 'Memory', value: `${Math.floor(200 + Math.random() * 300)}MB`, color: 'text-purple-400' },
                                    ].map((metric, i) => (
                                        <motion.div
                                            key={metric.label}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 + i * 0.1 }}
                                            className="p-4 rounded-xl bg-black/30 border border-border"
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <metric.icon className={cn('w-4 h-4', metric.color)} />
                                                <span className="text-xs text-muted-foreground uppercase tracking-wider">{metric.label}</span>
                                            </div>
                                            <span className="text-xl font-bold">{metric.value}</span>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <Button variant="outline" className="flex-1 rounded-xl gap-2">
                                        <RefreshCw className="w-4 h-4" />
                                        Refresh
                                    </Button>
                                    <Button variant="outline" className="flex-1 rounded-xl gap-2">
                                        <Terminal className="w-4 h-4" />
                                        View Logs
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )

    return createPortal(modalContent, document.body)
}

function LiveActivityFeed() {
    const [activities, setActivities] = useState<{ id: number; message: string; time: string; type: 'info' | 'success' | 'warning' }[]>([
        { id: 1, message: 'System initialized', time: 'Just now', type: 'info' },
        { id: 2, message: 'All nodes healthy', time: '2s ago', type: 'success' },
        { id: 3, message: 'Configuration loaded', time: '5s ago', type: 'info' },
    ])

    useEffect(() => {
        const events = [
            { message: 'Node heartbeat received', type: 'info' as const },
            { message: 'Traffic analysis completed', type: 'success' as const },
            { message: 'Cache refreshed', type: 'info' as const },
            { message: 'Route optimization active', type: 'success' as const },
            { message: 'High traffic detected', type: 'warning' as const },
        ]

        const interval = setInterval(() => {
            const event = events[Math.floor(Math.random() * events.length)]
            setActivities(prev => [
                { id: Date.now(), message: event.message, time: 'Just now', type: event.type },
                ...prev.slice(0, 4)
            ])
        }, 4000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="space-y-2">
            <AnimatePresence mode="popLayout">
                {activities.map((activity, i) => (
                    <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20, height: 0 }}
                        animate={{ opacity: 1, x: 0, height: 'auto' }}
                        exit={{ opacity: 0, x: 20, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className={cn(
                            'flex items-center gap-3 p-3 rounded-xl border text-sm',
                            activity.type === 'success' ? 'border-emerald-500/20 bg-emerald-500/5' :
                                activity.type === 'warning' ? 'border-amber-500/20 bg-amber-500/5' :
                                    'border-border bg-card/30'
                        )}
                    >
                        <div className={cn(
                            'w-2 h-2 rounded-full',
                            activity.type === 'success' ? 'bg-emerald-400' :
                                activity.type === 'warning' ? 'bg-amber-400' : 'bg-primary'
                        )} />
                        <span className="flex-1">{activity.message}</span>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}

function HealthGauge({ value, label }: { value: number; label: string }) {
    const circumference = 2 * Math.PI * 40
    const strokeDashoffset = circumference - (value / 100) * circumference

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-24 h-24">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-muted/30"
                    />
                    <motion.circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="url(#gaugeGradient)"
                        strokeWidth="8"
                        fill="transparent"
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        style={{ strokeDasharray: circumference }}
                    />
                    <defs>
                        <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="hsl(var(--primary))" />
                            <stop offset="100%" stopColor="#22c55e" />
                        </linearGradient>
                    </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.span
                        className="text-2xl font-bold"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: 'spring' }}
                    >
                        {value}%
                    </motion.span>
                </div>
            </div>
            <span className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">{label}</span>
        </div>
    )
}

const SCENARIOS: { id: SimulationScenario; label: string; desc: string; icon: React.FC<{ className?: string }>; color: string }[] = [
    { id: 'light', label: 'Light Traffic', desc: 'Low congestion, fast processing', icon: Zap, color: 'emerald' },
    { id: 'normal', label: 'Normal Traffic', desc: 'Average traffic conditions', icon: Activity, color: 'blue' },
    { id: 'rush', label: 'Rush Hour', desc: 'High congestion, slower processing', icon: Gauge, color: 'amber' },
    { id: 'accident', label: 'Accident Scenario', desc: 'Random node failures', icon: AlertTriangle, color: 'red' },
]

function FPSMeter() {
    const [fps, setFps] = useState(0)

    useEffect(() => {
        let frameCount = 0
        let lastTime = performance.now()
        let rafId: number

        const tick = () => {
            frameCount++
            const now = performance.now()
            if (now - lastTime >= 1000) {
                setFps(Math.round((frameCount * 1000) / (now - lastTime)))
                frameCount = 0
                lastTime = now
            }
            rafId = requestAnimationFrame(tick)
        }
        rafId = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(rafId)
    }, [])

    return createPortal(
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[10000] bg-black/80 backdrop-blur-md text-emerald-400 font-mono text-xs px-3 py-1.5 rounded-full border border-emerald-500/30 shadow-lg pointer-events-none flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            FPS: {fps}
        </div>,
        document.body
    )
}

export function AdminScreen() {
    const navigate = useNavigate()
    const {
        scenario,
        setScenario,
        phase,
        isRunning,
        reset,
        regions,
        metrics,
        startSimulation,
    } = useTrafficStore()

    const [showDevTools, setShowDevTools] = useState(false)
    const [showFPS, setShowFPS] = useState(false)
    const [showBoundingBoxes, setShowBoundingBoxes] = useState(false)
    const [regionWeights, setRegionWeights] = useState<Record<string, number>>(
        Object.fromEntries(REGIONS.map(r => [r.id, 1]))
    )
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
    const [showNodeModal, setShowNodeModal] = useState(false)

    const handleStartSimulation = async () => {
        try {
            await startSimulation()
            toast.success('Simulation started', {
                description: 'Navigate to the animation page to watch execution.'
            })
            navigate('/parallel')
        } catch (err) {
            toast.error('Failed to start simulation')
        }
    }

    const handleReset = () => {
        reset()
        toast.info('Simulation reset', {
            description: 'All state cleared. Ready for new simulation.'
        })
    }

    const handleNodeClick = (nodeId: string) => {
        setSelectedNodeId(nodeId)
        setShowNodeModal(true)
    }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.metaKey || e.ctrlKey) {
                switch (e.key) {
                    case 's':
                        e.preventDefault()
                        if (!isRunning) handleStartSimulation()
                        break
                    case 'r':
                        e.preventDefault()
                        handleReset()
                        break
                    case 'd':
                        e.preventDefault()
                        setShowDevTools(prev => !prev)
                        break
                    case '1':
                        e.preventDefault()
                        setScenario('light')
                        break
                    case '2':
                        e.preventDefault()
                        setScenario('normal')
                        break
                    case '3':
                        e.preventDefault()
                        setScenario('rush')
                        break
                    case '4':
                        e.preventDefault()
                        setScenario('accident')
                        break
                }
            }
            if (e.key === 'Escape') {
                setShowNodeModal(false)
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isRunning])

    const regionEntries = Object.entries(regions)
    const completedNodes = regionEntries.filter(([, n]) => n.status === 'success').length
    const failedNodes = regionEntries.filter(([, n]) => n.status === 'failed').length
    const processingNodes = regionEntries.filter(([, n]) => n.status === 'processing').length
    const selectedNode = selectedNodeId ? regions[selectedNodeId] : null

    const systemHealth = Math.round((completedNodes / Math.max(regionEntries.length, 1)) * 100) || 95
    const networkHealth = failedNodes > 0 ? 75 : 98

    return (
        <div className="min-h-screen relative overflow-hidden">
            {showFPS && <FPSMeter />}
            {showBoundingBoxes && (
                <style>{`
                    * { outline: 1px solid rgba(239, 68, 68, 0.3) !important; }
                    *:hover { outline: 1px solid rgba(239, 68, 68, 0.8) !important; background-color: rgba(239, 68, 68, 0.05); }
                `}</style>
            )}
            {/* ========== BACKGROUND ========== */}
            <div className="absolute inset-0 -z-10">
                <motion.div
                    className="absolute top-0 left-1/3 w-[700px] h-[700px] bg-primary/12 rounded-full blur-[180px]"
                    animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
                    transition={{ duration: 20, repeat: Infinity }}
                />
                <motion.div
                    className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/8 rounded-full blur-[150px]"
                    animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
                    transition={{ duration: 25, repeat: Infinity }}
                />
                <motion.div
                    className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-emerald-500/6 rounded-full blur-[120px]"
                    animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
                    transition={{ duration: 18, repeat: Infinity }}
                />
                <FloatingParticles />
                <div className="absolute inset-0 opacity-[0.02]" style={{
                    backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                }} />
            </div>

            {/* Node Detail Modal */}
            <NodeDetailModal
                node={selectedNode}
                nodeId={selectedNodeId || ''}
                isOpen={showNodeModal}
                onClose={() => setShowNodeModal(false)}
            />

            <div className="max-w-7xl mx-auto px-4 py-10 relative z-10">
                {/* ================= HEADER ================= */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center mb-10"
                >
                    <motion.div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-border backdrop-blur-sm mb-6"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <motion.div
                            className={cn('w-2.5 h-2.5 rounded-full', isRunning ? 'bg-primary' : 'bg-muted-foreground/40')}
                            animate={isRunning ? { scale: [1, 1.3, 1], opacity: [1, 0.5, 1] } : {}}
                            transition={{ duration: 1, repeat: Infinity }}
                        />
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                            {isRunning ? 'Simulation Running' : 'Control Panel'}
                        </span>
                    </motion.div>

                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center"
                    >
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
                            <Shield className="w-10 h-10 text-primary" />
                        </motion.div>
                    </motion.div>

                    <motion.h1
                        className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                    >
                        <span className="text-foreground">Admin </span>
                        <span className="bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent">
                            Control Center
                        </span>
                    </motion.h1>
                    <motion.p
                        className="text-muted-foreground max-w-xl mx-auto text-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.25 }}
                    >
                        Configure parameters, monitor node status, and access developer tools
                    </motion.p>
                </motion.div>

                {/* ================= HEALTH GAUGES ================= */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="flex flex-wrap justify-center gap-12 mb-10"
                >
                    <HealthGauge value={systemHealth} label="System Health" />
                    <HealthGauge value={networkHealth} label="Network Status" />
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* ================= LEFT: CONTROLS ================= */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Scenario Selection */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="rounded-3xl p-6 border border-border bg-card/30 backdrop-blur-xl relative overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-bold text-lg flex items-center gap-2 uppercase tracking-wider">
                                    <Sliders className="w-5 h-5 text-primary" />
                                    Simulation Scenario
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {SCENARIOS.map((s, i) => {
                                    const colorMap: Record<string, { bg: string; border: string; text: string }> = {
                                        emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' },
                                        blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' },
                                        amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400' },
                                        red: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' },
                                    }
                                    const colors = colorMap[s.color]
                                    const Icon = s.icon
                                    const isSelected = scenario === s.id

                                    return (
                                        <motion.button
                                            key={s.id}
                                            onClick={() => setScenario(s.id)}
                                            whileHover={{ scale: 1.02, y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={cn(
                                                'p-5 rounded-2xl border text-left transition-all relative overflow-hidden',
                                                isSelected
                                                    ? `${colors.border} ${colors.bg} shadow-lg`
                                                    : 'border-border bg-card/30 hover:bg-card/50'
                                            )}
                                        >
                                            {isSelected && (
                                                <motion.div
                                                    layoutId="scenario-active"
                                                    className={`absolute inset-0 ${colors.bg}`}
                                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                                />
                                            )}
                                            <div className="relative z-10">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <motion.div
                                                        className={cn('w-10 h-10 rounded-xl flex items-center justify-center', isSelected ? colors.bg : 'bg-muted')}
                                                        animate={isSelected ? { rotate: [0, 5, -5, 0] } : {}}
                                                        transition={{ duration: 0.5 }}
                                                    >
                                                        <Icon className={cn('w-5 h-5', isSelected ? colors.text : 'text-muted-foreground')} />
                                                    </motion.div>
                                                    <div>
                                                        <span className="font-bold block">{s.label}</span>
                                                        <span className="text-xs text-muted-foreground">⌘{i + 1}</span>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-muted-foreground">{s.desc}</p>
                                            </div>
                                        </motion.button>
                                    )
                                })}
                            </div>
                        </motion.div>

                        {/* Region Weights */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="rounded-3xl p-6 border border-border bg-card/30 backdrop-blur-xl transition-all duration-500"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-bold text-lg flex items-center gap-2 uppercase tracking-wider">
                                    <MapPin className="w-5 h-5 text-primary" />
                                    Region Weights
                                </h2>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {REGIONS.map((region, i) => {
                                    const weight = regionWeights[region.id] || 1
                                    const percentage = ((weight - 0.5) / 2.5) * 100

                                    return (
                                        <motion.div
                                            key={region.id}
                                            whileHover={{ scale: 1.02 }}
                                            className="space-y-2 p-3 rounded-xl bg-card/30 hover:bg-card/50 border border-border hover:border-primary/30 transition-all"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium">{region.emoji} {region.shortName}</span>
                                                <motion.span
                                                    key={weight}
                                                    initial={{ scale: 1.2 }}
                                                    animate={{ scale: 1 }}
                                                    className="text-sm font-mono text-primary font-bold"
                                                >
                                                    {weight.toFixed(1)}x
                                                </motion.span>
                                            </div>
                                            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                                                <motion.div
                                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary/50 to-primary rounded-full"
                                                    animate={{ width: `${percentage}%` }}
                                                    transition={{ type: 'spring', stiffness: 200 }}
                                                />
                                                <input
                                                    type="range"
                                                    min="0.5"
                                                    max="3"
                                                    step="0.1"
                                                    value={weight}
                                                    onChange={(e) => setRegionWeights({
                                                        ...regionWeights,
                                                        [region.id]: parseFloat(e.target.value)
                                                    })}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                />
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="rounded-3xl p-6 border border-border bg-card/30 backdrop-blur-xl"
                        >
                            <h2 className="font-bold text-lg mb-4 flex items-center gap-2 uppercase tracking-wider">
                                <Zap className="w-5 h-5 text-primary" />
                                Quick Actions
                            </h2>
                            <div className="flex flex-wrap gap-3">
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button
                                        onClick={handleStartSimulation}
                                        disabled={isRunning}
                                        className="h-12 gap-2 px-6 bg-primary text-primary-foreground font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl relative overflow-hidden"
                                    >
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                            animate={{ x: ['-100%', '200%'] }}
                                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                                        />
                                        <Play className="w-4 h-4 relative z-10" />
                                        <span className="relative z-10">Start Simulation</span>
                                        <span className="text-xs opacity-60 relative z-10">⌘S</span>
                                    </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button onClick={handleReset} variant="outline" className="h-12 gap-2 rounded-xl px-6 font-bold group">
                                        <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                                        Reset All
                                        <span className="text-xs opacity-60">⌘R</span>
                                    </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button onClick={() => navigate('/input')} variant="outline" className="h-12 gap-2 rounded-xl px-6 font-bold">
                                        <MapPin className="w-4 h-4" />
                                        Route Planner
                                    </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button onClick={() => navigate('/output')} variant="outline" className="h-12 gap-2 rounded-xl px-6 font-bold" disabled={!metrics}>
                                        <BarChart3 className="w-4 h-4" />
                                        View Results
                                    </Button>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Developer Tools */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="rounded-3xl p-6 border border-border bg-card/30 backdrop-blur-xl"
                        >
                            <button onClick={() => setShowDevTools(!showDevTools)} className="w-full flex items-center justify-between">
                                <h2 className="font-bold text-lg flex items-center gap-2 uppercase tracking-wider">
                                    <Layers className="w-5 h-5 text-primary" />
                                    Developer Tools
                                    <span className="text-xs opacity-60 font-normal">⌘D</span>
                                </h2>
                                <motion.div animate={{ rotate: showDevTools ? 90 : 0 }} className="text-muted-foreground">
                                    <ChevronRight className="w-5 h-5" />
                                </motion.div>
                            </button>

                            <AnimatePresence>
                                {showDevTools && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-4 space-y-4 overflow-hidden"
                                    >
                                        <div className="flex flex-wrap gap-3">
                                            <Button onClick={() => setShowFPS(!showFPS)} variant={showFPS ? 'default' : 'outline'} size="sm" className="gap-2 rounded-xl">
                                                {showFPS ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                FPS Meter
                                            </Button>
                                            <Button onClick={() => setShowBoundingBoxes(!showBoundingBoxes)} variant={showBoundingBoxes ? 'default' : 'outline'} size="sm" className="gap-2 rounded-xl">
                                                {showBoundingBoxes ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                Bounding Boxes
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    console.log('Store State:', useTrafficStore.getState())
                                                    toast.info('State logged to console')
                                                }}
                                                variant="outline"
                                                size="sm"
                                                className="gap-2 rounded-xl"
                                            >
                                                <Download className="w-4 h-4" />
                                                Log State
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    const state = useTrafficStore.getState()
                                                    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
                                                    const url = URL.createObjectURL(blob)
                                                    const a = document.createElement('a')
                                                    a.href = url
                                                    a.download = 'traffic-state.json'
                                                    a.click()
                                                    toast.success('State exported')
                                                }}
                                                variant="outline"
                                                size="sm"
                                                className="gap-2 rounded-xl"
                                            >
                                                <Download className="w-4 h-4" />
                                                Export JSON
                                            </Button>
                                        </div>

                                        <div className="bg-black/40 rounded-xl p-4 font-mono text-xs border border-border">
                                            <div>Phase: <span className="text-primary font-bold">{phase}</span></div>
                                            <div>Running: <span className={isRunning ? 'text-emerald-400 font-bold' : 'text-muted-foreground'}>{isRunning ? 'Yes' : 'No'}</span></div>
                                            <div>Scenario: <span className="text-blue-400 font-bold">{scenario}</span></div>
                                            <div>Total Regions: <span className="text-emerald-400 font-bold">{regionEntries.length}</span></div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>

                    {/* ================= RIGHT: STATUS ================= */}
                    <div className="space-y-6">
                        {/* System Status */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="rounded-3xl p-6 border border-border bg-card/30 backdrop-blur-xl"
                        >
                            <h2 className="font-bold text-lg mb-4 flex items-center gap-2 uppercase tracking-wider">
                                <Network className="w-5 h-5 text-primary" />
                                System Status
                            </h2>

                            <div className="space-y-3">
                                {[
                                    { label: 'Cluster Status', value: isRunning ? 'Running' : 'Idle', color: isRunning ? 'text-emerald-400' : 'text-muted-foreground' },
                                    { label: 'Current Phase', value: phase, color: 'text-blue-400' },
                                    { label: 'Active Nodes', value: processingNodes.toString(), color: 'text-primary' },
                                    { label: 'Completed', value: `${completedNodes}/${regionEntries.length}`, color: 'text-emerald-400' },
                                    { label: 'Failed', value: failedNodes.toString(), color: failedNodes > 0 ? 'text-red-400' : 'text-muted-foreground' },
                                ].map((item, i) => (
                                    <motion.div
                                        key={item.label}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + i * 0.05 }}
                                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-card/50 transition-colors"
                                    >
                                        <span className="text-sm text-muted-foreground">{item.label}</span>
                                        <span className={cn('font-bold capitalize', item.color)}>{item.value}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Live Activity Feed */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.25 }}
                            className="rounded-3xl p-6 border border-border bg-card/30 backdrop-blur-xl"
                        >
                            <h2 className="font-bold text-lg mb-4 flex items-center gap-2 uppercase tracking-wider">
                                <Radio className="w-5 h-5 text-primary" />
                                Live Activity
                                <motion.span
                                    className="w-2 h-2 rounded-full bg-emerald-400"
                                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                            </h2>
                            <LiveActivityFeed />
                        </motion.div>

                        {/* Performance Metrics */}
                        {metrics && (
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="rounded-3xl p-6 border border-primary/20 bg-primary/5 backdrop-blur-xl"
                            >
                                <h2 className="font-bold text-lg mb-4 flex items-center gap-2 uppercase tracking-wider">
                                    <BarChart3 className="w-5 h-5 text-primary" />
                                    Last Run Metrics
                                </h2>

                                <div className="space-y-3">
                                    {[
                                        { label: 'Speedup', value: `${metrics.speedupFactor.toFixed(2)}x`, highlight: true },
                                        { label: 'Efficiency', value: `${metrics.efficiency.toFixed(1)}%` },
                                        { label: 'Sequential', value: `${metrics.sequentialTime}ms` },
                                        { label: 'Parallel', value: `${metrics.parallelTime}ms` },
                                    ].map((item, i) => (
                                        <motion.div
                                            key={item.label}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.35 + i * 0.05 }}
                                            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-card/30 transition-colors"
                                        >
                                            <span className="text-sm text-muted-foreground">{item.label}</span>
                                            <span className={cn('font-mono font-bold', item.highlight ? 'text-primary text-lg' : 'text-foreground')}>
                                                {item.value}
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Node Grid - Clickable */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="rounded-3xl p-6 border border-border bg-card/30 backdrop-blur-xl"
                        >
                            <h2 className="font-bold text-lg mb-4 flex items-center gap-2 uppercase tracking-wider">
                                <Cpu className="w-5 h-5 text-primary" />
                                Node Status
                                <span className="text-xs opacity-60 font-normal ml-auto">Click for details</span>
                            </h2>

                            <div className="grid grid-cols-3 gap-2">
                                {regionEntries.map(([id, node], i) => {
                                    const statusConfig: Record<string, { bg: string; border: string; icon: React.FC<{ className?: string }>; color: string }> = {
                                        processing: { bg: 'bg-primary/20', border: 'border-primary/50', icon: RefreshCw, color: 'text-primary' },
                                        success: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', icon: CheckCircle, color: 'text-emerald-400' },
                                        failed: { bg: 'bg-red-500/20', border: 'border-red-500/50', icon: AlertTriangle, color: 'text-red-400' },
                                        idle: { bg: 'bg-card/30', border: 'border-border', icon: Clock, color: 'text-muted-foreground' },
                                    }
                                    const config = statusConfig[node.status] || statusConfig.idle
                                    const Icon = config.icon

                                    return (
                                        <motion.button
                                            key={id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.45 + i * 0.03 }}
                                            whileHover={{ scale: 1.08, y: -4 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleNodeClick(id)}
                                            className={cn(
                                                'p-3 rounded-xl text-center transition-all cursor-pointer relative overflow-hidden',
                                                config.bg,
                                                'border',
                                                config.border,
                                                'hover:shadow-lg'
                                            )}
                                        >
                                            {node.status === 'processing' && (
                                                <motion.div
                                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
                                                    animate={{ x: ['-100%', '100%'] }}
                                                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                                                />
                                            )}
                                            <div className="relative z-10">
                                                <motion.div
                                                    className="mb-1"
                                                    animate={node.status === 'processing' ? { rotate: 360 } : {}}
                                                    transition={{ duration: 1, repeat: node.status === 'processing' ? Infinity : 0, ease: 'linear' }}
                                                >
                                                    <Icon className={cn('w-4 h-4 mx-auto', config.color)} />
                                                </motion.div>
                                                <div className="text-xs truncate font-medium">{node.name.split(' ')[0]}</div>
                                            </div>
                                        </motion.button>
                                    )
                                })}
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* ================= KEYBOARD SHORTCUTS HINT ================= */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-10 flex justify-center"
                >
                    <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
                        {[
                            { keys: '⌘S', action: 'Start' },
                            { keys: '⌘R', action: 'Reset' },
                            { keys: '⌘1-4', action: 'Scenarios' },
                            { keys: '⌘D', action: 'Dev Tools' },
                            { keys: 'ESC', action: 'Close' },
                        ].map((shortcut) => (
                            <div key={shortcut.keys} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card/30 border border-border">
                                <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono font-bold">{shortcut.keys}</kbd>
                                <span>{shortcut.action}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Zoom Backdrop */}
        </div>
    )
}

export default AdminScreen
