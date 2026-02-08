import { motion } from 'framer-motion'
import {
    Network,
    Gauge,
    Activity,
    Timer,
    CheckCircle,
    AlertTriangle,
    Clock,
    Zap,
    TrendingUp,
    Package,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { REGION_MAP, RegionId } from '@/lib/designTokens'
import { TrafficData, NodeStatus, RegionNodeAnalytics } from '@/types/traffic'
import { StatusDot } from '@/components/feedback/StatusBadge'

interface EnhancedNodeStatusCardProps {
    regionId: RegionId
    name: string
    status: NodeStatus
    progress: number
    trafficData?: TrafficData
    analytics?: RegionNodeAnalytics
    showDeepMetrics?: boolean
    className?: string
}

/**
 * Enhanced NodeStatusCard with deep analytics display
 * 
 * Shows:
 * - Node status and progress
 * - Packets processed/dropped
 * - Latency (avg/min/max)
 * - Throughput
 * - Start/end times
 */
export function EnhancedNodeStatusCard({
    regionId,
    name,
    status,
    progress,
    trafficData,
    analytics,
    showDeepMetrics = true,
    className,
}: EnhancedNodeStatusCardProps) {
    const regionConfig = REGION_MAP[regionId]

    // Format time from timestamp
    const formatTimestamp = (ts: number | null) => {
        if (!ts) return '--:--:--'
        return new Date(ts).toLocaleTimeString('en-IN', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        })
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                'relative rounded-3xl p-6 border backdrop-blur-xl transition-all duration-300',
                status === 'processing'
                    ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                    : status === 'success'
                        ? 'border-green-500/50 bg-green-500/5'
                        : status === 'failed'
                            ? 'border-red-500/50 bg-red-500/5'
                            : 'border-border bg-muted/30 hover:bg-muted/40',
                className
            )}
        >
            {/* Processing pulse animation */}
            {status === 'processing' && (
                <motion.div
                    className="absolute inset-0 rounded-3xl border-2 border-primary/30"
                    animate={{ scale: [1, 1.02, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div
                        className={cn(
                            'w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br text-white shadow-lg',
                            regionConfig?.gradient ?? 'from-gray-500 to-gray-600'
                        )}
                    >
                        {regionConfig?.emoji ?? '📍'}
                    </div>
                    <div>
                        <h3
                            className={cn(
                                'font-semibold text-lg',
                                regionConfig?.textColor ?? 'text-foreground'
                            )}
                        >
                            {name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            Distributed Worker Node
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2">
                        <StatusDot status={status} />
                        <span className="text-sm font-medium capitalize">{status}</span>
                    </div>
                    {analytics?.startTime && (
                        <span className="text-xs text-muted-foreground font-mono">
                            Started: {formatTimestamp(analytics.startTime)}
                        </span>
                    )}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-5">
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Execution Progress</span>
                    <span className="font-medium font-mono">{Math.round(progress)}%</span>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                    <motion.div
                        className={cn(
                            'h-full rounded-full',
                            status === 'success'
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                : status === 'failed'
                                    ? 'bg-gradient-to-r from-red-500 to-rose-500'
                                    : 'bg-gradient-to-r from-primary to-blue-500'
                        )}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.4 }}
                    />
                </div>
            </div>

            {/* Basic Metrics Row */}
            <div className="grid grid-cols-3 gap-4 text-center mb-4">
                <MetricItem
                    icon={<Gauge className="w-4 h-4" />}
                    value={trafficData ? Math.round(trafficData.averageSpeed) : '--'}
                    label="Avg Speed"
                    unit="km/h"
                />
                <MetricItem
                    icon={<Activity className="w-4 h-4" />}
                    value={trafficData ? trafficData.congestionScore : '--'}
                    label="Congestion"
                    unit="%"
                    warning={trafficData && trafficData.congestionScore > 70}
                />
                <MetricItem
                    icon={<Timer className="w-4 h-4" />}
                    value={analytics?.executionTime ?? '--'}
                    label="Exec Time"
                    unit="ms"
                />
            </div>

            {/* Deep Analytics (when showDeepMetrics is true and we have analytics) */}
            {showDeepMetrics && analytics && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="border-t border-border/50 pt-4 mt-2"
                >
                    <div className="grid grid-cols-2 gap-3">
                        {/* Packets */}
                        <div className="flex items-center gap-2 bg-muted/30 rounded-xl p-3">
                            <Package className="w-5 h-5 text-blue-400" />
                            <div>
                                <div className="text-sm font-medium">
                                    {analytics.packetsProcessed.toLocaleString()}
                                    {analytics.packetsDropped > 0 && (
                                        <span className="text-red-400 ml-1">
                                            (-{analytics.packetsDropped})
                                        </span>
                                    )}
                                </div>
                                <div className="text-xs text-muted-foreground">Packets</div>
                            </div>
                        </div>

                        {/* Throughput */}
                        <div className="flex items-center gap-2 bg-muted/30 rounded-xl p-3">
                            <TrendingUp className="w-5 h-5 text-green-400" />
                            <div>
                                <div className="text-sm font-medium">
                                    {analytics.throughput.toFixed(1)} <span className="text-xs text-muted-foreground">p/s</span>
                                </div>
                                <div className="text-xs text-muted-foreground">Throughput</div>
                            </div>
                        </div>

                        {/* Latency */}
                        <div className="flex items-center gap-2 bg-muted/30 rounded-xl p-3">
                            <Clock className="w-5 h-5 text-amber-400" />
                            <div>
                                <div className="text-sm font-medium">
                                    {analytics.avgLatency.toFixed(0)}ms
                                    <span className="text-xs text-muted-foreground ml-1">
                                        ({analytics.minLatency}-{analytics.maxLatency})
                                    </span>
                                </div>
                                <div className="text-xs text-muted-foreground">Latency (avg)</div>
                            </div>
                        </div>

                        {/* Failure Rate */}
                        <div className="flex items-center gap-2 bg-muted/30 rounded-xl p-3">
                            <Zap className={cn(
                                'w-5 h-5',
                                analytics.failureRate > 10 ? 'text-red-400' : 'text-emerald-400'
                            )} />
                            <div>
                                <div className={cn(
                                    'text-sm font-medium',
                                    analytics.failureRate > 10 ? 'text-red-400' : ''
                                )}>
                                    {analytics.failureRate.toFixed(1)}%
                                </div>
                                <div className="text-xs text-muted-foreground">Failure Rate</div>
                            </div>
                        </div>
                    </div>

                    {/* Timing Row */}
                    <div className="flex justify-between mt-3 text-xs text-muted-foreground font-mono bg-muted/20 rounded-lg p-2">
                        <span>Start: {formatTimestamp(analytics.startTime)}</span>
                        <span>End: {formatTimestamp(analytics.endTime)}</span>
                        {analytics.retryCount > 0 && (
                            <span className="text-amber-400">Retries: {analytics.retryCount}</span>
                        )}
                    </div>
                </motion.div>
            )}
        </motion.div>
    )
}

/* =========================================================
   HELPER COMPONENTS
========================================================= */

interface MetricItemProps {
    icon: React.ReactNode
    value: string | number
    label: string
    unit?: string
    warning?: boolean
}

function MetricItem({ icon, value, label, unit, warning }: MetricItemProps) {
    return (
        <div className="flex flex-col items-center gap-1">
            <div className={cn(
                'text-muted-foreground',
                warning && 'text-amber-400'
            )}>
                {icon}
            </div>
            <div className={cn(
                'text-lg font-semibold',
                warning && 'text-amber-400'
            )}>
                {value}
                {unit && <span className="text-xs text-muted-foreground ml-0.5">{unit}</span>}
            </div>
            <div className="text-xs text-muted-foreground">{label}</div>
        </div>
    )
}

export default EnhancedNodeStatusCard
