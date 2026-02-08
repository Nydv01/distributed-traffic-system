import { motion } from 'framer-motion'
import {
    Network,
    Gauge,
    Activity,
    Timer,
    CheckCircle,
    AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { REGION_MAP, RegionId } from '@/lib/designTokens'
import { TrafficData, NodeStatus } from '@/types/traffic'
import { StatusDot } from '@/components/feedback/StatusBadge'

interface NodeCardProps {
    regionId: RegionId
    name: string
    status: NodeStatus
    progress: number
    trafficData?: TrafficData
    className?: string
}

export function NodeCard({
    regionId,
    name,
    status,
    progress,
    trafficData,
    className,
}: NodeCardProps) {
    const regionConfig = REGION_MAP[regionId]

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                'relative rounded-3xl p-6 border backdrop-blur-xl transition-all',
                status === 'processing'
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-muted/30 hover:bg-muted/40',
                className
            )}
        >
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

                <div className="flex items-center gap-2">
                    <StatusDot status={status} />
                    <span className="text-sm capitalize">{status}</span>
                </div>
            </div>

            {/* Progress */}
            <div className="mb-5">
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Execution Progress</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.4 }}
                    />
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 text-center">
                <MetricItem
                    icon={<Gauge className="w-4 h-4" />}
                    value={trafficData ? Math.round(trafficData.averageSpeed) : '--'}
                    label="Avg Speed"
                />
                <MetricItem
                    icon={<Activity className="w-4 h-4" />}
                    value={trafficData ? `${Math.round(trafficData.congestionScore)}%` : '--%'}
                    label="Congestion"
                />
                <MetricItem
                    icon={<Timer className="w-4 h-4" />}
                    value={trafficData ? `${trafficData.delayFactor.toFixed(1)}x` : '--x'}
                    label="Delay"
                />
            </div>

            {/* Status Icon Overlay */}
            {status === 'success' && (
                <CheckCircle className="absolute top-4 right-4 w-6 h-6 text-success" />
            )}
            {status === 'failed' && (
                <AlertTriangle className="absolute top-4 right-4 w-6 h-6 text-destructive" />
            )}
        </motion.div>
    )
}

function MetricItem({
    icon,
    value,
    label,
}: {
    icon: React.ReactNode
    value: string | number
    label: string
}) {
    return (
        <div className="rounded-xl bg-muted/50 p-3">
            <div className="mx-auto mb-1 text-muted-foreground flex justify-center">
                {icon}
            </div>
            <div className="font-semibold">{value}</div>
            <div className="text-xs text-muted-foreground">{label}</div>
        </div>
    )
}
