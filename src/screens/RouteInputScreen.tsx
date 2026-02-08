import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  MapPin,
  Navigation,
  ArrowRight,
  Loader2,
  Clock,
  AlertTriangle,
  Activity,
  Zap,
  Rocket,
  Sparkles,
  Globe,
  Signal,
  Cpu,
  Network,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { LocationSearch } from '@/components/LocationSearch'
import { LOCATIONS } from '@/lib/routeOptimization'
import { useTrafficStore } from '@/stores/trafficStore'
import { cn } from '@/lib/utils'

type Scenario = 'normal' | 'rush' | 'incident'

const SCENARIOS: Record<
  Scenario,
  { label: string; desc: string; icon: React.FC<{ className?: string }>; color: string; glow: string }
> = {
  normal: {
    label: 'Normal Traffic',
    desc: 'Balanced conditions across all regions',
    icon: Activity,
    color: 'emerald',
    glow: 'shadow-emerald-500/30',
  },
  rush: {
    label: 'Rush Hour',
    desc: 'High congestion and reduced speeds',
    icon: Clock,
    color: 'amber',
    glow: 'shadow-amber-500/30',
  },
  incident: {
    label: 'Incident Mode',
    desc: 'Random failures and severe congestion',
    icon: AlertTriangle,
    color: 'red',
    glow: 'shadow-red-500/30',
  },
}

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary/30 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            duration: 10 + Math.random() * 20,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}

