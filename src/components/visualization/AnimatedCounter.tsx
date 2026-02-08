import { useEffect, useRef, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AnimatedCounterProps {
    value: number
    duration?: number
    prefix?: string
    suffix?: string
    decimals?: number
    className?: string
}

export function AnimatedCounter({
    value,
    duration = 1,
    prefix = '',
    suffix = '',
    decimals = 0,
    className,
}: AnimatedCounterProps) {
    const spring = useSpring(0, {
        stiffness: 100,
        damping: 30,
        duration: duration * 1000,
    })

    const display = useTransform(spring, (latest) =>
        latest.toFixed(decimals)
    )

    const [displayValue, setDisplayValue] = useState('0')

    useEffect(() => {
        spring.set(value)
    }, [value, spring])

    useEffect(() => {
        const unsubscribe = display.on('change', (v) => {
            setDisplayValue(v)
        })
        return unsubscribe
    }, [display])

    return (
        <motion.span className={cn('tabular-nums', className)}>
            {prefix}
            {displayValue}
            {suffix}
        </motion.span>
    )
}

// Variant with icon and label
interface AnimatedStatProps extends AnimatedCounterProps {
    label: string
    icon?: React.ReactNode
}

export function AnimatedStat({
    value,
    label,
    icon,
    prefix,
    suffix,
    decimals,
    className,
}: AnimatedStatProps) {
    return (
        <div className={cn('text-center', className)}>
            {icon && <div className="mb-2">{icon}</div>}
            <div className="text-3xl font-bold">
                <AnimatedCounter
                    value={value}
                    prefix={prefix}
                    suffix={suffix}
                    decimals={decimals}
                />
            </div>
            <div className="text-sm text-muted-foreground">{label}</div>
        </div>
    )
}
