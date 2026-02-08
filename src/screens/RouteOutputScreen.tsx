import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Route,
  Clock,
  Zap,
  ArrowRight,
  RotateCcw,
  TrendingUp,
  Activity,
  Download,
  Share,
  Globe,
  Timer,
  Gauge,
  Server,
  Network,
  Info,
  HelpCircle,
  X,
  ChevronRight,
  MapPin,
} from 'lucide-react'
import { toast } from 'sonner'
import { useTrafficStore } from '@/stores/trafficStore'
import { LogPanel } from '@/components/LogPanel'
import { EmptyState } from '@/components/feedback/EmptyState'
import { CartesianLineGraph } from '@/components/visualization/CartesianLineGraph'
import { Button } from '@/components/ui/button'
import { cn, getCongestionColor, formatTime } from '@/lib/utils'
import { LOCATIONS } from '@/lib/routeOptimization'
import { quickExportPDF } from '@/lib/pdfExport'

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

function Tooltip({ children, content }: { children: React.ReactNode; content: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.98 }}
            className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-3 w-72 p-4 rounded-xl bg-card border border-border shadow-2xl backdrop-blur-xl"
          >
            {content}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-card border-r border-b border-border rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function DetailModal({
  isOpen,
  onClose,
  title,
  icon: Icon,
  children,
}: {
  isOpen: boolean
  onClose: () => void
  title: string
  icon: React.FC<{ className?: string }>
  children: React.ReactNode
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, zIndex: 99999 }}
            className="bg-black/70 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
              position: 'fixed',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 100000,
              width: '100%',
              maxWidth: '32rem',
              padding: '0 1rem'
            }}
          >
            <div className="p-6 rounded-3xl bg-card border border-border shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">{title}</h3>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted-foreground/20 transition-colors"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body)
  }
  return null
}

function PremiumCard({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        'relative rounded-3xl bg-card/40 border border-border backdrop-blur-xl overflow-hidden group',
        'transition-shadow duration-300 hover:shadow-2xl hover:shadow-primary/10',
        className
      )}
    >
      <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

function MetricCardHover({
  icon: Icon,
  value,
  label,
  explanation,
  formula,
  index,
  highlight,
}: {
  icon: React.FC<{ className?: string }>
  value: string | number
  label: string
  explanation: string
  formula?: string
  index: number
  highlight?: boolean
}) {
  return (
    <Tooltip
      content={
        <div>
          <div className="font-semibold text-sm mb-2">{label}</div>
          <p className="text-xs text-muted-foreground mb-2">{explanation}</p>
          {formula && <div className="p-2 rounded-lg bg-muted/50 font-mono text-xs text-primary">{formula}</div>}
        </div>
      }
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.1 + index * 0.08, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.04, y: -4, transition: { duration: 0.2 } }}
        className={cn(
          'relative p-6 rounded-2xl border backdrop-blur-xl overflow-hidden cursor-help group',
          highlight ? 'bg-primary/10 border-primary/30' : 'bg-card/50 border-border hover:border-primary/30'
        )}
      >
        <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        <div className="absolute top-3 right-3">
          <HelpCircle className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
        </div>
        <div className="relative z-10">
          <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-3', highlight ? 'bg-primary/20' : 'bg-muted')}>
            <Icon className={cn('w-6 h-6', highlight ? 'text-primary' : 'text-muted-foreground')} />
          </div>
          <div className={cn('text-3xl font-bold tracking-tight mb-1', highlight ? 'text-primary' : 'text-foreground')}>{value}</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{label}</div>
        </div>
      </motion.div>
    </Tooltip>
  )
}

