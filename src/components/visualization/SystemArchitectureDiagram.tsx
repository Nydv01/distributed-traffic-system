import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Server, Database, Share2, Shield, Activity, Cpu, Network, Zap, Cloud, ArrowRight } from 'lucide-react'
import { REGIONS } from '@/lib/designTokens'
import { cn } from '@/lib/utils'
import { GlassCard } from '@/components/ui/GlassCard'

export function SystemArchitectureDiagram() {
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            }
        }
    }

    const streamLines = useMemo(() => [
        { d: "M 0,150 C 150,150 200,300 400,300", color: "text-blue-500", delay: 0 },
        { d: "M 0,450 C 150,450 200,300 400,300", color: "text-indigo-500", delay: 0.5 },
        { d: "M 400,300 C 600,300 650,150 800,150", color: "text-emerald-500", delay: 1 },
        { d: "M 400,300 C 600,300 650,450 800,450", color: "text-amber-500", delay: 1.5 },
    ], [])

    return (
        <div className="relative w-full py-32 px-4 overflow-hidden bg-black/20 rounded-[3rem] border border-white/5">
            {/* Background Ambience & Grid */}
            <div className="absolute inset-0 -z-10 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full animate-pulse" />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-100px' }}
                className="relative z-10 max-w-7xl mx-auto"
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[600px]">

                    {/* INGESTION LAYER */}
                    <div className="lg:col-span-3 space-y-12">
                        <ArchitectureNode
                            icon={Cloud}
                            title="Traffic Ingress"
                            subtitle="Edge API Gateways"
                            color="blue"
                            side="left"
                        />
                        <ArchitectureNode
                            icon={Shield}
                            title="Security Shield"
                            subtitle="WAF & Auth Middleware"
                            color="indigo"
                            side="left"
                        />
                    </div>

                    {/* CORE ORCHESTRATION LAYER */}
                    <div className="lg:col-span-6 flex flex-col items-center justify-center relative py-12">
                        {/* CENTRAL FLOW SVGs */}
                        <svg className="absolute inset-0 w-full h-full -z-10 opacity-30" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
                            {streamLines.map((line, i) => (
                                <DataStream key={i} d={line.d} color={line.color} delay={line.delay} />
                            ))}
                        </svg>

                        {/* Central Master Hub - Processor in the exact middle */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="relative mb-20 flex flex-col items-center justify-center min-h-[300px] w-full"
                        >
                            {/* Ambient Glows */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/20 blur-[100px] rounded-full opacity-40 animate-pulse" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150px] h-[150px] bg-blue-500/30 blur-[60px] rounded-full opacity-60" />

                            <div className="relative w-64 h-64 flex items-center justify-center">
                                {/* Triple Concentric Decorative Rings */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 border-[2px] border-dashed border-primary/20 rounded-full"
                                />
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-6 border border-white/5 rounded-full"
                                />
                                <motion.div
                                    animate={{ rotate: 180 }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-12 border-[2px] border-primary/40 border-t-transparent border-b-transparent rounded-full"
                                />

                                {/* Main Processor Card - Perfectly Centered */}
                                <div className="relative z-20 flex flex-col items-center justify-center">
                                    <GlassCard
                                        className="w-44 h-44 rounded-3xl border-2 border-primary/40 flex items-center justify-center p-0 shadow-[0_0_50px_rgba(37,99,235,0.4)] transition-all duration-500 hover:border-primary group/cpu"
                                        glowColor="rgba(59, 130, 246, 0.4)"
                                        showShine
                                    >
                                        <div className="h-full w-full flex items-center justify-center relative">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-primary/20 blur-md rounded-full animate-pulse" />
                                                <Cpu className="w-16 h-16 text-primary relative z-10 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)] group-hover/cpu:scale-110 transition-transform duration-500" />
                                            </div>
                                        </div>
                                    </GlassCard>

                                    {/* Data Stream Outlets */}
                                    <div className="absolute -bottom-16 flex flex-col items-center">
                                        <div className="w-0.5 h-16 bg-gradient-to-b from-primary to-transparent" />
                                        <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(37,99,235,1)]" />
                                    </div>
                                </div>
                            </div>

                            <div className="text-center mt-20 relative z-30">
                                <motion.h4
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-3xl font-black tracking-tighter text-white uppercase"
                                >
                                    Neural <span className="text-primary">Coordinator</span>
                                </motion.h4>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-[11px] text-primary/60 font-black uppercase tracking-[0.5em] mt-3"
                                >
                                    Distributed Intelligence Core
                                </motion.p>
                            </div>
                        </motion.div>

                        {/* Regional Clusters with more structure */}
                        <div className="relative">
                            <div className="grid grid-cols-4 gap-6 p-6 glass-hyper rounded-[32px] border-white/5">
                                {REGIONS.slice(0, 4).map((region, i) => (
                                    <motion.div
                                        key={region.id}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.3 + i * 0.1 }}
                                        className="flex flex-col items-center gap-3 group/node"
                                    >
                                        <div className={cn(
                                            "w-14 h-14 rounded-2xl flex items-center justify-center border border-white/10 glass-rich transition-all duration-500 group-hover/node:border-primary/50 group-hover/node:-translate-y-2",
                                            region.bgColor.replace('bg-', 'bg-') + "/5"
                                        )}>
                                            <span className="text-2xl">{region.emoji}</span>
                                        </div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-success animate-ping" />
                                    </motion.div>
                                ))}
                            </div>
                            <p className="text-center text-[9px] text-white/20 font-black uppercase tracking-[0.5em] mt-4">Distributed Execution Layer</p>
                        </div>

                        {/* Restored: Detailed Metrics Context below diagram */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-4"
                        >
                            {[
                                { label: "Network Health", value: "99.98%", trend: "+0.02%", color: "text-emerald-400" },
                                { label: "Active Nodes", value: "2,541", trend: "Live", color: "text-primary" },
                                { label: "Global Load", value: "42.1%", trend: "Stable", color: "text-amber-400" }
                            ].map((metric, i) => (
                                <GlassCard key={i} className="p-6 rounded-2xl border-white/5 bg-white/1 shadow-xl">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-3">{metric.label}</p>
                                    <div className="flex items-baseline gap-3">
                                        <span className={cn("text-2xl font-black", metric.color)}>{metric.value}</span>
                                        <span className="text-[9px] font-bold text-white/20">{metric.trend}</span>
                                    </div>
                                    <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: '85%' }}
                                            transition={{ duration: 1.5, delay: 0.8 + i * 0.1 }}
                                            className={cn("h-full rounded-full", metric.color.replace('text-', 'bg-'))}
                                        />
                                    </div>
                                </GlassCard>
                            ))}
                        </motion.div>
                    </div>
                    {/* DISPATCH & STORAGE LAYER */}
                    <div className="lg:col-span-3 space-y-12">
                        <ArchitectureNode
                            icon={Zap}
                            title="Execution Engine"
                            subtitle="Distributed Workers"
                            color="emerald"
                            side="right"
                        />
                        <ArchitectureNode
                            icon={Database}
                            title="Vector Store"
                            subtitle="Regional Analytics"
                            color="amber"
                            side="right"
                        />
                    </div>

                </div>
            </motion.div>
        </div>
    )
}

