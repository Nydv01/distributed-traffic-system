import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ComparisonBarProps {
    label: string
    value: number
    maxValue: number
    formattedValue: string
    variant?: 'default' | 'success' | 'muted'
    animate?: boolean
    className?: string
}

const variantStyles = {
    default: 'bg-primary',
    success: 'bg-success',
    muted: 'bg-muted-foreground',
}

export function ComparisonBar({
    label,
    value,
    maxValue,
    formattedValue,
    variant = 'default',
    animate = true,
    className,
}: ComparisonBarProps) {
    const percentage = Math.min((value / maxValue) * 100, 100)

    return (
        <div className={cn('space-y-1', className)}>
            <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span
                    className={cn(
                        'font-mono',
                        variant === 'success' && 'text-success'
                    )}
                >
                    {formattedValue}
                </span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                    className={cn('h-full rounded-full', variantStyles[variant])}
                    initial={animate ? { width: 0 } : undefined}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                />
            </div>
        </div>
    )
}

// Side-by-side comparison component
interface ComparisonPairProps {
    sequential: {
        label: string
        value: number
        formattedValue: string
    }
    parallel: {
        label: string
        value: number
        formattedValue: string
    }
    speedup: string
    className?: string
}

export function ComparisonPair({
    sequential,
    parallel,
    speedup,
    className,
}: ComparisonPairProps) {
    const maxValue = Math.max(sequential.value, parallel.value)

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn('p-6 rounded-2xl bg-muted/50 space-y-4', className)}
        >
            <h4 className="font-semibold text-center mb-4">
                Parallel vs Sequential Execution
            </h4>

            <ComparisonBar
                label={sequential.label}
                value={sequential.value}
                maxValue={maxValue}
                formattedValue={sequential.formattedValue}
                variant="muted"
            />

            <ComparisonBar
                label={parallel.label}
                value={parallel.value}
                maxValue={maxValue}
                formattedValue={parallel.formattedValue}
                variant="success"
            />

            <div className="text-center pt-2">
                <span className="text-2xl font-bold text-success">{speedup}</span>
                <span className="text-muted-foreground ml-2">faster due to parallelism</span>
            </div>
        </motion.div>
    )
}
