import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProgressRingProps {
    progress: number // 0-100
    size?: number
    strokeWidth?: number
    className?: string
    color?: string
    bgColor?: string
    showValue?: boolean
    animate?: boolean
}

/**
 * Circular progress ring with animation support
 */
export function ProgressRing({
    progress,
    size = 80,
    strokeWidth = 6,
    className,
    color = 'stroke-primary',
    bgColor = 'stroke-muted',
    showValue = true,
    animate = true
}: ProgressRingProps) {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const offset = circumference - (progress / 100) * circumference

    return (
        <div className={cn('relative inline-flex items-center justify-center', className)}>
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    strokeWidth={strokeWidth}
                    className={bgColor}
                />
                {/* Progress circle */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    className={color}
                    initial={animate ? { strokeDashoffset: circumference } : false}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    style={{
                        strokeDasharray: circumference,
                    }}
                />
            </svg>
            {showValue && (
                <motion.div
                    initial={animate ? { opacity: 0, scale: 0.8 } : false}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <span className="text-lg font-bold">{Math.round(progress)}%</span>
                </motion.div>
            )}
        </div>
    )
}
