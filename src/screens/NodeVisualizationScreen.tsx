import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Network,
  Activity,
  Gauge,
  Timer,
  Cpu,
  Zap,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2,
  Server,
  Wifi,
  HardDrive,
  Signal,
  Globe,
  Sparkles,
} from 'lucide-react'
import { useTrafficStore } from '@/stores/trafficStore'
import { LogPanel } from '@/components/LogPanel'
import { cn, getStatusColor } from '@/lib/utils'
import { RegionId, RegionNode } from '@/types/traffic'
import { REGION_MAP } from '@/lib/designTokens'
import { Button } from '@/components/ui/button'

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

function ConnectionWeb({ nodeCount, isRunning }: { nodeCount: number; isRunning: boolean }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
      <defs>
        <linearGradient id="node-line-gradient" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      {[...Array(nodeCount)].map((_, i) => {
        const angle = (i / nodeCount) * Math.PI * 2
        const endX = 50 + Math.cos(angle) * 35
        const endY = 50 + Math.sin(angle) * 35
        return (
          <motion.line
            key={i}
            x1="50%"
            y1="50%"
            x2={`${endX}%`}
            y2={`${endY}%`}
            stroke="url(#node-line-gradient)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: isRunning ? 1 : 0.5 }}
            transition={{ duration: 0.8, delay: i * 0.05 }}
          />
        )
      })}
    </svg>
  )
}

function StatBadge({
  icon: Icon,
  label,
  value,
  index,
  highlight
}: {
  icon: React.FC<{ className?: string }>
  label: string
  value: string | number
  index: number
  highlight?: boolean
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
          ? 'bg-primary/10 border-primary/30'
          : 'bg-card/50 border-border hover:border-primary/30'
      )}
    >
      {/* Shimmer on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
      />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110',
            highlight ? 'bg-primary/20' : 'bg-muted'
          )}>
            <Icon className={cn('w-5 h-5', highlight ? 'text-primary' : 'text-muted-foreground')} />
          </div>
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</span>
        </div>
        <div className={cn(
          'text-3xl font-bold tracking-tight',
          highlight ? 'text-primary' : 'text-foreground'
        )}>
          {value}
        </div>
      </div>
    </motion.div>
  )
}

function NodeCard({
  regionId,
  node,
  index,
  trafficData,
}: {
  regionId: RegionId
  node: RegionNode
  index: number
  trafficData: any
}) {
  const zone = REGION_MAP[regionId]

  const statusConfig = {
    idle: {
      border: 'border-border',
      bg: 'bg-card/40',
      glow: '',
      icon: Timer,
      iconColor: 'text-muted-foreground'
    },
    processing: {
      border: 'border-primary/50',
      bg: 'bg-primary/5',
      glow: 'shadow-lg shadow-primary/20',
      icon: Loader2,
      iconColor: 'text-primary'
    },
    success: {
      border: 'border-emerald-500/50',
      bg: 'bg-emerald-500/5',
      glow: 'shadow-lg shadow-emerald-500/20',
      icon: CheckCircle,
      iconColor: 'text-emerald-500'
    },
    failed: {
      border: 'border-red-500/50',
      bg: 'bg-red-500/5',
      glow: 'shadow-lg shadow-red-500/20',
      icon: AlertCircle,
      iconColor: 'text-red-500'
    },
  }

  const config = statusConfig[node.status]
  const StatusIcon = config.icon

  const stableStats = useMemo(() => ({
    latency: 10 + Math.floor(Math.random() * 50),
    packets: Math.floor(Math.random() * 500) + 100,
  }), [regionId, node.status])

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: -5 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{
        delay: 0.15 + index * 0.08,
        type: 'spring',
        stiffness: 150,
        damping: 20
      }}
      whileHover={{
        scale: 1.03,
        y: -8,
        transition: { duration: 0.25 }
      }}
      className={cn(
        'relative rounded-3xl p-6 border backdrop-blur-xl overflow-hidden cursor-default group',
        config.border,
        config.bg,
        config.glow
      )}
    >
      {/* Animated border glow for processing */}
      {node.status === 'processing' && (
        <motion.div
          className="absolute inset-0 rounded-3xl"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(var(--primary-rgb), 0.1), transparent)',
          }}
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {/* Scan line for processing */}
      {node.status === 'processing' && (
        <motion.div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-5 relative z-10">
        <div className="flex items-center gap-4">
          <motion.div
            className={cn(
              'w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg border border-white/10',
              zone?.bgColor ?? 'bg-muted'
            )}
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {zone?.emoji ?? '📍'}
          </motion.div>
          <div>
            <h3 className="font-bold text-lg tracking-tight">{node.name}</h3>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">
              {zone?.name || regionId} Zone
            </div>
          </div>
        </div>

        <motion.div
          className={cn(
            'px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border',
            node.status === 'processing' && 'bg-primary/10 text-primary border-primary/30',
            node.status === 'success' && 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
            node.status === 'failed' && 'bg-red-500/10 text-red-500 border-red-500/30',
            node.status === 'idle' && 'bg-muted text-muted-foreground border-border',
          )}
          animate={node.status === 'processing' ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <StatusIcon className={cn('w-3.5 h-3.5', node.status === 'processing' && 'animate-spin')} />
          <span className="capitalize">{node.status}</span>
        </motion.div>
      </div>

      {/* Load indicator */}
      <div className="mb-5 relative z-10">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Traffic Load</span>
          <span className="font-bold text-lg">{node.trafficLoad}%</span>
        </div>
        <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
          <motion.div
            className={cn(
              'h-full rounded-full relative',
              node.status === 'success' ? 'bg-emerald-500' :
                node.status === 'failed' ? 'bg-red-500' : 'bg-primary'
            )}
            initial={{ width: 0 }}
            animate={{ width: `${node.trafficLoad}%` }}
            transition={{ type: 'spring', stiffness: 80, damping: 15 }}
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 }}
            />
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 relative z-10">
        {[
          { label: 'Latency', value: `${stableStats.latency}ms`, icon: Wifi },
          { label: 'Packets', value: `${stableStats.packets}`, icon: HardDrive },
          { label: 'CPU', value: `${node.trafficLoad}%`, icon: Cpu },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="text-center p-3 rounded-xl bg-black/20 border border-white/5 group-hover:bg-black/30 transition-all"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.08 + i * 0.05 }}
          >
            <stat.icon className="w-3.5 h-3.5 mx-auto mb-1 text-muted-foreground" />
            <div className="text-sm font-bold">{stat.value}</div>
            <div className="text-[9px] text-muted-foreground uppercase tracking-wider">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Data freshness indicator */}
      <motion.div
        className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 + index * 0.08 }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-emerald-400"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-muted-foreground">Updated {node.status === 'processing' ? '0.3s' : node.status === 'success' ? 'just now' : '—'}</span>
        </div>
        <div className="text-muted-foreground">
          <span className="font-bold text-foreground">{stableStats.packets}</span> roads processed
        </div>
      </motion.div>
    </motion.div>
  )
}

