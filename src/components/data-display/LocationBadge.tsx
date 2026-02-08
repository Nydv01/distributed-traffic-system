import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LocationBadgeProps {
    label: string
    name: string
    variant: 'success' | 'destructive'
    className?: string
}

export function LocationBadge({
    label,
    name,
    variant,
    className,
}: LocationBadgeProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn('text-center', className)}
        >
            <div
                className={cn(
                    'w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2',
                    variant === 'success'
                        ? 'bg-success/10'
                        : 'bg-destructive/10'
                )}
            >
                <MapPin
                    className={cn(
                        'w-6 h-6',
                        variant === 'success'
                            ? 'text-success'
                            : 'text-destructive'
                    )}
                />
            </div>
            <div className="font-semibold">{name}</div>
            <div className="text-xs text-muted-foreground">{label}</div>
        </motion.div>
    )
}
