import { motion } from 'framer-motion'
import { FloatingParticles } from './FloatingParticles'

interface PremiumBackgroundProps {
    mousePosition?: { x: number; y: number }
    showParticles?: boolean
    showGrid?: boolean
    variant?: 'default' | 'dense' | 'subtle'
    children?: React.ReactNode
}

/**
 * Premium animated background with parallax gradient orbs, floating particles, and grid overlay
 */
export function PremiumBackground({
    mousePosition = { x: 0, y: 0 },
    showParticles = true,
    showGrid = true,
    variant = 'default',
    children
}: PremiumBackgroundProps) {
    const intensity = variant === 'dense' ? 1.5 : variant === 'subtle' ? 0.5 : 1
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1000
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800

    return (
        <div className="absolute inset-0 -z-10">
            {/* Primary gradient orb */}
            <motion.div
                className="absolute top-0 left-1/4 rounded-full blur-[180px]"
                style={{
                    width: `${700 * intensity}px`,
                    height: `${700 * intensity}px`,
                    background: `hsl(var(--primary) / ${0.12 * intensity})`
                }}
                animate={{
                    x: (mousePosition.x - windowWidth / 2) * 0.02,
                    y: (mousePosition.y - windowHeight / 2) * 0.02,
                }}
                transition={{ type: 'spring', stiffness: 50, damping: 30 }}
            />

            {/* Secondary gradient orb */}
            <motion.div
                className="absolute bottom-0 right-1/4 rounded-full blur-[150px]"
                style={{
                    width: `${500 * intensity}px`,
                    height: `${500 * intensity}px`,
                    background: `hsl(220 100% 50% / ${0.08 * intensity})`
                }}
                animate={{
                    x: (mousePosition.x - windowWidth / 2) * -0.015,
                    y: (mousePosition.y - windowHeight / 2) * -0.015,
                }}
                transition={{ type: 'spring', stiffness: 50, damping: 30 }}
            />

            {/* Tertiary gradient orb */}
            <motion.div
                className="absolute top-1/2 left-0 rounded-full blur-[120px]"
                style={{
                    width: `${400 * intensity}px`,
                    height: `${400 * intensity}px`,
                    background: `hsl(160 100% 40% / ${0.06 * intensity})`
                }}
                animate={{
                    x: (mousePosition.x - windowWidth / 2) * 0.01,
                    y: (mousePosition.y - windowHeight / 2) * 0.01,
                }}
                transition={{ type: 'spring', stiffness: 50, damping: 30 }}
            />

            {/* Floating particles */}
            {showParticles && <FloatingParticles count={25} />}

            {/* Subtle grid */}
            {showGrid && (
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                    }}
                />
            )}

            {children}
        </div>
    )
}
