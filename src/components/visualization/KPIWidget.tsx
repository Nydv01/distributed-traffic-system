import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KPIWidgetProps {
    icon: LucideIcon
    value: string | number
    label: string
    description?: string
    trend?: {
        value: number
        isPositive: boolean
        label: string
    }
    variant?: 'default' | 'success' | 'primary'
    className?: string
}

const variantStyles = {
    default: {
        iconBg: 'bg-muted',
        iconColor: 'text-muted-foreground',
        valueColor: 'text-foreground',
    },
    success: {
        iconBg: 'bg-success/10',
        iconColor: 'text-success',
        valueColor: 'text-success',
    },
    primary: {
        iconBg: 'bg-primary/10',
        iconColor: 'text-primary',
        valueColor: 'text-primary',
    },
}

export function KPIWidget({
    icon: Icon,
    value,
    label,
    description,
    trend,
    variant = 'default',
    className,
}: KPIWidgetProps) {
    const styles = variantStyles[variant]

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
                'p-6 rounded-2xl glass-card hover:shadow-lg transition-shadow',
                className
            )}
        >
            <div className="flex items-start justify-between mb-4">
                <div
                    className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center',
                        styles.iconBg
                    )}
                >
                    <Icon className={cn('w-6 h-6', styles.iconColor)} />
                </div>

                {trend && (
                    <div
                        className={cn(
                            'text-sm font-medium px-2 py-1 rounded-lg',
                            trend.isPositive
                                ? 'bg-success/10 text-success'
                                : 'bg-destructive/10 text-destructive'
                        )}
                    >
                        {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                    </div>
                )}
            </div>

            <div className={cn('text-3xl font-bold mb-1', styles.valueColor)}>
                {value}
            </div>

            <div className="text-sm text-muted-foreground">{label}</div>

            {description && (
                <div className="mt-2 text-xs text-muted-foreground/70">
                    {description}
                </div>
            )}
        </motion.div>
    )
}
