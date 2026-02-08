import { motion } from 'framer-motion'

interface FloatingParticlesProps {
    count?: number
    color?: string
    className?: string
}

/**
 * Animated floating particles effect for premium backgrounds
 */
export function FloatingParticles({
    count = 25,
    color = 'bg-primary/30',
    className = ''
}: FloatingParticlesProps) {
    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            {[...Array(count)].map((_, i) => (
                <motion.div
                    key={i}
                    className={`absolute w-1 h-1 ${color} rounded-full`}
                    initial={{
                        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                        y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                    }}
                    animate={{
                        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                        y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                    }}
                    transition={{
                        duration: 12 + Math.random() * 15,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'linear',
                    }}
                />
            ))}
        </div>
    )
}