export function NodeVisualizationScreen() {
  const navigate = useNavigate()
  const { regions, logs, phase, isRunning, trafficData } = useTrafficStore()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    if (phase === 'processing') {
      const t = setTimeout(() => navigate('/parallel'), 600)
      return () => clearTimeout(t)
    }
  }, [phase, navigate])

  const regionEntries = Object.entries(regions) as [RegionId, RegionNode][]
  const completed = regionEntries.filter(([, n]) => n.status === 'success').length
  const processing = regionEntries.filter(([, n]) => n.status === 'processing').length
  const failed = regionEntries.filter(([, n]) => n.status === 'failed').length

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* ========== PREMIUM ANIMATED BACKGROUND ========== */}
      <div className="absolute inset-0 -z-10">
        {/* Parallax gradient orbs */}
        <motion.div
          className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-primary/12 rounded-full blur-[180px]"
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
          className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-emerald-500/6 rounded-full blur-[120px]"
          animate={{
            x: (mousePosition.x - (typeof window !== 'undefined' ? window.innerWidth : 1000) / 2) * 0.01,
            y: (mousePosition.y - (typeof window !== 'undefined' ? window.innerHeight : 800) / 2) * 0.01,
          }}
          transition={{ type: 'spring', stiffness: 50, damping: 30 }}
        />

        {/* Floating particles */}
        <FloatingParticles />

        {/* Connection web */}
        <ConnectionWeb nodeCount={regionEntries.length} isRunning={isRunning} />

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
          className="text-center mb-12"
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
              {isRunning ? 'Cluster Active' : 'Standby Mode'}
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-bold tracking-tight mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <span className="text-foreground">Regional </span>
            <span className="bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent">
              Nodes
            </span>
          </motion.h1>
          <motion.p
            className="text-muted-foreground text-lg max-w-xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            Distributed cluster of {regionEntries.length} traffic processing nodes across India
          </motion.p>
        </motion.div>

        {/* ========== STATS ========== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatBadge icon={Network} label="Total Nodes" value={regionEntries.length} index={0} />
          <StatBadge icon={Activity} label="Phase" value={phase} index={1} />
          <StatBadge icon={CheckCircle} label="Completed" value={`${completed}/${regionEntries.length}`} index={2} highlight={completed > 0} />
          <StatBadge icon={Gauge} label="Processing" value={processing} index={3} highlight={processing > 0} />
        </div>

        {/* ========== PROGRESS BAR ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-3xl bg-card/40 border border-border backdrop-blur-xl mb-10 relative overflow-hidden"
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-primary" />
                <span className="font-semibold">Cluster Progress</span>
              </div>
              <span className="text-3xl font-bold">
                {Math.round((completed / regionEntries.length) * 100)}%
              </span>
            </div>
            <div className="h-3 bg-muted/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary via-blue-500 to-primary relative"
                initial={{ width: 0 }}
                animate={{ width: `${(completed / regionEntries.length) * 100}%` }}
                transition={{ type: 'spring', stiffness: 60, damping: 15 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </motion.div>
            </div>
            <div className="flex justify-between mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-500" /> {completed} completed
              </span>
              <span className="flex items-center gap-1">
                <Loader2 className="w-3 h-3 text-primary animate-spin" /> {processing} processing
              </span>
              <span className="flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-red-500" /> {failed} failed
              </span>
            </div>
          </div>
        </motion.div>

        {/* ========== NODES GRID ========== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {regionEntries.map(([regionId, node], i) => (
            <NodeCard
              key={regionId}
              regionId={regionId}
              node={node}
              index={i}
              trafficData={trafficData[regionId]}
            />
          ))}
        </div>

        {/* ========== CTA ========== */}
        <AnimatePresence>
          {(phase === 'aggregating' || phase === 'optimizing' || phase === 'complete') && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex justify-center mb-10"
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={() => navigate('/output')}
                  size="lg"
                  className="h-14 px-10 rounded-2xl gap-3 text-lg font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
                >
                  <Sparkles className="w-5 h-5" />
                  View Analysis
                  <ArrowRight className="w-5 h-5" />
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
          className="rounded-3xl overflow-hidden border border-border bg-card/30 backdrop-blur-xl"
        >
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Signal className="w-5 h-5 text-muted-foreground" />
              <span className="font-semibold">System Logs</span>
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
      </div>
    </div>
  )
}
