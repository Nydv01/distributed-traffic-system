import { useEffect, useState, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Cpu,
  Network,
  Zap,
  Clock,
  ArrowRight,
  Info,
  Radio,
  Activity,
  Gauge,
  Play,
  Layers,
  CheckCircle,
  Circle,
  Sparkles,
  Globe,
  Signal,
  Server,
} from 'lucide-react'
import { useTrafficStore } from '@/stores/trafficStore'
import { LogPanel } from '@/components/LogPanel'
import { cn, getStatusColor, formatTime } from '@/lib/utils'
import { REGION_MAP, RegionId } from '@/lib/designTokens'
import { LOCATIONS } from '@/lib/routeOptimization'
import { Button } from '@/components/ui/button'
import { useScrollGuard } from '@/hooks/usePlayback'
import { InspectorPanel } from '@/components/panels/InspectorPanel'
import { ThreeDTrafficFlow } from '@/components/visualization/ThreeDTrafficFlow'

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

function ConnectionBeams({ nodeCount, isRunning }: { nodeCount: number; isRunning: boolean }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
      <defs>
        <linearGradient id="beam-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[...Array(nodeCount)].map((_, i) => {
        const angle = (i / nodeCount) * Math.PI + Math.PI / 8
        const endX = 50 + Math.cos(angle) * 38
        const endY = 30 + Math.sin(angle) * 22
        return (
          <g key={i}>
            <motion.line
              x1="50%"
              y1="12%"
              x2={`${endX}%`}
              y2={`${endY}%`}
              stroke="url(#beam-grad)"
              strokeWidth="1.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isRunning ? { pathLength: 1, opacity: 0.5 } : { pathLength: 0.3, opacity: 0.2 }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
            />
            {isRunning && (
              <motion.circle
                r="3"
                fill="hsl(var(--primary))"
                initial={{ cx: '50%', cy: '12%' }}
                animate={{
                  cx: [`50%`, `${endX}%`],
                  cy: [`12%`, `${endY}%`],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: 'linear',
                }}
              />
            )}
          </g>
        )
      })}
    </svg>
  )
}