function RouteConnectionLine({ isConnected }: { isConnected: boolean }) {
  return (
    <div className="absolute left-8 top-[140px] bottom-[140px] w-1 hidden md:flex flex-col items-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: isConnected ? 1 : 0.5 }}
        className={cn(
          'w-4 h-4 rounded-full border-2 flex-shrink-0',
          isConnected ? 'bg-emerald-400 border-emerald-400' : 'bg-muted border-border'
        )}
      >
        {isConnected && (
          <motion.div
            className="absolute inset-0 rounded-full bg-emerald-400"
            animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </motion.div>

      <div className="flex-1 w-0.5 bg-border relative overflow-hidden my-2">
        {isConnected && (
          <motion.div
            className="absolute inset-x-0 w-full bg-gradient-to-b from-emerald-400 via-primary to-red-400"
            initial={{ top: '-100%', height: '100%' }}
            animate={{ top: '0%' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
        )}

        {isConnected && (
          <motion.div
            className="absolute w-full h-8 bg-gradient-to-b from-transparent via-white/50 to-transparent"
            animate={{ top: ['-20%', '120%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        )}
      </div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: isConnected ? 1 : 0.5 }}
        transition={{ delay: 0.3 }}
        className={cn(
          'w-4 h-4 rounded-full border-2 flex-shrink-0',
          isConnected ? 'bg-red-400 border-red-400' : 'bg-muted border-border'
        )}
      >
        {isConnected && (
          <motion.div
            className="absolute inset-0 rounded-full bg-red-400"
            animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          />
        )}
      </motion.div>
    </div>
  )
}

function StatBadge({ icon: Icon, label, value }: { icon: React.FC<{ className?: string }>; label: string; value: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card/50 border border-border backdrop-blur-sm"
    >
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-bold text-sm">{value}</div>
      </div>
    </motion.div>
  )
}

export function RouteInputScreen() {
  const navigate = useNavigate()
  const {
    source,
    destination,
    setSource,
    setDestination,
    isRunning,
  } = useTrafficStore()

  const [localSource, setLocalSource] = useState(source || '')
  const [localDestination, setLocalDestination] = useState(destination || '')
  const [scenario, setScenario] = useState<Scenario>('normal')
  const [isLaunching, setIsLaunching] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const isValid = localSource && localDestination && localSource !== localDestination

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleStart = () => {

    setIsLaunching(true)
    setSource(localSource)
    setDestination(localDestination)

    toast.info('Launching simulation...', {
      description: `Distributing to 6 region nodes`,
      duration: 1500,
    })

    setTimeout(() => {
      navigate('/nodes')
      setTimeout(() => {
        useTrafficStore.getState().startSimulation()
      }, 120)
    }, 800)
  }

  const sourceName = LOCATIONS.find(l => l.id === localSource)?.name || '—'
  const destName = LOCATIONS.find(l => l.id === localDestination)?.name || '—'
  const sourceRegion = LOCATIONS.find(l => l.id === localSource)?.region
  const destRegion = LOCATIONS.find(l => l.id === localDestination)?.region

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* ========== PREMIUM ANIMATED BACKGROUND ========== */}
      <div className="absolute inset-0 -z-10">
        {/* Large gradient orbs with parallax */}
        <motion.div
          className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-primary/15 rounded-full blur-[200px]"
          animate={{
            x: (mousePosition.x - window.innerWidth / 2) * 0.02,
            y: (mousePosition.y - window.innerHeight / 2) * 0.02,
          }}
          transition={{ type: 'spring', stiffness: 50, damping: 30 }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[180px]"
          animate={{
            x: (mousePosition.x - window.innerWidth / 2) * -0.015,
            y: (mousePosition.y - window.innerHeight / 2) * -0.015,
          }}
          transition={{ type: 'spring', stiffness: 50, damping: 30 }}
        />
        <motion.div
          className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[150px]"
          animate={{
            x: (mousePosition.x - window.innerWidth / 2) * 0.01,
            y: (mousePosition.y - window.innerHeight / 2) * 0.01,
          }}
          transition={{ type: 'spring', stiffness: 50, damping: 30 }}
        />

        {/* India Map Background */}
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.06, scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <img
            src="/india-map-premium.png"
            className="w-full h-full object-contain max-w-5xl opacity-60 dark:opacity-40"
            alt=""
          />
        </motion.div>

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-grid-white opacity-[0.02] dark:opacity-[0.03]" />

        {/* Floating particles */}
        <FloatingParticles />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 relative z-10">
        {/* ========== PREMIUM HEADER ========== */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          {/* Animated icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="relative w-24 h-24 mx-auto mb-8"
          >
            <motion.div
              className="absolute inset-0 rounded-3xl bg-primary/20 blur-xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center backdrop-blur-sm">
              <Navigation className="w-12 h-12 text-primary" />
            </div>
            {/* Orbiting dot */}
            <motion.div
              className="absolute w-3 h-3 bg-primary rounded-full shadow-lg shadow-primary/50"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '50px 50px', top: '-6px', left: '50%', marginLeft: '-6px' }}
            />
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 text-primary text-xs font-black uppercase tracking-[0.2em] mb-6"
          >
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-3.5 h-3.5" />
            </motion.span>
            Mission Control
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          </motion.div>

          {/* Title with gradient */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-6xl font-black mb-5 tracking-tight"
          >
            <span className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text">
              Route Configuration
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed"
          >
            Define journey parameters before launching the{' '}
            <span className="text-primary font-semibold">distributed parallel simulation</span>
          </motion.p>
        </motion.div>

        {/* ========== STATS BAR ========== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          <StatBadge icon={Globe} label="Active Regions" value="6 Zones" />
          <StatBadge icon={Signal} label="Protocol" value="gRPC v3" />
          <StatBadge icon={Cpu} label="Processing" value="Parallel" />
          <StatBadge icon={Network} label="Nodes" value="Distributed" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ========== LEFT: INPUT CARD ========== */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4 }}
            className="glass-card-strong rounded-3xl p-8 lg:col-span-2 border border-border relative overflow-hidden group"
          >
            {/* Animated border glow */}
            <motion.div
              className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(var(--primary), 0.1), transparent)',
                backgroundSize: '200% 100%',
              }}
              animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />

            {/* Connection line */}
            <RouteConnectionLine isConnected={isValid} />

            <div className="relative z-10 px-2 md:pl-12">
              {/* Source */}
              <motion.div
                className="mb-10"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="flex items-center gap-3 text-sm font-black mb-4 uppercase tracking-widest">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/30 flex items-center justify-center"
                  >
                    <MapPin className="w-5 h-5 text-emerald-400" />
                  </motion.div>
                  Origin Point
                  {localSource && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="ml-auto text-xs font-normal text-muted-foreground normal-case tracking-normal"
                    >
                      {sourceRegion} Zone
                    </motion.span>
                  )}
                </label>
                <LocationSearch
                  value={localSource}
                  onChange={setLocalSource}
                  placeholder="Search origin city or state..."
                  disabledValue={localDestination}
                  variant="source"
                />
              </motion.div>

              {/* Destination */}
              <motion.div
                className="mb-12"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="flex items-center gap-3 text-sm font-black mb-4 uppercase tracking-widest">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -10 }}
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-red-500/5 border border-red-500/30 flex items-center justify-center"
                  >
                    <MapPin className="w-5 h-5 text-red-400" />
                  </motion.div>
                  Destination Point
                  {localDestination && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="ml-auto text-xs font-normal text-muted-foreground normal-case tracking-normal"
                    >
                      {destRegion} Zone
                    </motion.span>
                  )}
                </label>
                <LocationSearch
                  value={localDestination}
                  onChange={setLocalDestination}
                  placeholder="Search destination city or state..."
                  disabledValue={localSource}
                  variant="destination"
                />
              </motion.div>

              {/* Scenario */}
              <motion.div
                className="mb-12"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h3 className="text-sm font-black mb-5 uppercase tracking-widest flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  Traffic Scenario
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(Object.keys(SCENARIOS) as Scenario[]).map((key, i) => {
                    const S = SCENARIOS[key]
                    const Icon = S.icon
                    const active = scenario === key
                    return (
                      <motion.button
                        key={key}
                        onClick={() => setScenario(key)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + i * 0.1 }}
                        whileHover={{ scale: 1.03, y: -4 }}
                        whileTap={{ scale: 0.97 }}
                        className={cn(
                          'p-6 rounded-2xl border text-left transition-all relative overflow-hidden group/card',
                          active
                            ? `border-${S.color}-500/50 bg-${S.color}-500/10 shadow-lg ${S.glow}`
                            : 'border-border bg-card/30 hover:bg-card/50 hover:border-border/80',
                        )}
                      >
                        {/* Active indicator */}
                        {active && (
                          <motion.div
                            layoutId="scenario-glow"
                            className={`absolute inset-0 bg-${S.color}-500/5`}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          />
                        )}

                        <div className="relative z-10">
                          <motion.div
                            className={cn(
                              'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
                              active ? `bg-${S.color}-500/20` : 'bg-muted'
                            )}
                            whileHover={{ rotate: 10 }}
                          >
                            <Icon className={cn('w-6 h-6', active ? `text-${S.color}-400` : 'text-muted-foreground')} />
                          </motion.div>
                          <div className="font-bold mb-1">
                            {S.label}
                          </div>
                          <div className="text-xs text-muted-foreground leading-relaxed">
                            {S.desc}
                          </div>
                        </div>

                        {/* Selection indicator */}
                        {active && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary"
                          />
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>

              {/* Launch Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                whileHover={{ scale: isValid ? 1.02 : 1 }}
                whileTap={{ scale: isValid ? 0.98 : 1 }}
              >
                <Button
                  disabled={!isValid || isRunning || isLaunching}
                  onClick={handleStart}
                  className={cn(
                    'w-full h-18 text-lg rounded-2xl gap-4 font-black uppercase tracking-widest relative overflow-hidden group/btn',
                    isValid
                      ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-2xl shadow-primary/40 hover:shadow-primary/60'
                      : 'bg-muted text-muted-foreground',
                  )}
                  style={{ height: '72px' }}
                >
                  {/* Animated background */}
                  {isValid && !isLaunching && (
                    <>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                      />
                      <motion.div
                        className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity"
                        style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)' }}
                      />
                    </>
                  )}

                  <AnimatePresence mode="wait">
                    {isLaunching ? (
                      <motion.div
                        key="launching"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-4"
                      >
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Initializing Nodes...
                      </motion.div>
                    ) : (
                      <motion.div
                        key="start"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-4"
                      >
                        <Rocket className="w-6 h-6" />
                        Launch Simulation
                        <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* ========== RIGHT: PREVIEW CARD ========== */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            {/* Mission Preview */}
            <motion.div
              whileHover={{ y: -4 }}
              className="glass-card rounded-3xl p-6 border border-border relative overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <motion.div
                    className="w-2.5 h-2.5 rounded-full bg-primary"
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <h3 className="font-black uppercase tracking-widest text-sm">
                    Mission Preview
                  </h3>
                </div>

                <div className="space-y-4">
                  <motion.div
                    className="flex justify-between items-center p-4 rounded-xl bg-card/50 border border-border"
                    whileHover={{ x: 4, backgroundColor: 'rgba(var(--card), 0.8)' }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-muted-foreground text-sm">Origin</span>
                    </div>
                    <span className="font-bold text-sm">{sourceName}</span>
                  </motion.div>

                  <motion.div
                    className="flex justify-between items-center p-4 rounded-xl bg-card/50 border border-border"
                    whileHover={{ x: 4, backgroundColor: 'rgba(var(--card), 0.8)' }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-400" />
                      <span className="text-muted-foreground text-sm">Destination</span>
                    </div>
                    <span className="font-bold text-sm">{destName}</span>
                  </motion.div>

                  <motion.div
                    className="flex justify-between items-center p-4 rounded-xl bg-card/50 border border-border"
                    whileHover={{ x: 4, backgroundColor: 'rgba(var(--card), 0.8)' }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="text-muted-foreground text-sm">Scenario</span>
                    </div>
                    <span className="font-bold text-sm capitalize">{scenario}</span>
                  </motion.div>
                </div>

                {/* Estimated Processing Time Preview */}
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">
                    Estimated Processing
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30"
                    >
                      <div className="text-2xl font-black text-primary">~1.2s</div>
                      <div className="text-[10px] font-bold text-primary/60 uppercase tracking-wider">Parallel</div>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="p-4 rounded-xl bg-card/50 border border-border"
                    >
                      <div className="text-2xl font-black text-muted-foreground">~4.8s</div>
                      <div className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider">Sequential</div>
                    </motion.div>
                  </div>
                  <div className="mt-3 flex items-center justify-center gap-2 text-[10px] font-bold text-emerald-500">
                    <Zap className="w-3 h-3" />
                    <span>4× FASTER WITH PARALLEL PROCESSING</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ y: -4 }}
              className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="font-bold text-sm mb-1">Parallel Dispatch</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    The coordinator will distribute RPC requests across 6 regional nodes simultaneously, aggregating traffic data for optimal route computation.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Nodes Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ y: -4 }}
              className="glass-card rounded-3xl p-6 border border-border"
            >
              <h3 className="font-black uppercase tracking-widest text-xs mb-4 text-muted-foreground">
                Target Nodes
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {['North', 'South', 'East', 'West', 'Central', 'NE'].map((region, i) => (
                  <motion.div
                    key={region}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + i * 0.05 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="p-3 rounded-xl bg-card/50 border border-border text-center"
                  >
                    <motion.div
                      className="w-2 h-2 rounded-full bg-primary mx-auto mb-2"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                    />
                    <div className="text-[10px] font-bold">{region}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
