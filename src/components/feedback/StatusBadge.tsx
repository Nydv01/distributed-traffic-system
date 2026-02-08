import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { NodeStatus as NodeStatusType } from '@/lib/utils'

interface StatusBadgeProps {
    status: NodeStatusType
    showLabel?: boolean
    size?: 'sm' | 'md' | 'lg'
    animate?: boolean
    className?: string
}

const statusConfig: Record<
    NodeStatusType,
    { label: string; dotColor: string; bgColor: string; textColor: string }
> = {
    idle: {
        label: 'Idle',
        dotColor: 'bg-muted-foreground',
        bgColor: 'bg-muted/50',
        textColor: 'text-muted-foreground',
    },
    processing: {
        label: 'Processing',
        dotColor: 'bg-primary',
        bgColor: 'bg-primary/10',
        textColor: 'text-primary',
    },
    success: {
        label: 'Completed',
        dotColor: 'bg-success',
        bgColor: 'bg-success/10',
        textColor: 'text-success',
    },
    failed: {
        label: 'Failed',
        dotColor: 'bg-destructive',
        bgColor: 'bg-destructive/10',
        textColor: 'text-destructive',
    },
}

const sizeConfig = {
    sm: { dot: 'w-2 h-2', text: 'text-xs', padding: 'px-2 py-1' },
    md: { dot: 'w-3 h-3', text: 'text-sm', padding: 'px-3 py-1.5' },
    lg: { dot: 'w-4 h-4', text: 'text-base', padding: 'px-4 py-2' },
}

export function StatusBadge({
    status,
    showLabel = true,
    size = 'md',
    animate = true,
    className,
}: StatusBadgeProps) {
    const config = statusConfig[status]
    const sizes = sizeConfig[size]

    return (
        <div
            className={cn(
                'inline-flex items-center gap-2 rounded-full',
                showLabel && [config.bgColor, sizes.padding],
                className
            )}
        >
            <motion.span
                className={cn(
                    'rounded-full',
                    sizes.dot,
                    config.dotColor,
                    animate && status === 'processing' && 'animate-pulse'
                )}
                initial={animate ? { scale: 0.8 } : undefined}
                animate={animate ? { scale: 1 } : undefined}
            />
            {showLabel && (
                <span className={cn(sizes.text, config.textColor, 'font-medium')}>
                    {config.label}
                </span>
            )}
        </div>
    )
}

// Simple dot-only variant for compact displays
export function StatusDot({
    status,
    animate = true,
    className,
}: Omit<StatusBadgeProps, 'showLabel' | 'size'>) {
    const config = statusConfig[status]

    return (
        <span
            className={cn(
                'w-3 h-3 rounded-full inline-block',
                config.dotColor,
                animate && status === 'processing' && 'animate-pulse',
                className
            )}
        />
    )
}