function MetricCard({
  icon: Icon,
  label,
  value,
  highlight,
  index,
}: {
  icon: React.FC<{ className?: string }>
  label: string
  value: string
  highlight?: boolean
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.1 + index * 0.08, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.04, y: -4, transition: { duration: 0.2 } }}
      className={cn(
        'relative p-5 rounded-2xl border backdrop-blur-xl overflow-hidden group',
        highlight
          ? 'bg-primary/10 border-primary/30 shadow-lg shadow-primary/10'
          : 'bg-card/50 border-border hover:border-primary/30'
      )}
    >
      {/* Shimmer on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
      />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <motion.div
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110',
              highlight ? 'bg-primary/20' : 'bg-muted'
            )}
            whileHover={{ rotate: 5 }}
          >
            <Icon className={cn('w-5 h-5', highlight ? 'text-primary' : 'text-muted-foreground')} />
          </motion.div>
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</span>
        </div>
        <div className={cn('text-3xl font-bold tracking-tight', highlight ? 'text-primary' : 'text-foreground')}>
          {value}
        </div>
      </div>
    </motion.div>
  )
}

function PhaseIndicator({ phase }: { phase: string }) {
  const steps = ['requesting', 'processing', 'aggregating', 'complete']
  const currentIndex = steps.indexOf(phase)

  return (
    <div className="flex items-center justify-center gap-4 mb-12">
      {steps.map((step, i) => {
        const isActive = phase === step
        const isDone = currentIndex > i || phase === 'complete'

        return (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
            className="flex items-center gap-4"
          >
            <motion.div
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all',
                isActive ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/30' :
                  isDone ? 'bg-primary/10 border-primary/30 text-primary' :
                    'bg-card/50 border-border text-muted-foreground'
              )}
              whileHover={{ scale: 1.05 }}
              animate={isActive ? { scale: [1, 1.03, 1] } : {}}
              transition={isActive ? { duration: 1.5, repeat: Infinity } : {}}
            >
              {isDone && !isActive ? (
                <CheckCircle className="w-4 h-4" />
              ) : isActive ? (
                <motion.div
                  className="w-2.5 h-2.5 rounded-full bg-current"
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              ) : (
                <Circle className="w-4 h-4" />
              )}
              <span className="text-sm font-semibold capitalize">{step}</span>
            </motion.div>

            {i < steps.length - 1 && (
              <motion.div
                className={cn(
                  'w-8 h-0.5 rounded-full',
                  isDone ? 'bg-primary/50' : 'bg-border'
                )}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: i * 0.15 + 0.3 }}
              />
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

function WorkerCard({
  regionId,
  node,
  index,
  onClick,
}: {
  regionId: string
  node: any
  index: number
  onClick: () => void
}) {
  const loc = LOCATIONS.find(l => l.id === regionId)
  const zone = loc ? REGION_MAP[loc.region as RegionId] : null

  const statusConfig = {
    idle: { border: 'border-border', bg: 'bg-card/40', glow: '' },
    processing: { border: 'border-primary/50', bg: 'bg-primary/5', glow: 'shadow-lg shadow-primary/20' },
    success: { border: 'border-emerald-500/50', bg: 'bg-emerald-500/5', glow: 'shadow-lg shadow-emerald-500/20' },
    failed: { border: 'border-red-500/50', bg: 'bg-red-500/5', glow: 'shadow-lg shadow-red-500/20' },
  }

  const config = statusConfig[node.status as keyof typeof statusConfig]

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: -5 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay: 0.2 + index * 0.08, type: 'spring', stiffness: 150 }}
      whileHover={{ scale: 1.03, y: -8, transition: { duration: 0.25 } }}
      onClick={onClick}
      className={cn(
        'relative rounded-3xl p-5 border cursor-pointer overflow-hidden group backdrop-blur-xl',
        config.border,
        config.bg,
        config.glow
      )}
    >
      {/* Processing scan effect */}
      {node.status === 'processing' && (
        <motion.div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {/* Info icon */}
      <Info className="absolute top-4 right-4 w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors" />

      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <motion.div
          className={cn(
            'w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg border border-white/10',
            zone?.bgColor ?? 'bg-muted'
          )}
          whileHover={{ rotate: 10, scale: 1.1 }}
        >
          {zone?.emoji ?? '📍'}
        </motion.div>
        <div>
          <h3 className="font-bold text-base">{loc?.name.split(' (')[0] ?? regionId}</h3>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Worker Node {index + 1}</div>
        </div>
      </div>

      {/* Status and load */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <motion.span
            className={cn('w-2.5 h-2.5 rounded-full', getStatusColor(node.status))}
            animate={node.status === 'processing' ? { scale: [1, 1.3, 1], opacity: [1, 0.5, 1] } : {}}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
          <span className="text-xs text-muted-foreground capitalize">{node.status}</span>
        </div>
        <span className="text-xl font-bold">{Math.round(node.trafficLoad)}%</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden mb-4">
        <motion.div
          className={cn(
            'h-full rounded-full relative',
            node.status === 'success' ? 'bg-emerald-500' :
              node.status === 'failed' ? 'bg-red-500' : 'bg-primary'
          )}
          animate={{ width: `${node.trafficLoad}%` }}
          transition={{ type: 'spring', stiffness: 80 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        </motion.div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2 rounded-lg bg-black/20 border border-white/5 text-center">
          <div className="text-[9px] text-muted-foreground uppercase">Throughput</div>
          <div className="text-sm font-bold">{node.trafficLoad}%</div>
        </div>
        <div className="p-2 rounded-lg bg-black/20 border border-white/5 text-center">
          <div className="text-[9px] text-muted-foreground uppercase">Latency</div>
          <div className="text-sm font-bold">{node.processingTime}ms</div>
        </div>
      </div>
    </motion.div>
  )
}

export function ParallelAnimationScreen() {
  const navigate = useNavigate()
  const { regions, logs, phase, metrics, isRunning, nodeAnalytics, routeResult } = useTrafficStore()

  const [elapsedTime, setElapsedTime] = useState(0)
  const [startTime] = useState(() => Date.now())
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d')
  const isUserScrolling = useScrollGuard(1500)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const [selectedNodeId, setSelectedNodeId] = useState<RegionId | null>(null)
  const [isInspectorOpen, setIsInspectorOpen] = useState(false)

  const regionEntries = useMemo(
    () => Object.entries(regions) as [string, (typeof regions)[keyof typeof regions]][],
    [regions]
  )

  const getNodeInfo = (stateId: string) => {
    const loc = LOCATIONS.find(l => l.id === stateId)
    const zone = loc ? REGION_MAP[loc.region as RegionId] : null
    return { loc, zone }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    if (!isRunning) return
    const i = setInterval(() => setElapsedTime(Date.now() - startTime), 40)
    return () => clearInterval(i)
  }, [isRunning, startTime])

  const hasNavigated = useRef(false)

  useEffect(() => {
    if (phase === 'complete' && metrics && !hasNavigated.current && !isUserScrolling) {
      hasNavigated.current = true
      const timer = setTimeout(() => navigate('/output'), 800)
      return () => clearTimeout(timer)
    }
  }, [phase, metrics, navigate, isUserScrolling])

  const handleNodeClick = (regionId: string) => {
    setSelectedNodeId(regionId as RegionId)
    setIsInspectorOpen(true)
  }

  const selectedNode = selectedNodeId ? regions[selectedNodeId] : null
  const selectedAnalytics = selectedNodeId ? nodeAnalytics[selectedNodeId] : null

  const stableNodeMetrics = useMemo(() => {
    if (!selectedNodeId) return null
    const seed = selectedNodeId.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    return {
      cpuUsage: 45 + (seed % 40),
      memoryUsage: 200 + (seed % 400),
      throughput: 50 + (seed % 100),
      errorRate: (seed % 20) / 10,
    }
  }, [selectedNodeId])

  return (
    <div ref={scrollRef} className="min-h-screen relative overflow-hidden">
      {/* ========== PREMIUM ANIMATED BACKGROUND ========== */}
      <div className="absolute inset-0 -z-10">
        {/* Parallax gradient orbs */}
        <motion.div
          className="absolute top-0 left-1/3 w-[700px] h-[700px] bg-primary/12 rounded-full blur-[180px]"
          animate={{
            x: (mousePosition.x - (typeof window !== 'undefined' ? window.innerWidth : 1000) / 2) * 0.02,
            y: (mousePosition.y - (typeof window !== 'undefined' ? window.innerHeight : 800) / 2) * 0.02,
          }}
          transition={{ type: 'spring', stiffness: 50, damping: 30 }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/8 rounded-full blur-[150px]"
          animate={{
            x: (mousePosition.x - (typeof window !== 'undefined' ? window.innerWidth : 1000) / 2) * -0.015,
            y: (mousePosition.y - (typeof window !== 'undefined' ? window.innerHeight : 800) / 2) * -0.015,
          }}
          transition={{ type: 'spring', stiffness: 50, damping: 30 }}
        />
        <motion.div
          className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-emerald-500/6 rounded-full blur-[120px]"
          animate={{
            x: (mousePosition.x - (typeof window !== 'undefined' ? window.innerWidth : 1000) / 2) * 0.01,
            y: (mousePosition.y - (typeof window !== 'undefined' ? window.innerHeight : 800) / 2) * 0.01,
          }}
          transition={{ type: 'spring', stiffness: 50, damping: 30 }}
        />

        {/* Floating particles */}
        <FloatingParticles />

        {/* Connection beams */}
        <ConnectionBeams nodeCount={regionEntries.length} isRunning={isRunning} />

        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        {/* ========== HEADER ========== */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="text-center mb-8"
        >
          {/* Status indicator */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-border backdrop-blur-sm mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <motion.div
              className={cn(
                'w-2.5 h-2.5 rounded-full',
                isRunning ? 'bg-primary' : 'bg-muted-foreground/40'
              )}
              animate={isRunning ? { scale: [1, 1.3, 1], opacity: [1, 0.5, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
              {isRunning ? 'Parallel Execution' : 'Standby'}
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-bold tracking-tight mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <span className="text-foreground">Parallel </span>
            <span className="bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent">
              Execution
            </span>
          </motion.h1>
          <motion.p
            className="text-muted-foreground text-lg max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            Real-time distributed computation across {regionEntries.length} regional nodes
          </motion.p>
        </motion.div>

        {/* ========== PHASE STEPPER ========== */}
        <PhaseIndicator phase={phase} />

        {/* ========== METRICS ========== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <MetricCard icon={Clock} label="Execution Time" value={formatTime(metrics?.parallelTime || elapsedTime)} index={0} />
          <MetricCard icon={Zap} label="Speedup" value={metrics ? `${metrics.speedupFactor}x` : '—'} highlight={!!metrics} index={1} />
          <MetricCard icon={Network} label="Active Nodes" value={`${regionEntries.length}`} index={2} />
          <MetricCard icon={Gauge} label="Efficiency" value={metrics ? `${metrics.efficiency.toFixed(0)}%` : '—'} index={3} />
        </div>

        {/* ========== VIEW TOGGLE ========== */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="inline-flex p-1.5 bg-card/50 backdrop-blur-xl rounded-2xl border border-border shadow-lg">
            <button
              onClick={() => setViewMode('2d')}
              className={cn(
                'px-6 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-2',
                viewMode === '2d'
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Layers className="w-4 h-4" />
              Grid View
            </button>
            <button
              onClick={() => setViewMode('3d')}
              className={cn(
                'px-6 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-2',
                viewMode === '3d'
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Play className="w-4 h-4" />
              3D Arena
            </button>
          </div>
        </motion.div>

        {/* ========== MAIN VIEW ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-10 rounded-3xl border border-border bg-card/30 backdrop-blur-xl overflow-hidden shadow-xl"
        >
          {viewMode === '3d' ? (
            <div className="h-[700px]">
              <ThreeDTrafficFlow />
            </div>
          ) : (
            <div className="p-8">
              {/* Central Coordinator */}
              <motion.div
                className="flex justify-center mb-12"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
              >
                <motion.div
                  className="relative"
                  animate={isRunning ? {
                    boxShadow: [
                      '0 0 0 0 rgba(var(--primary-rgb), 0)',
                      '0 0 0 30px rgba(var(--primary-rgb), 0.1)',
                      '0 0 0 0 rgba(var(--primary-rgb), 0)',
                    ],
                  } : {}}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <div className="px-10 py-6 rounded-3xl bg-primary/10 border border-primary/30 flex items-center gap-5 shadow-lg shadow-primary/10 backdrop-blur-xl">
                    <motion.div
                      className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center"
                      animate={isRunning ? { rotate: 360 } : {}}
                      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    >
                      <Cpu className="w-7 h-7 text-primary" />
                    </motion.div>
                    <div>
                      <div className="font-bold text-lg">Coordinator Hub</div>
                      <div className="text-sm text-muted-foreground">Parallel Task Distribution</div>
                    </div>
                  </div>

                  {/* Orbiting dot */}
                  {isRunning && (
                    <motion.div
                      className="absolute w-3 h-3 bg-primary rounded-full shadow-lg shadow-primary/50"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                      style={{ top: '-6px', left: '50%', transformOrigin: '0 50px' }}
                    />
                  )}
                </motion.div>
              </motion.div>

              {/* Worker Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {regionEntries.map(([regionId, node], i) => (
                  <WorkerCard
                    key={regionId}
                    regionId={regionId}
                    node={node}
                    index={i}
                    onClick={() => handleNodeClick(regionId)}
                  />
                ))}
              </div>

              <div className="mt-8" />

              {/* ========== PREMIUM EXECUTION TIMELINE SECTION ========== */}
              <section className="mt-16 mb-20 relative">
                {/* Section Divider / Label */}
                <div className="flex items-center gap-6 mb-10">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/20 to-primary/40" />
                  <div className="flex items-center gap-3 px-6 py-2 rounded-full bg-primary/5 border border-primary/10 backdrop-blur-md">
                    <Zap className="w-4 h-4 text-primary animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Live Orchestration System</span>
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent via-primary/20 to-primary/40" />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="rounded-[40px] bg-card/30 border border-white/5 dark:border-white/10 backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] relative overflow-hidden group/timeline p-12"
                >
                  {/* Blueprint Background Pattern */}
                  <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]" style={{
                    backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                  }} />

                  {/* Timeline Header */}
                  <div className="flex items-center justify-between mb-16 relative z-20">
                    <div className="flex gap-6 items-start">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                        <Activity className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-black text-2xl tracking-tight text-foreground/90 mb-1">Execution Timeline</h4>
                        <p className="text-xs text-muted-foreground/60 font-medium max-w-sm leading-relaxed">
                          Distributed processing visualization with high-precision millisecond tracking across the Indian sovereign network.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <div className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.25em] mb-1 text-right">System Load</div>
                        <div className="text-2xl font-black font-mono tracking-tighter text-emerald-500">98.2<span className="text-xs opacity-50 ml-0.5">%</span></div>
                      </div>
                      <div className="w-px h-10 bg-border/50" />
                      <div className="text-right">
                        <div className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.25em] mb-1 text-right">Throughput</div>
                        <div className="text-2xl font-black font-mono tracking-tighter text-primary">3.2<span className="text-xs opacity-50 ml-0.5">RDS/S</span></div>
                      </div>
                    </div>
                  </div>

                  <div className="relative pt-16 pb-10">
                    {/* Holographic Grid System */}
                    <div className="absolute inset-x-32 md:inset-x-48 top-0 bottom-0 pointer-events-none">
                      <div className="h-full w-full flex justify-between relative">
                        {[0, 250, 500, 750, 1000].map((step) => (
                          <div key={step} className="h-full w-px relative">
                            {/* Main grid line - Tech blueprint style */}
                            <div className="h-full w-px bg-foreground/[0.05] dark:bg-white/[0.05] border-l border-dashed border-foreground/10" />

                            {/* Scale Headings & Tick Marks - Fixed Overlapping */}
                            <div className="absolute top-0 -translate-y-[calc(100%+24px)] -translate-x-1/2 flex flex-col items-center gap-3">
                              <span className="text-[10px] font-black text-muted-foreground/40 font-mono tracking-widest">{step}ms</span>
                              <div className={cn("w-0.5 h-3 rounded-full", step === 0 ? "bg-primary shadow-[0_0_12px_rgba(37,99,235,1)]" : "bg-foreground/20")} />
                            </div>

                            {/* Bottom Cap */}
                            <div className="absolute bottom-0 h-1/4 w-px bg-gradient-to-t from-primary/20 to-transparent" />
                          </div>
                        ))}

                        {/* Dynamic Playhead - The Time Tracker */}
                        {isRunning && (
                          <motion.div
                            className="absolute top-0 bottom-0 w-[2px] bg-primary z-30 pointer-events-none"
                            style={{
                              left: `${(Math.min(elapsedTime, 1000) / 1000) * 100}%`,
                              boxShadow: '0 0 20px hsl(var(--primary)), 0 0 40px hsl(var(--primary)/0.4)',
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <div className="absolute top-0 -translate-x-1/2 -translate-y-[calc(100%+40px)] px-4 py-2 rounded-xl bg-black/90 dark:bg-white text-white dark:text-black text-[11px] font-black shadow-2xl border border-white/20 dark:border-black/10 whitespace-nowrap backdrop-blur-xl">
                              <div className="flex items-center gap-2.5">
                                <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                                <span className="font-mono tabular-nums">{Math.min(elapsedTime, 1000)}ms</span>
                              </div>
                              {/* Small pointer triangle */}
                              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-black/90 dark:border-t-white" />
                            </div>
                            <div className="absolute bottom-0 -translate-x-1/2 translate-y-full w-3 h-3 rounded-full bg-primary shadow-[0_0_20px_rgba(37,99,235,1)] border-4 border-card" />
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {/* Rows Area */}
                    <div className="relative space-y-6 z-10">
                      {regionEntries.map(([regionId, node], i) => {
                        const zone = REGION_MAP[regionId]
                        const progress = node.trafficLoad
                        const startOffset = i * 4

                        return (
                          <div key={regionId} className="flex items-center gap-12 group/row py-2">
                            {/* Region Label - Dynamic on hover */}
                            <div className="w-32 flex items-center gap-5 flex-shrink-0">
                              <motion.div
                                className="text-3xl filter drop-shadow-2xl group-hover/row:scale-125 group-hover/row:rotate-12 transition-all duration-500 ease-out grayscale group-hover/row:grayscale-0 opacity-40 group-hover/row:opacity-100"
                              >
                                {zone?.emoji}
                              </motion.div>
                              <div className="flex flex-col">
                                <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.3em] group-hover/row:text-primary transition-all duration-300">
                                  {zone?.shortName || regionId}
                                </span>
                                <span className="text-[8px] font-bold text-muted-foreground/20 group-hover/row:text-primary/40 uppercase tracking-tighter">
                                  {node.status}
                                </span>
                              </div>
                            </div>

                            {/* Premium Holographic Progress Bar */}
                            <div className="flex-1 h-14 bg-foreground/[0.03] dark:bg-white/[0.02] rounded-3xl relative border border-white/5 shadow-[inset_0_2px_12px_rgba(0,0,0,0.1)] group-hover/row:bg-primary/[0.02] transition-colors duration-500">
                              {/* Reflection Gloss */}
                              <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-transparent rounded-3xl pointer-events-none" />

                              <motion.div
                                className={cn(
                                  'absolute top-2 bottom-2 rounded-2xl shadow-[0_8px_32px_-4px_rgba(0,0,0,0.3)] transition-all duration-1000 ease-[0.16,1,0.3,1]',
                                  node.status === 'success' ? 'bg-gradient-to-r from-emerald-600/80 via-emerald-400 to-emerald-300 shadow-emerald-500/20' :
                                    node.status === 'failed' ? 'bg-gradient-to-r from-red-600/80 via-red-400 to-red-300 shadow-red-500/20' :
                                      'bg-gradient-to-r from-primary/60 via-blue-500 to-cyan-400 shadow-primary/20'
                                )}
                                style={{ left: `${startOffset}%` }}
                                initial={{ width: 0, opacity: 0 }}
                                animate={{
                                  width: `${progress * 0.84}%`,
                                  opacity: 1,
                                  filter: node.status === 'processing' ? 'brightness(1.2) saturate(1.2)' : 'brightness(1)'
                                }}
                                transition={{ delay: i * 0.08, type: 'spring', stiffness: 35, damping: 12 }}
                              >
                                {/* Active Processing Glow */}
                                {node.status === 'processing' && (
                                  <motion.div
                                    className="absolute inset-0 bg-white/20 blur-md rounded-2xl"
                                    animate={{ opacity: [0.2, 0.6, 0.2] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                  />
                                )}

                                {/* Shimmer Light Sweep */}
                                {node.status === 'processing' && (
                                  <motion.div
                                    className="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                                    animate={{ x: ['-200%', '800%'] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                                  />
                                )}

                                {/* Depth Markers */}
                                <div className="absolute inset-x-4 top-1.5 h-1/4 bg-white/30 blur-sm rounded-full opacity-30" />
                                <div className="absolute inset-x-4 bottom-1.5 h-1/4 bg-black/20 blur-sm rounded-full opacity-20" />
                              </motion.div>
                            </div>

                            {/* Execution Data Column */}
                            <div className="w-32 flex items-center justify-end gap-6 flex-shrink-0">
                              <AnimatePresence>
                                {node.status === 'success' && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                    className="text-emerald-500"
                                  >
                                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                                      <CheckCircle className="w-5 h-5" />
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              <div className="text-right flex flex-col items-end">
                                <div className="text-lg font-black font-mono text-foreground/80 tabular-nums tracking-tighter group-hover/row:text-primary transition-colors leading-none">
                                  {node.processingTime}<span className="text-[10px] font-bold text-muted-foreground/40 lowercase ml-1 tracking-tighter">ms</span>
                                </div>
                                <div className="h-4 flex items-center mt-1">
                                  {node.status === 'processing' ? (
                                    <motion.div
                                      className="flex gap-1"
                                      animate={{ opacity: [0.4, 1, 0.4] }}
                                      transition={{ duration: 1, repeat: Infinity }}
                                    >
                                      {[1, 2, 3].map(j => (
                                        <div key={j} className="w-2 h-0.5 bg-primary/40 rounded-full" />
                                      ))}
                                    </motion.div>
                                  ) : (
                                    <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/20">Standby</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </motion.div>
              </section>
            </div>
          )}
        </motion.div>

        {/* ========== COMPLETE CTA ========== */}
        <AnimatePresence>
          {phase === 'complete' && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center gap-6 mb-10"
            >
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Execution Complete</h3>
                <p className="text-muted-foreground">View detailed route optimization analysis</p>
              </div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={() => navigate('/output')}
                  size="lg"
                  className="h-14 px-10 rounded-2xl gap-3 text-lg font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  />
                  <Sparkles className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">View Results</span>
                  <ArrowRight className="w-5 h-5 relative z-10" />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ========== LOGS ========== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-3xl overflow-hidden border border-border bg-card/30 backdrop-blur-xl mb-6"
        >
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Radio className="w-5 h-5 text-muted-foreground" />
              <span className="font-semibold">Execution Log</span>
            </div>
            {isRunning && (
              <motion.div
                className="flex items-center gap-2 text-xs text-primary"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                Live
              </motion.div>
            )}
          </div>
          <LogPanel logs={logs} maxHeight="280px" />
        </motion.div>

        <div className="flex justify-center">
          <Button variant="ghost" onClick={() => navigate('/output')} className="text-muted-foreground">
            Skip to results
          </Button>
        </div>

        {/* ========== INSPECTOR ========== */}
        <InspectorPanel
          node={
            selectedNode && stableNodeMetrics
              ? (() => {
                const { loc, zone } = getNodeInfo(selectedNodeId!)
                return {
                  id: selectedNodeId!,
                  name: loc?.name || selectedNodeId!,
                  status: selectedNode.status,
                  region: zone?.name || 'Unknown Zone',
                  trafficLoad: selectedNode.trafficLoad,
                  cpuUsage: stableNodeMetrics.cpuUsage,
                  memoryUsage: stableNodeMetrics.memoryUsage,
                  lastUpdated: selectedNode.lastUpdated,
                  metrics: {
                    latencyMs: selectedNode.processingTime,
                    throughput: stableNodeMetrics.throughput,
                    errorRate: selectedNode.status === 'failed' ? 5 + stableNodeMetrics.errorRate : stableNodeMetrics.errorRate,
                  },
                  analytics: selectedAnalytics || undefined,
                  logs: logs
                    .filter(l => l.region === selectedNodeId)
                    .slice(-20)
                    .map(l => ({
                      timestamp: l.timestamp,
                      level: l.type === 'error' ? ('error' as const) : l.type === 'warning' ? ('warn' as const) : ('info' as const),
                      message: l.message,
                    })),
                }
              })()
              : null
          }
          isOpen={isInspectorOpen}
          onClose={() => setIsInspectorOpen(false)}
        />
      </div>
    </div>
  )
}
