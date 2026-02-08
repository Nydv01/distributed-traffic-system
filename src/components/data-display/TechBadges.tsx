import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TechBadgeProps {
    icon: React.ReactNode
    label: string
    href?: string
    className?: string
}

function TechBadge({ icon, label, href, className }: TechBadgeProps) {
    const Content = (
        <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-xl',
                'bg-card/50 border border-border backdrop-blur-sm',
                'text-sm font-medium text-muted-foreground',
                'hover:border-primary/30 hover:text-foreground transition-colors',
                className
            )}
        >
            {icon}
            <span>{label}</span>
        </motion.div>
    )

    if (href) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer">
                {Content}
            </a>
        )
    }

    return Content
}

interface TechStackBadgesProps {
    className?: string
    stagger?: boolean
}

/**
 * Technology stack badges display with React, TypeScript, and Framer Motion
 */
export function TechStackBadges({ className, stagger = true }: TechStackBadgesProps) {
    const badges = [
        {
            icon: (
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
            ),
            label: 'React 18',
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                    <path d="M3 3h18v18H3V3zm16.525 13.707c-.131-.821-.666-1.511-2.252-2.155-.552-.259-1.165-.438-1.349-.854-.068-.248-.078-.382-.034-.529.113-.484.687-.629 1.137-.495.293.086.567.299.724.658.75-.441.75-.441 1.269-.743-.19-.295-.288-.423-.42-.532-.441-.385-1.034-.584-1.988-.566l-.488.067c-.468.119-.908.334-1.169.635-.76.873-.542 2.395.372 3.023 1.088.756 2.675.917 2.879 1.627.189.655-.439 1.085-1.37 1.063-.571-.008-.893-.241-1.243-.669l-1.262.746c.143.27.312.506.546.721.926.857 3.241.965 4.105-.272.029-.042.059-.085.088-.129.661-1.012.462-2.321-.545-2.596zm-6.812-2.809l-1.546.001c0 1.325-.003 2.647-.003 3.973 0 .84.041 1.606-.088 1.84-.209.463-.824.379-1.096.282-.279-.109-.428-.279-.614-.59l-.003-.008-1.29.782c.218.457.541.844.967 1.097.653.378 1.528.447 2.442.23.595-.173 1.106-.542 1.372-1.086.36-.72.283-1.608.283-2.585 0-1.312-.001-2.624-.001-3.936l-.423.001z" />
                </svg>
            ),
            label: 'TypeScript',
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
            ),
            label: 'Framer Motion',
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
            label: 'Zustand',
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zm0 15l-5.21-2.61-4.79 2.39L12 22l10-5.22-4.79-2.39L12 17z" />
                </svg>
            ),
            label: 'Three.js',
        },
    ]

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className={cn('flex flex-wrap justify-center gap-3', className)}
        >
            {badges.map((badge, i) => (
                <motion.div
                    key={badge.label}
                    initial={stagger ? { opacity: 0, y: 10 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: stagger ? 0.9 + i * 0.1 : 0 }}
                >
                    <TechBadge {...badge} />
                </motion.div>
            ))}
        </motion.div>
    )
}
