import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MetricCardProps {
    icon: LucideIcon
    value: string | number
    label: string
    className?: string
    iconClassName?: string
    trend?: {
        value: number
        isPositive: boolean
    }
}

export function MetricCard({
    icon: Icon,
    value,
    label,
    className,
    iconClassName,
    trend,
}: MetricCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn('text-center', className)}
        >
            <Icon className={cn('w-6 h-6 mx-auto mb-2 text-primary', iconClassName)} />
            <div className={cn('text-3xl font-bold', className)}>
                {value}
                {trend && (
                    <span
                        className={cn(
                            'text-sm ml-1',
                            trend.isPositive ? 'text-success' : 'text-destructive'
                        )}
                    >
                        {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                    </span>
                )}
            </div>
            <div className="text-sm text-muted-foreground">{label}</div>
        </motion.div>
    )
}