function RouteStatCardClick({
  icon: Icon,
  value,
  label,
  modalContent,
  color,
  index,
}: {
  icon: React.FC<{ className?: string }>
  value: string | number
  label: string
  modalContent: React.ReactNode
  color?: string
  index: number
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{
          opacity: 1,
          scale: isHovered ? 1.06 : 1,
          y: isHovered ? -12 : 0,
          rotateX: isHovered ? -2 : 0,
        }}
        transition={{
          delay: isHovered ? 0 : 0.4 + index * 0.1,
          type: 'spring',
          stiffness: 400,
          damping: 25
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => setIsOpen(true)}
        style={{
          perspective: 1000,
          transformStyle: 'preserve-3d',
        }}
        className={cn(
          "p-5 rounded-2xl border text-center cursor-pointer relative",
          "transition-all duration-300 ease-out",
          isHovered
            ? "bg-card/80 border-primary/50 shadow-2xl shadow-primary/25"
            : "bg-muted/30 border-border"
        )}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-primary/10 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Content */}
        <div className="relative z-10">
          <motion.div
            animate={{
              scale: isHovered ? 1.15 : 1,
              rotate: isHovered ? 8 : 0,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Icon className={cn(
              'w-6 h-6 mx-auto mb-3 transition-colors duration-300',
              isHovered ? (color || 'text-primary') : (color || 'text-muted-foreground')
            )} />
          </motion.div>
          <motion.div
            className="text-2xl font-bold mb-1"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {value}
          </motion.div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider flex items-center justify-center gap-1">
            {label} <Info className={cn('w-3 h-3 transition-opacity duration-300', isHovered ? 'opacity-100' : 'opacity-60')} />
          </div>
        </div>
      </motion.div>
      <DetailModal isOpen={isOpen} onClose={() => setIsOpen(false)} title={label} icon={Icon}>
        {modalContent}
      </DetailModal>
    </>
  )
}

function RouteStep({ name, index, isFirst, isLast, onClick }: { name: string; index: number; isFirst: boolean; isLast: boolean; onClick: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.8, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.5 + index * 0.1, type: 'spring', stiffness: 200 }} className="flex items-center">
      <motion.div
        onClick={onClick}
        className={cn(
          'relative px-4 py-2.5 rounded-xl border font-semibold text-sm transition-all cursor-pointer',
          isFirst ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/20' :
            isLast ? 'bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20' :
              'bg-primary/10 border-primary/30 text-primary hover:bg-primary/20'
        )}
        whileHover={{ scale: 1.1, y: -4 }}
        whileTap={{ scale: 0.95 }}
      >
        {name}
        {(isFirst || isLast) && (
          <motion.div
            className={cn('absolute inset-0 rounded-xl border-2', isFirst ? 'border-emerald-500/40' : 'border-red-500/40')}
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.div>
      {!isLast && (
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.6 + index * 0.1 }} className="mx-2">
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </motion.div>
      )}
    </motion.div>
  )
}