function ArchitectureNode({ icon: Icon, title, subtitle, color, side }: any) {
    const colors: Record<string, string> = {
        blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
        indigo: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
        emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
        amber: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    }

    return (
        <motion.div
            initial={{ x: side === 'left' ? -30 : 30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            className="group"
        >
            <GlassCard
                className="p-6 rounded-3xl border border-white/5 hover:border-white/20"
                glowColor={`rgba(${color === 'blue' ? '59,130,246' : '139,92,246'}, 0.1)`}
            >
                <div className="flex items-center gap-5">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", colors[color])}>
                        <Icon className="w-7 h-7" />
                    </div>
                    <div>
                        <h4 className="font-bold text-lg text-white group-hover:text-primary transition-colors">{title}</h4>
                        <p className="text-xs text-white/40 font-medium">{subtitle}</p>
                    </div>
                </div>
                {/* Animated Connector Dot */}
                <div className={cn(
                    "absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full",
                    side === 'left' ? "-right-1" : "-left-1",
                    `bg-${color}-500 shadow-[0_0_10px_rgba(0,0,0,1)]`
                )} />
            </GlassCard>
        </motion.div>
    )
}

function DataStream({ d, color, delay }: { d: string; color: string; delay: number }) {
    return (
        <g>
            <path
                d={d}
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="4 8"
                className={cn("opacity-20", color)}
            />
            <motion.path
                d={d}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={cn(color)}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                    pathLength: [0, 1, 1],
                    opacity: [0, 1, 0],
                    pathOffset: [0, 0, 1]
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: delay,
                    ease: "linear"
                }}
            />
            {/* Flowing Pulse */}
            <circle r="3" className={cn("fill-current", color)}>
                <animateMotion
                    dur="3s"
                    repeatCount="indefinite"
                    path={d}
                    begin={`${delay}s`}
                />
            </circle>
        </g>
    )
}
