import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import {
  Network,
  Cpu,
  Zap,
  ArrowRight,
  Activity,
  Timer,
  Globe,
  ChevronRight,
  Shield,
  Layers,
  MousePointer2,
  Box,
  Terminal,
  Code2,
  Database,
  Lock,
  Radio,
  Share2,
  MapPin,
  Server,
  BarChart3,
  Search,
  Settings,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedCounter, AnimatedStat, SystemArchitectureDiagram } from '@/components'
import { GlassCard } from '@/components/ui/GlassCard'
import { ParallaxSection } from '@/components/ui/ParallaxSection'
import { VelocitySkew, Parallax, ScrollTiltCard, TextReveal, HeroZoom, StickyScrollReveal } from '@/components/ui/ScrollAnimations'
import { cn } from '@/lib/utils'

const OrbAnim = () => {
  return (
    <motion.div
      className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      {/* Adjusted position and scale for better visibility */}
      <div className="translate-y-[-270px] md:translate-y-[-350px] scale-75 md:scale-90">
        <LivingDataCore />
      </div>
    </motion.div>
  )
}



const ScrollReveal = ({ children, delay = 0, className, zoom = false }: { children: React.ReactNode, delay?: number, className?: string, zoom?: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: zoom ? 0.95 : 0.98 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: false, margin: "-5%" }}
    transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
)

const LivingDataCore = () => {
  return (
    <div className="relative w-full h-[500px] flex items-center justify-center pointer-events-none">
      {/* Pulsing Core Atmosphere */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.3, 0.15]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[80vw] h-[80vw] md:w-[500px] md:h-[500px] bg-primary/20 blur-[140px] rounded-full"
      />
      {/* Holographic Rings */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ rotate: 360 }}
          transition={{ duration: 30 + i * 15, repeat: Infinity, ease: "linear" }}
          className="absolute border border-white/5 rounded-full"
          style={{
            width: `min(80vw, ${300 + i * 90}px)`,
            height: `min(80vw, ${300 + i * 90}px)`,
            borderWidth: '1px',
            borderColor: i % 2 === 0 ? 'rgba(37,99,235,0.15)' : 'rgba(255,255,255,0.03)'
          }}
        />
      ))}
      {/* Interactive Node Core */}
      <div className="relative z-10 w-56 h-56 glass-hyper rounded-full border border-white/20 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-grid-white opacity-5" />
        <motion.div
          animate={{ rotateY: 360, rotateZ: [0, 5, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <Cpu className="w-24 h-24 text-primary drop-shadow-[0_0_25px_rgba(37,99,235,0.5)]" />
        </motion.div>
        {/* Floating Micro-data */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="w-full h-full relative"
          >
            <Zap className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-4 text-primary opacity-40" />
            <Globe className="absolute bottom-4 left-1/2 -translate-x-1/2 w-4 h-4 text-primary opacity-40" />
          </motion.div>
        </div>
      </div>
      {/* Data Particulates */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: 0, opacity: 0 }}
          animate={{
            x: (Math.random() - 0.5) * 800,
            y: (Math.random() - 0.5) * 800,
            opacity: [0, 0.8, 0]
          }}
          transition={{ duration: 4 + Math.random() * 6, repeat: Infinity, delay: Math.random() * 5 }}
          className="absolute w-1 h-1 bg-primary rounded-full shadow-[0_0_15px_rgba(37,99,235,1)]"
        />
      ))}
    </div>
  )
}

