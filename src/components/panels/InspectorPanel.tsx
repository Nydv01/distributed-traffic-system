import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import {
    X,
    Maximize2,
    Minimize2,
    Activity,
    Cpu,
    HardDrive,
    Clock,
    Zap,
    TrendingUp,
    AlertTriangle,
    RefreshCw,
    Terminal,
    ChevronDown,
    ChevronUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { RegionNodeAnalytics } from '@/types/traffic'

interface NodeDetails {
    id: string
    name: string
    status: 'idle' | 'processing' | 'success' | 'failed'
    region: string
    trafficLoad: number
    cpuPct?: number
    memoryMB?: number
    lastUpdated: number
    metrics: {
        latencyMs: number
        throughput: number
        errorRate: number
    }
    analytics?: RegionNodeAnalytics
    logs?: LogEntry[]
}

interface LogEntry {
    timestamp: number
    level: 'info' | 'warn' | 'error'
    message: string
}

interface InspectorPanelProps {
    /** Node to inspect */
    node: NodeDetails | null
    /** Whether panel is open */
    isOpen: boolean
    /** Callback when panel closes */
    onClose: () => void
    /** Panel position */
    position?: 'left' | 'right'
    /** Additional className */
    className?: string
}

/**
 * Inspector slide-over panel for node details
 * 
 * Features:
 * - Node metrics display
 * - Live logs viewer
 * - Sparkline charts
 * - Expandable sections
 */
export function InspectorPanel({
    node,
    isOpen,
    onClose,
    position = 'right',
    className,
}: InspectorPanelProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [activeTab, setActiveTab] = useState<'metrics' | 'logs'>('metrics')
    const [logsExpanded, setLogsExpanded] = useState(true)

    const panelWidth = isExpanded ? 'w-[500px]' : 'w-[360px]'

    const scrollRef = useRef<HTMLDivElement>(null)

    // Reset scroll when node changes or panel opens
    useEffect(() => {
        if (isOpen && scrollRef.current) {
            scrollRef.current.scrollTop = 0
        }
    }, [isOpen, node?.id])

    const panelContent = (
        <AnimatePresence>
            {isOpen && node && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9990]"
                        onClick={onClose}
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: position === 'right' ? '100%' : '-100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: position === 'right' ? '100%' : '-100%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className={cn(
                            'fixed top-0 bottom-0 z-[9999]',
                            position === 'right' ? 'right-0' : 'left-0',
                            panelWidth,
                            'bg-background/95 backdrop-blur-xl',
                            'border-l border-border shadow-2xl shadow-black/20',
                            'flex flex-col transition-all duration-300',
                            className
                        )}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    'w-3 h-3 rounded-full',
                                    node.status === 'processing' && 'bg-blue-500 animate-pulse',
                                    node.status === 'success' && 'bg-green-500',
                                    node.status === 'failed' && 'bg-red-500',
                                    node.status === 'idle' && 'bg-gray-500'
                                )} />
                                <div>
                                    <h2 className="font-semibold text-lg">{node.name}</h2>
                                    <p className="text-xs text-muted-foreground capitalize">{node.region} • {node.status}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={onClose}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-border">
                            <button
                                onClick={() => setActiveTab('metrics')}
                                className={cn(
                                    'flex-1 py-3 text-sm font-medium transition-colors',
                                    activeTab === 'metrics'
                                        ? 'text-primary border-b-2 border-primary'
                                        : 'text-muted-foreground hover:text-foreground'
                                )}
                            >
                                Metrics
                            </button>
                            <button
                                onClick={() => setActiveTab('logs')}
                                className={cn(
                                    'flex-1 py-3 text-sm font-medium transition-colors',
                                    activeTab === 'logs'
                                        ? 'text-primary border-b-2 border-primary'
                                        : 'text-muted-foreground hover:text-foreground'
                                )}
                            >
                                Logs
                            </button>
                        </div>

                        {/* Content */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                            {activeTab === 'metrics' && (
                                <>
                                    {/* Live Metrics */}
                                    <MetricSection title="Live Metrics" icon={<Activity className="w-4 h-4" />}>
                                        <div className="grid grid-cols-2 gap-3">
                                            <MetricCard
                                                label="Traffic Load"
                                                value={`${node.trafficLoad}%`}
                                                icon={<TrendingUp className="w-4 h-4" />}
                                                color={node.trafficLoad > 80 ? 'warning' : 'default'}
                                            />
                                            <MetricCard
                                                label="Latency"
                                                value={`${node.metrics.latencyMs}ms`}
                                                icon={<Clock className="w-4 h-4" />}
                                                color={node.metrics.latencyMs > 200 ? 'warning' : 'default'}
                                            />
                                            <MetricCard
                                                label="Throughput"
                                                value={`${node.metrics.throughput}/s`}
                                                icon={<Zap className="w-4 h-4" />}
                                            />
                                            <MetricCard
                                                label="Error Rate"
                                                value={`${node.metrics.errorRate.toFixed(1)}%`}
                                                icon={<AlertTriangle className="w-4 h-4" />}
                                                color={node.metrics.errorRate > 5 ? 'destructive' : 'default'}
                                            />
                                        </div>
                                    </MetricSection>

                                    {/* Resource Usage */}
                                    <MetricSection title="Resources" icon={<Cpu className="w-4 h-4" />}>
                                        <div className="space-y-3">
                                            <ResourceBar
                                                label="CPU"
                                                value={node.cpuPct ?? 0}
                                                max={100}
                                                unit="%"
                                            />
                                            <ResourceBar
                                                label="Memory"
                                                value={node.memoryMB ?? 0}
                                                max={1024}
                                                unit="MB"
                                            />
                                        </div>
                                    </MetricSection>

                                    {/* Analytics (if available) */}
                                    {node.analytics && (
                                        <MetricSection title="Deep Analytics" icon={<HardDrive className="w-4 h-4" />}>
                                            <div className="grid grid-cols-2 gap-3">
                                                <MetricCard
                                                    label="Packets Processed"
                                                    value={node.analytics.packetsProcessed.toLocaleString()}
                                                    icon={<TrendingUp className="w-4 h-4" />}
                                                />
                                                <MetricCard
                                                    label="Packets Dropped"
                                                    value={node.analytics.packetsDropped.toString()}
                                                    icon={<AlertTriangle className="w-4 h-4" />}
                                                    color={node.analytics.packetsDropped > 0 ? 'warning' : 'default'}
                                                />
                                                <MetricCard
                                                    label="Avg Latency"
                                                    value={`${node.analytics.avgLatency.toFixed(0)}ms`}
                                                    icon={<Clock className="w-4 h-4" />}
                                                />
                                                <MetricCard
                                                    label="Failure Rate"
                                                    value={`${node.analytics.failureRate.toFixed(1)}%`}
                                                    icon={<Zap className="w-4 h-4" />}
                                                    color={node.analytics.failureRate > 10 ? 'destructive' : 'default'}
                                                />
                                            </div>
                                        </MetricSection>
                                    )}

                                    {/* Sparkline placeholder */}
                                    <MetricSection title="Latency Over Time" icon={<Activity className="w-4 h-4" />}>
                                        <div className="h-24 bg-muted/50 rounded-xl flex items-center justify-center text-muted-foreground text-sm">
                                            <SparklineChart />
                                        </div>
                                    </MetricSection>
                                </>
                            )}

                            {activeTab === 'logs' && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm text-muted-foreground">Recent Logs</span>
                                        <Button variant="ghost" size="sm" className="gap-1 text-xs">
                                            <RefreshCw className="w-3 h-3" />
                                            Refresh
                                        </Button>
                                    </div>

                                    {node.logs && node.logs.length > 0 ? (
                                        <div className="space-y-1">
                                            {node.logs.map((log, i) => (
                                                <LogRow key={i} log={log} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-muted/50 rounded-xl p-4 text-center">
                                            <Terminal className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                                            <p className="text-sm text-muted-foreground">No logs available</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-border text-xs text-muted-foreground text-center">
                            Last updated: {new Date(node.lastUpdated).toLocaleTimeString()}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )

    if (typeof document === 'undefined') return null
    return createPortal(panelContent, document.body)
}

/* =========================================================
   HELPER COMPONENTS
========================================================= */

function MetricSection({
    title,
    icon,
    children
}: {
    title: string
    icon: React.ReactNode
    children: React.ReactNode
}) {
    return (
        <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
            <div className="flex items-center gap-2 mb-3 text-sm font-medium text-muted-foreground">
                {icon}
                {title}
            </div>
            {children}
        </div>
    )
}

function MetricCard({
    label,
    value,
    icon,
    color = 'default',
}: {
    label: string
    value: string
    icon: React.ReactNode
    color?: 'default' | 'warning' | 'destructive'
}) {
    return (
        <div className={cn(
            'bg-muted/50 rounded-lg p-3 border border-border/50',
            color === 'warning' && 'bg-amber-500/10 border-amber-500/20',
            color === 'destructive' && 'bg-red-500/10 border-red-500/20'
        )}>
            <div className={cn(
                'text-muted-foreground mb-1',
                color === 'warning' && 'text-amber-400',
                color === 'destructive' && 'text-red-400'
            )}>
                {icon}
            </div>
            <div className={cn(
                'text-lg font-semibold font-mono',
                color === 'warning' && 'text-amber-400',
                color === 'destructive' && 'text-red-400'
            )}>
                {value}
            </div>
            <div className="text-xs text-muted-foreground">{label}</div>
        </div>
    )
}

function ResourceBar({
    label,
    value,
    max,
    unit,
}: {
    label: string
    value: number
    max: number
    unit: string
}) {
    const percentage = Math.min(100, (value / max) * 100)
    const isHigh = percentage > 80

    return (
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">{label}</span>
                <span className={cn('font-mono', isHigh && 'text-amber-400')}>
                    {value.toFixed(0)}{unit}
                </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden border border-border/50">
                <motion.div
                    className={cn(
                        'h-full rounded-full',
                        isHigh ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-primary to-blue-400'
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>
        </div>
    )
}

function SparklineChart() {
    // Simple SVG sparkline
    const points = [20, 35, 28, 45, 32, 50, 38, 55, 42, 48, 52, 45]
    const max = Math.max(...points)
    const min = Math.min(...points)
    const height = 60
    const width = 280

    const path = points.map((p, i) => {
        const x = (i / (points.length - 1)) * width
        const y = height - ((p - min) / (max - min)) * height
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    }).join(' ')

    return (
        <svg width={width} height={height} className="overflow-visible">
            <defs>
                <linearGradient id="sparkline-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="hsl(217, 91%, 60%)" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="hsl(217, 91%, 60%)" stopOpacity="0" />
                </linearGradient>
            </defs>
            <path
                d={path + ` L ${width} ${height} L 0 ${height} Z`}
                fill="url(#sparkline-gradient)"
            />
            <path
                d={path}
                fill="none"
                stroke="hsl(217, 91%, 60%)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

function LogRow({ log }: { log: LogEntry }) {
    return (
        <div className={cn(
            'flex items-start gap-2 p-2 rounded-lg text-xs font-mono',
            log.level === 'error' && 'bg-red-500/10 text-red-400',
            log.level === 'warn' && 'bg-amber-500/10 text-amber-500',
            log.level === 'info' && 'bg-muted/50 text-muted-foreground border border-border/50'
        )}>
            <span className="text-muted-foreground shrink-0">
                {new Date(log.timestamp).toLocaleTimeString()}
            </span>
            <span className={cn(
                'shrink-0 uppercase text-[10px] font-semibold px-1.5 py-0.5 rounded',
                log.level === 'error' && 'bg-red-500/20 text-red-500',
                log.level === 'warn' && 'bg-amber-500/20 text-amber-600',
                log.level === 'info' && 'bg-muted text-muted-foreground'
            )}>
                {log.level}
            </span>
            <span className="break-all">{log.message}</span>
        </div>
    )
}

export default InspectorPanel
