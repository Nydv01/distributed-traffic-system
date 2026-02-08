import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface StatCardProps {
    label: string
    value: string | number
    highlight?: boolean
    className?: string
}

export function StatCard({
    label,
    value,
    highlight = false,
    className,
}: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
                'text-center p-5 rounded-xl transition-all',
                highlight
                    ? 'bg-success/10 border border-success/20'
                    : 'bg-muted/50 hover:bg-muted/70',
                className
            )}
        >
            <div className="text-sm text-muted-foreground mb-1">{label}</div>
            <div
                className={cn(
                    'text-2xl font-bold',
                    highlight && 'text-success'
                )}
            >
                {value}
            </div>
        </motion.div>
    )
}