export function HomeScreen() {
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)
  const words = ["Infrastructure", "Simulation", "Intelligence", "Orchestration"]
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % words.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [words.length])

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e
    if (containerRef.current) {
      containerRef.current.style.setProperty('--mouse-x', `${clientX}px`)
      containerRef.current.style.setProperty('--mouse-y', `${clientY}px`)
    }
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen bg-background text-foreground selection:bg-primary/50 overflow-x-hidden font-inter"
    >
      {/* Global Spotlight Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 spotlight-cursor" />

      <div className="fixed inset-0 -z-50 pointer-events-none">
        <div className="absolute inset-0 bg-grid-white opacity-[0.03] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]" />
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-primary/10 blur-[200px] rounded-full opacity-20" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-600/5 blur-[180px] rounded-full opacity-10" />
        <div className="absolute inset-0 bg-noise pointer-events-none opacity-20" />
      </div>

      <section className="relative h-[150vh] flex flex-col items-center justify-start pt-0 px-6">
        <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
          <OrbAnim />

          {/* Top Ticker Status - Moved outside HeroZoom for stability */}
          <div className="absolute top-24 w-full left-0 overflow-hidden pointer-events-none opacity-30 z-10">
            <motion.div
              className="flex items-center gap-16 whitespace-nowrap text-[10px] font-black uppercase tracking-[0.6em] text-foreground w-max"
              animate={{ x: ["-50%", "0%"] }}
              transition={{ repeat: Infinity, duration: 120, ease: "linear" }}
            >
              {[...Array(12)].map((_, i) => (
                <div key={i} className="flex items-center gap-16">
                  <span className="flex items-center gap-4 text-emerald-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                    ● LIVE UPDATE:
                  </span>
                  <span>IN-DL-HUB_ACTIVE</span>
                  <span>•</span>
                  <span>NODES_STABLE: 512</span>
                  <span>•</span>
                  <span>TRAFFIC_DENSITY: LOW</span>
                  <span>•</span>
                  <span>SYSTEM_CLOCK: 1.2GHZ</span>
                  <span>•</span>
                </div>
              ))}
            </motion.div>
          </div>

          <HeroZoom>
            <div className="relative z-20 max-w-7xl mx-auto text-center -mt-20 md:-mt-24">


              {/* Premium Badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8 mx-auto"
              >
                <motion.div
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Parallel Computing Demo</span>
              </motion.div>

              <h1 className="mb-8 tracking-[-0.06em] leading-[0.85] uppercase">
                <motion.span
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-foreground/50 block mb-8 mt-12 font-light text-xl md:text-3xl tracking-[0.3em] relative z-20"
                >
                  DISTRIBUTED
                </motion.span>
                <div className="relative inline-block mb-4">
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
                    className="text-6xl md:text-9xl font-black text-primary block drop-shadow-2xl"
                  >
                    TRAFFIC
                  </motion.span>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 1.0, duration: 1.2, ease: 'circOut' }}
                    className="absolute -bottom-2 left-0 h-1.5 bg-gradient-to-r from-primary via-blue-400 to-primary rounded-full shadow-[0_0_20px_rgba(37,99,235,0.5)]"
                  />
                </div>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="text-4xl sm:text-5xl md:text-8xl font-black text-foreground block mt-2"
                >
                  SYSTEM
                </motion.span>
              </h1>

              <div className="h-20 mb-12 relative flex justify-center items-center">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={words[index]}
                    initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                    className="text-2xl md:text-4xl font-bold tracking-tight flex items-center gap-4"
                  >
                    <span className="text-foreground">Parallel</span>
                    <span className="text-primary drop-shadow-[0_0_30px_rgba(37,99,235,0.4)]">
                      {words[index]}
                    </span>
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-foreground/40 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
              >
                Watch 6 regional nodes process traffic data <span className="text-primary font-semibold">simultaneously</span> via distributed RPC calls.
                Experience <span className="text-primary font-semibold">4× faster</span> route optimization.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="flex flex-wrap items-center justify-center gap-4 mt-8"
              >
                <Link
                  to="/input"
                  className="group relative h-14 px-10 bg-primary text-primary-foreground rounded-2xl font-bold text-base flex items-center gap-3 transition-all hover:scale-[1.03] active:scale-95 shadow-xl shadow-primary/30 overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  />
                  <Zap className="w-5 h-5 relative z-10" />
                  <span className="relative z-10 uppercase tracking-wide">Start Simulation</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                </Link>
                <Link
                  to="/admin"
                  className="h-14 px-8 rounded-2xl font-semibold text-base flex items-center justify-center hover:bg-foreground/5 transition-all border border-border group backdrop-blur-sm"
                >
                  <span className="uppercase tracking-wide">Admin Panel</span>
                  <ChevronRight className="ml-2 w-5 h-5 text-foreground/30 group-hover:text-foreground transition-colors" />
                </Link>
              </motion.div>
            </div>
          </HeroZoom>
        </div>
      </section>

      {/* ====== LIVE STATUS TICKER SECTION (STICKY CURTAIN) ====== */}
      <StickyScrollReveal className="bg-background shadow-[0_-50px_100px_rgba(0,0,0,0.5)]">
        <div className="relative h-12 border-y border-border bg-foreground/[0.02] flex items-center overflow-hidden z-30">
          <VelocitySkew skewFactor={8} className="flex gap-16 whitespace-nowrap text-[10px] font-black uppercase tracking-[0.4em] text-foreground/20">
            {[...Array(10)].map((_, i) => (
              <span key={i} className="flex items-center gap-4">
                <span className="text-primary">● LIVE UPDATE:</span> IN-DL-HUB_ACTIVE
                <span className="text-foreground/40">•</span> NODES_STABLE: 512
                <span className="text-foreground/40">•</span> TRAFFIC_DENSITY: LOW
                <span className="text-foreground/40">•</span> SYSTEM_CLOCK: 1.2GHZ
              </span>
            ))}
          </VelocitySkew>
        </div>
      </StickyScrollReveal>

      <section className="py-48 px-6 border-y border-border bg-card/40 transition-colors duration-500">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'DELHI_PRIMARY', value: 8.2, suffix: 'ms', icon: MapPin, color: 'text-primary' },
            { label: 'MUMBAI_EDGE', value: 14.1, suffix: 'ms', icon: Globe, color: 'text-blue-400' },
            { label: 'BLR_CLUSTER', value: 5.4, suffix: 'ms', icon: Server, color: 'text-emerald-400' },
            { label: 'HYD_REGION', value: 11.8, suffix: 'ms', icon: Activity, color: 'text-amber-400' },
          ].map((stat, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <GlassCard className="p-8 rounded-[32px] border-border transition-all hover:border-primary/30" intensity={3}>
                <div className={cn("w-10 h-10 rounded-2xl bg-primary/5 dark:bg-white/5 flex items-center justify-center mb-6", stat.color)}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="flex items-baseline gap-2 mb-2 text-foreground">
                  <AnimatedCounter value={stat.value} decimals={1} className="text-4xl font-black tracking-tight" suffix={stat.suffix} />
                </div>
                <p className="opacity-40 text-[9px] font-black uppercase tracking-[0.3em]">{stat.label}</p>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="py-24 md:py-32 px-6 bg-background transition-colors duration-500">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 text-foreground">
              <div className="max-w-xl">
                <span className="text-primary text-[9px] font-black uppercase tracking-[0.5em] mb-4 block">Platform Depth</span>
                <TextReveal text="THE CORE STACK." className="text-3xl md:text-4xl font-black mb-4 leading-none tracking-tighter uppercase" />
                <p className="text-base opacity-40 leading-relaxed font-light">
                  A multi-layered neural engine engineered for absolute precision and zero-latency decision making across Indian subnets.
                </p>
              </div>
              <div className="hidden lg:flex gap-3">
                {[Database, Terminal, Shield].map((Icon, i) => (
                  <div key={i} className="w-10 h-10 glass-hyper rounded-xl border-border flex items-center justify-center text-primary/60">
                    <Icon className="w-4 h-4" />
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LARGE FEATURE: Consensus */}
            <div className="lg:col-span-12">
              <ScrollTiltCard intensity={15}>
                <GlassCard className="p-6 md:p-8 rounded-[28px] border-border overflow-hidden relative group" intensity={6}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="relative z-20 pl-4 md:pl-8 lg:pl-12">
                      <span className="px-3 py-1 rounded-full border border-emerald-400/20 bg-emerald-400/5 text-[8px] font-black text-emerald-400 uppercase tracking-widest mb-6 inline-block">System Level 1</span>
                      <h3 className="text-2xl md:text-3xl font-black mb-6 leading-[1.1] uppercase tracking-tighter">Auto-Healing <br /><span className="text-primary">Traffic Consensus</span></h3>
                      <p className="text-foreground/40 text-sm font-light leading-relaxed mb-8 max-w-sm">
                        Intelligent pathfinding protocols that automatically reroute packets around regional congestion in real-time. Zero manual intervention required.
                      </p>
                      <div className="flex gap-8">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[9px] font-black text-foreground/20 uppercase tracking-widest">Failover</span>
                          <span className="text-xl font-black">&lt; 0.2ms</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[9px] font-black text-foreground/20 uppercase tracking-widest">Optimized</span>
                          <span className="text-xl font-black text-emerald-400">99.98%</span>
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Auto-Healing Visual */}
                    <div className="relative aspect-video rounded-[24px] border border-border overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-black">
                      {/* Background grid */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:30px_30px]" />

                      {/* Animated glow backdrop */}
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/20 rounded-full blur-[80px]"
                      />

                      {/* Network Nodes */}
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 225">
                        {/* Connection lines with animated flow */}
                        <defs>
                          <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                            <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                          </linearGradient>
                          <filter id="glow">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                              <feMergeNode in="coloredBlur" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                        </defs>

                        {/* Static connection paths */}
                        <path d="M80,112 Q140,80 200,112" stroke="rgba(59,130,246,0.15)" strokeWidth="2" fill="none" />
                        <path d="M200,112 Q260,145 320,112" stroke="rgba(59,130,246,0.15)" strokeWidth="2" fill="none" />
                        <path d="M80,112 Q140,145 200,112" stroke="rgba(59,130,246,0.15)" strokeWidth="2" fill="none" />
                        <path d="M200,112 Q260,80 320,112" stroke="rgba(59,130,246,0.15)" strokeWidth="2" fill="none" />
                        <path d="M80,112 L200,50" stroke="rgba(59,130,246,0.15)" strokeWidth="2" fill="none" />
                        <path d="M320,112 L200,50" stroke="rgba(59,130,246,0.15)" strokeWidth="2" fill="none" />
                        <path d="M80,112 L200,175" stroke="rgba(59,130,246,0.15)" strokeWidth="2" fill="none" />
                        <path d="M320,112 L200,175" stroke="rgba(59,130,246,0.15)" strokeWidth="2" fill="none" />

                        {/* Animated flow pulses */}
                        {[
                          { d: "M80,112 Q140,80 200,112", delay: 0 },
                          { d: "M200,112 Q260,145 320,112", delay: 0.5 },
                          { d: "M200,50 L320,112", delay: 1 },
                          { d: "M80,112 L200,175", delay: 1.5 },
                        ].map((path, i) => (
                          <motion.path
                            key={i}
                            d={path.d}
                            stroke="url(#flowGradient)"
                            strokeWidth="3"
                            fill="none"
                            filter="url(#glow)"
                            initial={{ pathLength: 0, pathOffset: 0 }}
                            animate={{ pathLength: 0.3, pathOffset: [0, 1] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: path.delay,
                              ease: "linear"
                            }}
                          />
                        ))}
                      </svg>

                      {/* Animated Nodes */}
                      {[
                        { x: '20%', y: '50%', label: 'SRC', primary: true },
                        { x: '50%', y: '22%', label: 'N1', primary: false },
                        { x: '50%', y: '50%', label: 'HUB', primary: true },
                        { x: '50%', y: '78%', label: 'N2', primary: false },
                        { x: '80%', y: '50%', label: 'DST', primary: true },
                      ].map((node, i) => (
                        <div
                          key={i}
                          className="absolute -translate-x-1/2 -translate-y-1/2"
                          style={{ left: node.x, top: node.y }}
                        >
                          {/* Pulsing ring */}
                          <motion.div
                            animate={{ scale: [1, 2, 1], opacity: [0.6, 0, 0.6] }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                            className={cn(
                              "absolute inset-0 rounded-full",
                              node.primary ? "bg-primary/30" : "bg-emerald-400/30"
                            )}
                            style={{ width: node.primary ? 48 : 32, height: node.primary ? 48 : 32, margin: 'auto', left: 0, right: 0, top: 0, bottom: 0 }}
                          />
                          {/* Node */}
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                            className={cn(
                              "relative rounded-full flex items-center justify-center shadow-lg",
                              node.primary
                                ? "w-12 h-12 bg-gradient-to-br from-primary to-blue-600 shadow-primary/40"
                                : "w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-400/40"
                            )}
                          >
                            <span className={cn(
                              "font-black text-white",
                              node.primary ? "text-[10px]" : "text-[8px]"
                            )}>
                              {node.label}
                            </span>
                          </motion.div>
                        </div>
                      ))}

                      {/* Floating particles */}
                      {[...Array(12)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{
                            x: 80 + Math.random() * 240,
                            y: 50 + Math.random() * 125,
                            opacity: 0
                          }}
                          animate={{
                            x: [null, 80 + Math.random() * 240],
                            y: [null, 50 + Math.random() * 125],
                            opacity: [0, 0.8, 0]
                          }}
                          transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 3
                          }}
                          className="absolute w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_6px_rgba(59,130,246,1)]"
                        />
                      ))}

                      {/* Status indicator */}
                      <div className="absolute bottom-4 left-4 flex items-center gap-2">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,1)]"
                        />
                        <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Auto-Healing Active</span>
                      </div>

                      {/* Metrics overlay */}
                      <div className="absolute bottom-4 right-4 flex gap-4">
                        <div className="text-right">
                          <div className="text-[8px] font-black text-foreground/30 uppercase">Latency</div>
                          <motion.div
                            animate={{ opacity: [0.7, 1, 0.7] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-sm font-black text-primary"
                          >
                            8.2ms
                          </motion.div>
                        </div>
                        <div className="text-right">
                          <div className="text-[8px] font-black text-foreground/30 uppercase">Throughput</div>
                          <motion.div
                            animate={{ opacity: [0.7, 1, 0.7] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                            className="text-sm font-black text-emerald-400"
                          >
                            1.2Gb/s
                          </motion.div>
                        </div>
                      </div>

                      {/* Corner shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
                    </div>
                  </div>
                </GlassCard>
              </ScrollTiltCard>
            </div>

            {/* Quantum Trust Layer (FIXED HIDING DATA) */}
            <div className="lg:col-span-8">
              <ScrollReveal zoom>
                <GlassCard className="h-full p-6 md:p-8 rounded-[32px] border-border bg-indigo-500/5 relative overflow-hidden group" intensity={5}>
                  <div className="relative z-20 text-foreground">
                    <Lock className="w-8 h-8 text-indigo-400 mb-6 group-hover:scale-110 transition-transform" />
                    <h4 className="text-2xl font-black mb-4 uppercase tracking-tighter">Quantum Trust Layer</h4>
                    <p className="opacity-40 text-[16px] leading-relaxed max-w-lg">
                      Immutable cryptographic verification of every routing decision. Lattice-based encryption ensures data integrity even against future quantum threats.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      {['LATTICE_SEC', 'P2P_AUTH', 'IN-LEDGER_ON'].map((tag, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-lg border border-indigo-400/20 text-[8px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-400/5">{tag}</span>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </ScrollReveal>
            </div>

            {/* Sandbox Env */}
            <div className="lg:col-span-4">
              <ScrollReveal delay={0.2} zoom>
                <GlassCard className="h-full p-6 md:p-8 rounded-[32px] border-border bg-emerald-500/5 group" intensity={5}>
                  <Box className="w-8 h-8 text-emerald-400 mb-6 group-hover:rotate-12 transition-transform" />
                  <div className="text-foreground">
                    <h4 className="text-xl font-black mb-4 uppercase tracking-tighter">V-Sandbox</h4>
                    <p className="opacity-40 text-sm leading-relaxed mb-6">
                      Isolated VPC orchestration for testing edge-case failures without impacting production workloads across India.
                    </p>
                    <div className="h-1.5 w-full bg-foreground/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: '85%' }}
                        className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                      />
                    </div>
                    <div className="flex justify-between items-center mt-3 text-[9px] font-black opacity-20 uppercase tracking-widest">
                      <span>Utilization</span>
                      <span className="text-emerald-400 opacity-100">Active</span>
                    </div>
                  </div>
                </GlassCard>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      <section className="relative min-h-[120vh] flex flex-col items-center justify-center overflow-hidden bg-card dark:bg-[#02040a] border-t border-border">
        {/* MAP BACKGROUND */}
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <Parallax offset={60} className="w-full h-full relative">
            <motion.div
              initial={{ opacity: 0.5, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, filter: 'blur(0px)' }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="w-full h-full relative"
            >
              <img
                src="/india-map-premium.png"
                className="w-full h-full object-cover object-center dark:opacity-100 opacity-85 dark:brightness-100 brightness-95 contrast-105"
                alt="Premium India Technical Map"
              />
              {/* Edge vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-card dark:from-[#02040a] via-transparent to-card/40 dark:to-[#02040a]/40" />
              <div className="absolute inset-0 bg-gradient-to-r from-card/50 dark:from-[#02040a]/50 via-transparent to-card/50 dark:to-[#02040a]/50" />
            </motion.div>
          </Parallax>
        </div>

        {/* DYNAMIC SCANNING BEAM */}
        <motion.div
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-y-0 w-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent blur-xl z-10 pointer-events-none"
        />

        {/* INTERACTIVE CITY NODES (Relative Positions on High-Fidelity Image) */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {[
            { name: 'DELHI', t: '25%', l: '48%', delay: 0 },
            { name: 'MUMBAI', t: '55%', l: '42%', delay: 0.2 },
            { name: 'BENGALURU', t: '75%', l: '54%', delay: 0.4 },
            { name: 'KOLKATA', t: '35%', l: '75%', delay: 0.6 },
            { name: 'HYDERABAD', t: '62%', l: '56%', delay: 0.8 },
          ].map((city, i) => (
            <Parallax key={i} offset={-40} className="absolute" style={{ top: city.t, left: city.l }}>
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, delay: city.delay }}
                className="w-12 h-12 -translate-x-1/2 -translate-y-1/2 bg-primary/20 rounded-full blur-xl"
              />
              <div className="w-2 h-2 -translate-x-1/2 -translate-y-1/2 bg-primary rounded-full shadow-[0_0_10px_rgba(37,99,235,1)]" />
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.4 }}
                className="absolute top-4 left-4 text-[9px] font-black text-foreground uppercase tracking-[0.4em] whitespace-nowrap opacity-40"
              >
                {city.name}_CORE
              </motion.span>
            </Parallax>
          ))}
        </div>

        {/* Dynamic HUD Overlays */}
        <div className="relative z-30 w-full max-w-7xl mx-auto px-6 pointer-events-none">
          <div className="flex flex-col mb-40">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-primary text-[9px] font-black uppercase tracking-[1em] mb-8 block"
            >
              Immersive Intelligence
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="text-4xl md:text-5xl font-black mb-6 tracking-tighter uppercase leading-[0.85] drop-shadow-lg text-foreground"
            >
              <span className="text-foreground/5 block italic -mb-3 md:-mb-4">NETWORK</span> INDIA <span className="text-primary">CORE.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-foreground/40 text-base font-light max-w-xl leading-relaxed bg-card/20 dark:bg-black/20 backdrop-blur-sm p-3 rounded-lg border border-border"
            >
              Connecting 512 edge execution nodes across Indian metropolitan regions via our proprietary orbital routing layer.
            </motion.p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mt-auto">
            {[
              { name: 'DEL_NCX', val: '8.2ms' },
              { name: 'MUM_PRIMARY', val: '12.4ms' },
              { name: 'BLR_GATEWAY', val: '5.1ms' },
              { name: 'HYD_SECURE', val: '14.8ms' }
            ].map((node, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                key={i} className="flex flex-col gap-1 glass-hyper p-8 rounded-[40px] border-border shadow-3xl"
              >
                <span className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.4em]">{node.name}</span>
                <span className="text-4xl font-black text-primary tracking-tighter">{node.val}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* BOTTOM RIGHT FLOATING HUD (PREMIUM POSITIONING) */}
        <div className="absolute bottom-6 right-12 z-50 pointer-events-none group">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="glass-hyper p-10 rounded-[50px] border-border bg-card/60 dark:bg-black/60 shadow-[0_0_50px_rgba(0,0,0,0.3)] dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-4xl min-w-[380px] hover:border-primary/30 transition-colors duration-500"
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="w-4 h-4 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_20px_rgba(52,211,153,0.8)]" />
              <span className="text-[11px] font-black uppercase tracking-[0.6em] text-emerald-500">Mission Status: Optimal</span>
            </div>
            <div className="text-foreground grid grid-cols-2 gap-16">
              <div>
                <div className="text-[10px] font-black opacity-20 uppercase mb-3 tracking-[0.3em]">Processing</div>
                <div className="text-5xl font-black tracking-tighter">99.9<span className="text-primary text-3xl">%</span></div>
              </div>
              <div>
                <div className="text-[10px] font-black opacity-20 uppercase mb-3 tracking-[0.3em]">Quantum Sync</div>
                <div className="text-5xl font-black text-emerald-400 tracking-tighter italic">LIVE</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-6 pt-32 pb-32 z-10 bg-background transition-colors duration-500">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-center mb-0 relative group"
          >
            <span className="text-[10px] font-black tracking-[1.5em] text-primary uppercase mb-4 block">Structural Map</span>
            <TextReveal text="SYSTEM TOPOLOGY" className="text-7xl md:text-8xl font-black tracking-tighter uppercase leading-none text-foreground justify-center" />
            <p className="text-foreground/40 text-xl font-light mt-6 max-w-2xl mx-auto leading-relaxed">
              Real-time verification of consensus protocols across multi-region edge nodes.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
            className="w-full mt-16"
          >
            <SystemArchitectureDiagram />
          </motion.div>
        </div>
      </section>

      <section className="py-64 px-6 border-t border-border relative z-10 bg-background transition-colors duration-500">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-20 items-center">
            <div className="w-full lg:w-1/2">
              <ScrollReveal>
                <span className="text-primary text-[10px] font-black uppercase tracking-[1em] mb-10 block">Performance Analysis</span>
                <h2 className="text-6xl font-black mb-10 tracking-tighter uppercase leading-[0.9] text-foreground">SUPERIORITY <br /><span className="opacity-20 italic">BENCHMARKS.</span></h2>
                <div className="space-y-8">
                  {[
                    { label: 'Packet Switching', current: 12, legacy: 45, unit: 'ms' },
                    { label: 'Consensus Speed', current: 5, legacy: 120, unit: 'ms' },
                    { label: 'Security Overhead', current: 0.8, legacy: 14.2, unit: '%' }
                  ].map((item, i) => (
                    <div key={i} className="space-y-3">
                      <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-foreground">
                        <span>{item.label}</span>
                        <span className="text-primary">DTS Speedup: {Math.round((item.legacy / item.current) * 10)}x</span>
                      </div>
                      <div className="relative h-2 bg-foreground/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: '100%' }}
                          className="absolute inset-0 bg-foreground/10"
                        />
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${(item.current / item.legacy) * 100}%` }}
                          className="absolute inset-x-0 h-full bg-primary shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-bold opacity-30 text-foreground">
                        <span>DTS ENGINE: {item.current}{item.unit}</span>
                        <span>LEGACY: {item.legacy}{item.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
            <div className="w-full lg:w-1/2 grid grid-cols-2 gap-6">
              <ScrollReveal delay={0.2}>
                <GlassCard className="p-10 rounded-[40px] border-border" intensity={5}>
                  <div className="text-5xl font-black mb-4 text-foreground">98<span className="text-primary">%</span></div>
                  <p className="text-[10px] font-black opacity-20 uppercase tracking-widest text-foreground">Efficiency Gain</p>
                </GlassCard>
              </ScrollReveal>
              <ScrollReveal delay={0.3}>
                <GlassCard className="p-10 rounded-[40px] border-border bg-primary/5" intensity={5}>
                  <div className="text-5xl font-black mb-4 text-foreground">0.1<span className="text-primary">ms</span></div>
                  <p className="text-[10px] font-black opacity-20 uppercase tracking-widest text-foreground">Avg Pulse</p>
                </GlassCard>
              </ScrollReveal>
              <ScrollReveal delay={0.4} className="col-span-2">
                <GlassCard className="p-10 rounded-[40px] border-border flex items-center justify-between group" intensity={5}>
                  <div className="text-foreground">
                    <div className="text-3xl font-black mb-2 uppercase">Verified Stable</div>
                    <p className="text-[10px] font-bold opacity-20 uppercase tracking-[0.3em]">Quantum Layer v4.2</p>
                  </div>
                  <Shield className="w-16 h-16 text-primary/20 group-hover:text-primary/40 transition-colors" />
                </GlassCard>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ====== HOW IT WORKS SECTION ====== */}
      <section className="py-32 px-6 bg-background border-t border-border relative z-10">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-20">
              <span className="text-primary text-[10px] font-black uppercase tracking-[1em] mb-6 block">Process</span>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase text-foreground">
                HOW IT <span className="text-primary italic">WORKS</span>
              </h2>
              <p className="text-foreground/40 text-lg font-light mt-6 max-w-2xl mx-auto">
                Three simple steps to harness the power of distributed parallel processing
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: 'Configure Route',
                description: 'Select source and destination from 30+ Indian cities. Choose traffic scenario for realistic simulation.',
                icon: MapPin,
                color: 'emerald',
              },
              {
                step: 2,
                title: 'Parallel Processing',
                description: 'Watch 6 regional nodes process traffic data simultaneously via distributed RPC calls.',
                icon: Cpu,
                color: 'primary',
              },
              {
                step: 3,
                title: 'Optimized Results',
                description: 'View the fastest route with real-time congestion data and performance metrics.',
                icon: BarChart3,
                color: 'blue',
              },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.15}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="relative h-full p-8 rounded-3xl bg-card/40 border border-border backdrop-blur-xl group overflow-hidden"
                >
                  {/* Step number */}
                  <div className="absolute top-6 right-6 text-8xl font-black text-foreground/5 group-hover:text-primary/10 transition-colors">
                    {item.step}
                  </div>

                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    className={cn(
                      'w-16 h-16 rounded-2xl flex items-center justify-center mb-6',
                      item.color === 'emerald' && 'bg-emerald-500/10 text-emerald-500',
                      item.color === 'primary' && 'bg-primary/10 text-primary',
                      item.color === 'blue' && 'bg-blue-500/10 text-blue-500'
                    )}
                  >
                    <item.icon className="w-8 h-8" />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-2xl font-black mb-3 uppercase tracking-tight text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-foreground/40 text-sm leading-relaxed">
                    {item.description}
                  </p>

                  {/* Connector line for non-last items */}
                  {i < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border" />
                  )}
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====== USE CASES SECTION ====== */}
      <section className="py-32 px-6 bg-card/40 border-t border-border relative z-10">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-20">
              <span className="text-primary text-[10px] font-black uppercase tracking-[1em] mb-6 block">Applications</span>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase text-foreground">
                USE <span className="text-primary italic">CASES</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                emoji: '🎓',
                title: 'Academic Research',
                description: 'Perfect for distributed systems education and parallel computing research projects.',
                tags: ['Education', 'Research', 'Papers'],
              },
              {
                emoji: '🏛️',
                title: 'Smart City Planning',
                description: 'Help government agencies optimize traffic flow and urban infrastructure decisions.',
                tags: ['Government', 'Urban', 'Planning'],
              },
              {
                emoji: '💼',
                title: 'Enterprise Logistics',
                description: 'Optimize fleet routing and delivery schedules for maximum efficiency.',
                tags: ['Enterprise', 'Logistics', 'Optimization'],
              },
            ].map((useCase, i) => (
              <ScrollReveal key={i} delay={i * 0.15} zoom>
                <GlassCard
                  className="h-full p-8 rounded-3xl border-border group hover:border-primary/30 transition-colors"
                  intensity={4}
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="text-5xl mb-6"
                  >
                    {useCase.emoji}
                  </motion.div>
                  <h3 className="text-xl font-black mb-3 uppercase tracking-tight text-foreground">
                    {useCase.title}
                  </h3>
                  <p className="text-foreground/40 text-sm leading-relaxed mb-6">
                    {useCase.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {useCase.tags.map((tag, j) => (
                      <span
                        key={j}
                        className="px-3 py-1 rounded-lg bg-primary/5 border border-primary/20 text-[10px] font-black text-primary uppercase tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>

        </div>
      </section>

      {/* ====== TECH STACK SECTION ====== */}
      <section className="py-24 px-6 bg-background border-t border-border relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <span className="text-primary text-[10px] font-black uppercase tracking-[1em] mb-6 block">Built With</span>
            <h2 className="text-3xl font-black tracking-tighter uppercase text-foreground mb-12">
              Modern Tech Stack
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { name: 'React 18', icon: '⚛️' },
                { name: 'TypeScript', icon: '📘' },
                { name: 'Vite', icon: '⚡' },
                { name: 'Tailwind CSS', icon: '🎨' },
                { name: 'shadcn/ui', icon: '🧩' },
                { name: 'Radix UI', icon: '🔲' },
                { name: 'Framer Motion', icon: '🎬' },
                { name: 'Three.js', icon: '🎮' },
                { name: 'Zustand', icon: '🐻' },
                { name: 'React Query', icon: '🔄' },
                { name: 'Recharts', icon: '📊' },
                { name: 'Sonner', icon: '🔔' },
              ].map((tech, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.05, y: -5, backgroundColor: 'rgba(37,99,235,0.05)' }}
                  className="flex flex-col items-center justify-center gap-3 p-6 rounded-[24px] bg-card/40 border border-border/50 backdrop-blur-md hover:border-primary/40 transition-all duration-300 group"
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{tech.icon}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">{tech.name}</span>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <footer className="py-24 px-6 border-t border-border bg-card/60 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col gap-6 max-w-sm">
            <div className="flex items-center gap-4">
              <div className="w-16 h-12 bg-primary rounded-2xl flex items-center justify-center text-black font-black text-2xl shadow-[0_0_20px_rgba(37,99,235,0.4)]">DTS</div>
              <span className="text-2xl lg:text-3xl font-black tracking-[-0.05em] uppercase">
                DISTRIBUTED <span className="text-primary italic">TRAFFIC SYSTEM</span>
              </span>
            </div>
            <p className="text-foreground/40 text-sm font-light leading-relaxed max-w-sm">
              India's premier real-time parallel computing engine for urban traffic orchestration.
              Optimized for 6 regional hubs across the subcontinent.
            </p>
            <div className="flex gap-4">
              {[Database, MessageSquare, Twitter].map((Icon, i) => (
                <div key={i} className="w-10 h-10 rounded-xl bg-foreground/5 border border-border flex items-center justify-center text-foreground/20 hover:text-primary hover:border-primary/30 transition-all cursor-pointer group">
                  <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">NAVIGATION</span>
            <Link to="/input" className="text-sm text-foreground/40 hover:text-primary transition-colors flex items-center gap-2">Simulation Engine</Link>
            <Link to="/nodes" className="text-sm text-foreground/40 hover:text-primary transition-colors flex items-center gap-2">Regional Nodes</Link>
            <Link to="/parallel" className="text-sm text-foreground/40 hover:text-primary transition-colors flex items-center gap-2">Parallel View</Link>
          </div>

          <div className="flex flex-col gap-5">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">RESOURCES</span>
            <Link to="/admin" className="text-sm text-foreground/40 hover:text-primary transition-colors">Admin Hub</Link>
            <Link to="/output" className="text-sm text-foreground/40 hover:text-primary transition-colors">Performance Lab</Link>
            <a href="#" className="text-sm text-foreground/40 hover:text-primary transition-colors">Documentation</a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-border flex flex-col md:flex-row justify-between gap-8 opacity-20 text-[9px] font-black uppercase tracking-[0.5em]">
          <span>© 2026 DISTRIBUTED TRAFFIC SYSTEM • MISSION CRITICAL INFRASTRUCTURE</span>
          <span>REGION_LOG: N_S_E_W_C_NE_HUB_INDIA</span>
        </div>
      </footer>
    </div >
  )
}

function MessageSquare(props: any) { return <Share2 {...props} /> }
function Twitter(props: any) { return <Radio {...props} /> }