function PerformanceComparison({ sequentialTime, parallelTime, speedup }: { sequentialTime: number; parallelTime: number; speedup: number }) {
  const improvement = ((1 - parallelTime / sequentialTime) * 100).toFixed(0)
  const timeSaved = sequentialTime - parallelTime

  return (
    <div className="space-y-6">
      <div className="space-y-5">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Sequential Time</span>
            <span className="font-bold">{formatTime(sequentialTime)}</span>
          </div>
          <div className="h-4 bg-muted/50 rounded-full overflow-hidden">
            <motion.div className="h-full bg-muted-foreground/40 rounded-full" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ delay: 0.3, duration: 0.8 }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Parallel Time</span>
            <span className="font-bold text-primary">{formatTime(parallelTime)}</span>
          </div>
          <div className="h-4 bg-muted/50 rounded-full overflow-hidden">
            <motion.div className="h-full bg-primary rounded-full relative" initial={{ width: 0 }} animate={{ width: `${(parallelTime / sequentialTime) * 100}%` }} transition={{ delay: 0.5, duration: 0.8 }}>
              <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" animate={{ x: ['-100%', '100%'] }} transition={{ duration: 1.5, repeat: 3, delay: 0.8 }} />
            </motion.div>
          </div>
        </div>
      </div>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 }} className="p-6 bg-primary/10 border border-primary/30 rounded-2xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Time Reduction</div>
            <div className="text-4xl font-bold text-primary">{improvement}%</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground mb-1">Speedup Factor</div>
            <div className="text-4xl font-bold">{speedup.toFixed(2)}x</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground mb-1">Time Saved</div>
            <div className="text-4xl font-bold text-emerald-500">{timeSaved}ms</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export function RouteOutputScreen() {
  const navigate = useNavigate()
  const { routeResult, metrics, logs, source, destination, reset, nodeAnalytics, systemAnalytics, startedAt, finishedAt } = useTrafficStore()

  const [isExporting, setIsExporting] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [selectedStep, setSelectedStep] = useState<string | null>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePosition({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const sourceName = LOCATIONS.find(l => l.id === source)?.name ?? 'Unknown'
  const destName = LOCATIONS.find(l => l.id === destination)?.name ?? 'Unknown'

  if (!routeResult) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <EmptyState icon={Route} title="No Route Calculated" description="Configure source and destination, then run the simulation." action={{ label: 'Start Simulation', onClick: () => navigate('/input') }} />
      </div>
    )
  }

  const speedup = metrics ? metrics.speedupFactor : 0
  const nodeCount = Object.keys(nodeAnalytics).length || 6
  const avgSpeed = routeResult.estimatedTime > 0 ? (routeResult.totalDistance / (routeResult.estimatedTime / 60)).toFixed(0) : '60'
  const selectedLocation = selectedStep ? LOCATIONS.find(l => l.id === selectedStep || l.name === selectedStep) : null

  const hasShownToast = useRef(false)
  useEffect(() => {
    if (routeResult && metrics && !hasShownToast.current) {
      hasShownToast.current = true
      toast.success('Route optimization complete!', { description: `Achieved ${speedup.toFixed(1)}x speedup`, duration: 5000 })
    }
  }, [routeResult, metrics, speedup])

  const handleExportPDF = async () => {
    if (!metrics) return
    setIsExporting(true)
    try {
      await quickExportPDF({ elementId: 'results-content', source: sourceName, destination: destName, metrics, systemAnalytics, nodeAnalytics, routeResult, startedAt, finishedAt })
      toast.success('PDF exported!')
    } catch (err) {
      toast.error('Export failed')
    } finally {
      setIsExporting(false)
    }
  }

  const congestionStr = String(routeResult.congestionLevel).toLowerCase()

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <motion.div className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-primary/12 rounded-full blur-[180px]" animate={{ x: (mousePosition.x - (typeof window !== 'undefined' ? window.innerWidth : 1000) / 2) * 0.02, y: (mousePosition.y - (typeof window !== 'undefined' ? window.innerHeight : 800) / 2) * 0.02 }} transition={{ type: 'spring', stiffness: 50, damping: 30 }} />
        <motion.div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/8 rounded-full blur-[150px]" animate={{ x: (mousePosition.x - (typeof window !== 'undefined' ? window.innerWidth : 1000) / 2) * -0.015, y: (mousePosition.y - (typeof window !== 'undefined' ? window.innerHeight : 800) / 2) * -0.015 }} transition={{ type: 'spring', stiffness: 50, damping: 30 }} />
        <FloatingParticles />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      {/* Route step modal */}
      <DetailModal isOpen={!!selectedStep} onClose={() => setSelectedStep(null)} title={selectedStep || 'Location'} icon={MapPin}>
        {selectedLocation && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-muted/50 border border-border">
              <div className="text-xs text-muted-foreground uppercase mb-1">Region</div>
              <div className="font-semibold">{selectedLocation.region}</div>
            </div>
            {routeResult.path.indexOf(selectedStep!) === 0 && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-sm">🚀 Journey starts here</div>
            )}
            {routeResult.path.indexOf(selectedStep!) === routeResult.path.length - 1 && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm">🏁 Final destination</div>
            )}
          </div>
        )}
      </DetailModal>

      <div id="results-content" className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-border backdrop-blur-sm mb-6" whileHover={{ scale: 1.05 }}>
            <motion.div className="w-2.5 h-2.5 rounded-full bg-emerald-500" animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 1, repeat: Infinity }} />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Optimization Complete</span>
          </motion.div>
          <motion.h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
            <span className="text-foreground">Route </span>
            <span className="bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent">Results</span>
          </motion.h1>
          <motion.p className="text-muted-foreground text-lg max-w-xl mx-auto">Hover metrics for details • Click route stats for explanation</motion.p>
        </motion.div>

        {/* Hero Metrics - hover */}
        {metrics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <MetricCardHover icon={Zap} value={`${metrics.speedupFactor.toFixed(1)}x`} label="Speedup" explanation="Factor of improvement compared to sequential processing." formula={`${metrics.sequentialTime}ms / ${metrics.parallelTime}ms = ${metrics.speedupFactor.toFixed(2)}x`} index={0} highlight />
            <MetricCardHover icon={Clock} value={formatTime(metrics.parallelTime)} label="Parallel Time" explanation="Execution time when all nodes process simultaneously." index={1} />
            <MetricCardHover icon={Gauge} value={`${metrics.efficiency.toFixed(0)}%`} label="Efficiency" explanation="How well we utilize parallel workers. 100% = perfect scaling." formula={`(${metrics.speedupFactor.toFixed(2)} / ${nodeCount}) × 100`} index={2} />
            <MetricCardHover icon={Network} value={nodeCount} label="Nodes" explanation="Distributed regional nodes that processed traffic data." index={3} />
          </div>
        )}

        {/* Route */}
        <PremiumCard className="p-8 mb-10" delay={0.2}>
          <div className="flex items-center gap-3 mb-8">
            <motion.div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center" whileHover={{ rotate: 10, scale: 1.1 }}>
              <Route className="w-6 h-6 text-muted-foreground" />
            </motion.div>
            <div>
              <h3 className="text-xl font-bold">Optimal Route</h3>
              <p className="text-sm text-muted-foreground">{sourceName} → {destName}</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {routeResult.path.map((loc, i) => (
              <RouteStep key={loc} name={loc} index={i} isFirst={i === 0} isLast={i === routeResult.path.length - 1} onClick={() => setSelectedStep(loc)} />
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <RouteStatCardClick icon={Route} value={`${routeResult.totalDistance} km`} label="Distance" index={0} modalContent={
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Total distance using Haversine formula between {routeResult.path.length} waypoints.</p>
                <div className="p-4 rounded-xl bg-muted/50 border border-border">
                  <div className="text-2xl font-bold text-primary">{routeResult.totalDistance} km</div>
                </div>
                <div className="space-y-2 text-sm">
                  {['Earth curvature (Haversine)', 'Road network approximation'].map((f, i) => <div key={i} className="flex items-center gap-2"><ChevronRight className="w-3 h-3 text-primary" />{f}</div>)}
                </div>
              </div>
            } />
            <RouteStatCardClick icon={Timer} value={`${routeResult.estimatedTime} min`} label="Travel Time" color="text-blue-500" index={1} modalContent={
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Estimated time based on distance and traffic.</p>
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                  <div className="font-mono text-sm">Distance ÷ Speed = Time</div>
                  <div className="font-mono text-sm">{routeResult.totalDistance} km ÷ {avgSpeed} km/h = <span className="font-bold text-blue-500">~{routeResult.estimatedTime} min</span></div>
                </div>
              </div>
            } />
            <RouteStatCardClick icon={Activity} value={routeResult.congestionLevel} label="Congestion" color={getCongestionColor(routeResult.congestionLevel)} index={2} modalContent={
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Overall congestion based on real-time traffic data.</p>
                <div className={cn('p-4 rounded-xl border', congestionStr === 'low' ? 'bg-emerald-500/10 border-emerald-500/30' : congestionStr === 'medium' ? 'bg-amber-500/10 border-amber-500/30' : 'bg-red-500/10 border-red-500/30')}>
                  <div className="text-xs text-muted-foreground mb-1">Current Level</div>
                  <div className={cn('text-2xl font-bold', congestionStr === 'low' ? 'text-emerald-500' : congestionStr === 'medium' ? 'text-amber-500' : 'text-red-500')}>{routeResult.congestionLevel}</div>
                </div>
              </div>
            } />
            <RouteStatCardClick icon={Globe} value={routeResult.affectedRegions.length} label="Regions" color="text-amber-500" index={3} modalContent={
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Regional traffic zones the route passes through.</p>
                <div className="flex flex-wrap gap-2">{routeResult.affectedRegions.map(r => <span key={r} className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-500 text-sm">{r}</span>)}</div>
              </div>
            } />
          </div>
        </PremiumCard>

        {/* Performance */}
        {metrics && (
          <PremiumCard className="p-8 mb-10" delay={0.3}>
            <div className="flex items-center gap-3 mb-8">
              <motion.div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center" whileHover={{ rotate: -10, scale: 1.1 }}>
                <TrendingUp className="w-6 h-6 text-muted-foreground" />
              </motion.div>
              <div>
                <h3 className="text-xl font-bold">Performance Comparison</h3>
                <p className="text-sm text-muted-foreground">Sequential vs Parallel execution</p>
              </div>
            </div>
            <PerformanceComparison sequentialTime={metrics.sequentialTime} parallelTime={metrics.parallelTime} speedup={metrics.speedupFactor} />
          </PremiumCard>
        )}

        {/* Graph */}
        {metrics && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mb-10">
            <CartesianLineGraph sequentialTime={metrics.sequentialTime} parallelTime={metrics.parallelTime} speedup={metrics.speedupFactor} />
          </motion.div>
        )}

        {/* ========== VISUAL ROUTE PATH ========== */}
        <PremiumCard className="p-8 mb-10" delay={0.4}>
          <div className="flex items-center gap-3 mb-6">
            <motion.div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center" whileHover={{ rotate: 10, scale: 1.1 }}>
              <MapPin className="w-6 h-6 text-muted-foreground" />
            </motion.div>
            <div>
              <h3 className="text-xl font-bold">Route Path</h3>
              <p className="text-sm text-muted-foreground">Node-to-node breakdown with estimated distances</p>
            </div>
          </div>

          <div className="space-y-3">
            {routeResult.path.map((loc, i) => {
              const isFirst = i === 0
              const isLast = i === routeResult.path.length - 1
              const nextLoc = routeResult.path[i + 1]
              // Calculate consistent segment distance based on location names
              const seed = (loc.charCodeAt(0) + (nextLoc?.charCodeAt(0) || 0)) * (i + 1)
              const variation = (seed % 20) - 10
              const segmentDist = isLast ? null : Math.floor(routeResult.totalDistance / (routeResult.path.length - 1) + variation)

              return (
                <motion.div
                  key={loc}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <div className="flex items-center gap-4">
                    {/* Node indicator */}
                    <div className="flex flex-col items-center">
                      <motion.div
                        className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center border-2',
                          isFirst ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' :
                            isLast ? 'bg-red-500/20 border-red-500 text-red-500' :
                              'bg-primary/20 border-primary text-primary'
                        )}
                        whileHover={{ scale: 1.1 }}
                      >
                        <span className="text-sm font-bold">{i + 1}</span>
                      </motion.div>
                      {!isLast && (
                        <motion.div
                          className="w-px h-12 bg-gradient-to-b from-primary/50 to-primary/10"
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ delay: 0.6 + i * 0.1 }}
                        />
                      )}
                    </div>

                    {/* Location info */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold">{loc}</div>
                          <div className="text-xs text-muted-foreground">
                            {isFirst ? 'Origin' : isLast ? 'Destination' : 'Waypoint'}
                          </div>
                        </div>
                        {segmentDist && (
                          <div className="text-right">
                            <div className="text-sm font-bold text-primary">{segmentDist} km</div>
                            <div className="text-[10px] text-muted-foreground">to {nextLoc}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </PremiumCard>

        {/* ========== RUN AGAIN QUICK ACTIONS ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mb-10"
        >
          <div className="text-center mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Quick Actions</span>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { reset(); navigate('/input') }}
              className="px-5 py-3 rounded-xl bg-card/50 border border-border backdrop-blur-sm hover:border-primary/30 transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">Reverse Route</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { reset(); navigate('/input') }}
              className="px-5 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 backdrop-blur-sm hover:bg-amber-500/20 transition-colors flex items-center gap-2"
            >
              <Activity className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold text-amber-500">Try Rush Hour</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { reset(); navigate('/input') }}
              className="px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/30 backdrop-blur-sm hover:bg-red-500/20 transition-colors flex items-center gap-2"
            >
              <Activity className="w-4 h-4 text-red-500" />
              <span className="text-sm font-semibold text-red-500">Try Incident Mode</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-wrap justify-center gap-4 mb-10">
          <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
            <Button onClick={() => { reset(); navigate('/input') }} size="lg" className="h-14 px-8 rounded-2xl gap-3 font-semibold shadow-lg shadow-primary/25 relative overflow-hidden group">
              <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <RotateCcw className="w-5 h-5" /> New Simulation
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
            <Button onClick={handleExportPDF} disabled={isExporting} variant="outline" size="lg" className="h-14 px-8 rounded-2xl gap-3 font-semibold">
              <Download className={cn('w-5 h-5', isExporting && 'animate-bounce')} /> {isExporting ? 'Exporting...' : 'Export PDF'}
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
            <Button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!') }} variant="outline" size="lg" className="h-14 px-8 rounded-2xl gap-3 font-semibold">
              <Share className="w-5 h-5" /> Share
            </Button>
          </motion.div>
        </motion.div>

        {/* Logs */}
        <PremiumCard className="overflow-hidden" delay={0.6}>
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3"><Server className="w-5 h-5 text-muted-foreground" /><span className="font-semibold">Execution Logs</span></div>
            <span className="text-xs text-muted-foreground">{logs.length} entries</span>
          </div>
          <LogPanel logs={logs} maxHeight="280px" />
        </PremiumCard>
      </div>
    </div>
  )
}
