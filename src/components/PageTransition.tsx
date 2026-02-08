import { motion, Variants } from 'framer-motion'
import { ReactNode } from 'react'

const pageVariants: Variants = {
    initial: {
        opacity: 0,
        y: 20,
        scale: 0.98,
    },
    enter: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
            staggerChildren: 0.1,
        },
    },
    exit: {
        opacity: 0,
        y: -20,
        scale: 1.02,
        transition: {
            duration: 0.4,
            ease: [0.55, 0, 1, 0.45],
        },
    },
}

const slideVariants: Variants = {
    initial: {
        opacity: 0,
        x: 60,
    },
    enter: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
    exit: {
        opacity: 0,
        x: -60,
        transition: {
            duration: 0.3,
            ease: [0.55, 0, 1, 0.45],
        },
    },
}

const fadeUpVariants: Variants = {
    initial: {
        opacity: 0,
        y: 40,
    },
    enter: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.7,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.4,
            ease: [0.55, 0, 1, 0.45],
        },
    },
}

const cinematicVariants: Variants = {
    initial: {
        opacity: 0,
        scale: 1.1,
        filter: 'blur(10px)',
    },
    enter: {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        transition: {
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        filter: 'blur(5px)',
        transition: {
            duration: 0.5,
            ease: [0.55, 0, 1, 0.45],
        },
    },
}

export type TransitionType = 'default' | 'slide' | 'fadeUp' | 'cinematic'

interface PageTransitionProps {
    children: ReactNode
    type?: TransitionType
    className?: string
}

const variantMap: Record<TransitionType, Variants> = {
    default: pageVariants,
    slide: slideVariants,
    fadeUp: fadeUpVariants,
    cinematic: cinematicVariants,
}

export function PageTransition({
    children,
    type = 'default',
    className = ''
}: PageTransitionProps) {
    const variants = variantMap[type]

    return (
        <motion.div
            initial="initial"
            animate="enter"
            exit="exit"
            variants={variants}
            className={className}
            style={{ willChange: 'transform, opacity, filter' }}
        >
            {children}
        </motion.div>
    )
}

export function AnimatedElement({
    children,
    delay = 0,
    className = ''
}: {
    children: ReactNode
    delay?: number
    className?: string
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.5,
                delay,
                ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}
