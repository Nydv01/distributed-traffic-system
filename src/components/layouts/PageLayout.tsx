import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================
// SHARED ANIMATION VARIANTS
// ============================================
export const motionVariants = {
    fadeInUp: {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    },
    fadeInScale: {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    },
    staggerContainer: {
        animate: { transition: { staggerChildren: 0.1 } }
    }
}

// ============================================
// PAGE LAYOUT
// ============================================
interface PageLayoutProps {
    title: string
    description?: string
    icon?: LucideIcon
    badge?: string
    badgeVariant?: 'default' | 'success' | 'warning' | 'destructive'
    children: React.ReactNode
    className?: string
    maxWidth?: 'md' | 'lg' | 'xl' | '6xl' | '7xl'
    showBackground?: boolean
}

const badgeVariants = {
    default: 'bg-primary/10 text-primary border-primary/20',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    destructive: 'bg-red-500/10 text-red-400 border-red-500/20',
}

const maxWidthClasses = {
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
}

export function PageLayout({
    title,
    description,
    icon: Icon,
    badge,
    badgeVariant = 'default',
    children,
    className,
    maxWidth = '7xl',
    showBackground = true,
}: PageLayoutProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({ target: containerRef })

    // Parallax for header
    const headerY = useTransform(scrollYProgress, [0, 0.3], [0, -50])
    const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8])

    return (
        <div
            ref={containerRef}
            className={cn('min-h-screen relative overflow-hidden', className)}
        >
            {/* Premium Background */}
            {showBackground && (
                <div className="absolute inset-0 -z-10">
                    {/* Gradient orbs */}
                    <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
                    <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px]" />
                    {/* Grid overlay */}
                    <div className="absolute inset-0 bg-grid-white opacity-[0.02] dark:opacity-[0.03]" />
                </div>
            )}

            <div className={cn('mx-auto px-4 py-10', maxWidthClasses[maxWidth])}>
                {/* Premium Page Header */}
                <motion.div
                    style={{ y: headerY, opacity: headerOpacity }}
                    className="text-center mb-16"
                >
                    {badge && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className={cn(
                                'inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-6 border uppercase tracking-widest',
                                badgeVariants[badgeVariant]
                            )}
                        >
                            {Icon && <Icon className="w-4 h-4" />}
                            {badge}
                        </motion.div>
                    )}

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                        className="text-4xl md:text-5xl font-black mb-4 tracking-tight"
                    >
                        {title}
                    </motion.h1>

                    {description && (
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="text-muted-foreground max-w-2xl mx-auto text-lg"
                        >
                            {description}
                        </motion.p>
                    )}
                </motion.div>

                {/* Page Content */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    {children}
                </motion.div>
            </div>
        </div>
    )
}

// ============================================
// ANIMATED SECTION (Scroll-Triggered)
// ============================================
interface AnimatedSectionProps {
    children: React.ReactNode
    className?: string
    delay?: number
    zoom?: boolean
}

export function AnimatedSection({
    children,
    className,
    delay = 0,
    zoom = false
}: AnimatedSectionProps) {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: false, margin: "-10%" })

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30, scale: zoom ? 0.95 : 1 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: zoom ? 0.95 : 1 }}
            transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

// ============================================
// PREMIUM SECTION CARD
// ============================================
interface SectionCardProps {
    title?: string
    description?: string
    children: React.ReactNode
    className?: string
    variant?: 'default' | 'strong' | 'gradient'
    glow?: boolean
}

export function SectionCard({
    title,
    description,
    children,
    className,
    variant = 'default',
    glow = false,
}: SectionCardProps) {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: false, margin: "-5%" })

    const variantClasses = {
        default: 'glass-card',
        strong: 'glass-card-strong',
        gradient: 'bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-border',
    }

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
            className={cn(
                'rounded-3xl p-8 relative overflow-hidden group',
                variantClasses[variant],
                glow && 'hover:shadow-xl hover:shadow-primary/10',
                className
            )}
        >
            {/* Hover glow effect */}
            {glow && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            )}

            {(title || description) && (
                <div className="mb-6 relative z-10">
                    {title && <h2 className="text-xl font-bold mb-1">{title}</h2>}
                    {description && (
                        <p className="text-sm text-muted-foreground">{description}</p>
                    )}
                </div>
            )}
            <div className="relative z-10">{children}</div>
        </motion.div>
    )
}

// ============================================
// METRIC CARD (Premium KPI Display)
// ============================================
interface MetricCardPremiumProps {
    icon?: LucideIcon
    label: string
    value: string | number
    subtext?: string
    color?: 'primary' | 'success' | 'warning' | 'destructive'
    animate?: boolean
}

export function MetricCardPremium({
    icon: Icon,
    label,
    value,
    subtext,
    color = 'primary',
    animate = true,
}: MetricCardPremiumProps) {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: true })

    const colorClasses = {
        primary: 'text-primary',
        success: 'text-emerald-400',
        warning: 'text-amber-400',
        destructive: 'text-red-400',
    }

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card rounded-2xl p-6 text-center group cursor-default"
        >
            {Icon && (
                <div className={cn('mx-auto mb-3 transition-transform group-hover:scale-110', colorClasses[color])}>
                    <Icon className="w-7 h-7" />
                </div>
            )}
            <motion.div
                className="text-3xl font-black mb-1"
                initial={animate ? { opacity: 0, scale: 0.5 } : {}}
                animate={isInView && animate ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.2, type: 'spring' }}
            >
                {value}
            </motion.div>
            <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold">
                {label}
            </div>
            {subtext && (
                <div className="text-[10px] text-muted-foreground/60 mt-1">{subtext}</div>
            )}
        </motion.div>
    )
}

// ============================================
// STATUS LED (Pulsing Indicator)
// ============================================
interface StatusLEDProps {
    status: 'idle' | 'active' | 'success' | 'warning' | 'error'
    size?: 'sm' | 'md' | 'lg'
    pulse?: boolean
}

export function StatusLED({ status, size = 'md', pulse = true }: StatusLEDProps) {
    const sizeClasses = { sm: 'w-2 h-2', md: 'w-3 h-3', lg: 'w-4 h-4' }
    const colorClasses = {
        idle: 'bg-muted-foreground',
        active: 'bg-blue-400',
        success: 'bg-emerald-400',
        warning: 'bg-amber-400',
        error: 'bg-red-400',
    }

    return (
        <span className="relative inline-flex">
            <span className={cn('rounded-full', sizeClasses[size], colorClasses[status])} />
            {pulse && status !== 'idle' && (
                <motion.span
                    className={cn('absolute inset-0 rounded-full', colorClasses[status])}
                    animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                />
            )}
        </span>
    )
}
