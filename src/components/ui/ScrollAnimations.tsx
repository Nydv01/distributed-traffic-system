import React, { useRef } from 'react'
import {
    motion,
    useScroll,
    useTransform,
    useSpring,
    useVelocity,
    useAnimationFrame,
    useMotionValue,
    MotionValue
} from 'framer-motion'
import { cn } from '@/lib/utils'

/* -------------------------------------------------------------------------------------------------
 * 1. VELOCITY SCROLL SKEW
 * Skews content based on scroll speed. Adds momentum/weight feel.
 * -----------------------------------------------------------------------------------------------*/
interface VelocitySkewProps {
    children: React.ReactNode
    className?: string
    skewFactor?: number
}

export const VelocitySkew = ({ children, className, skewFactor = 5 }: VelocitySkewProps) => {
    const { scrollY } = useScroll()
    const scrollVelocity = useVelocity(scrollY)
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400
    })

    const skewX = useTransform(smoothVelocity, [-1000, 1000], [-skewFactor, skewFactor])

    return (
        <motion.div style={{ skewX }} className={className}>
            {children}
        </motion.div>
    )
}

/* -------------------------------------------------------------------------------------------------
 * 2. PARALLAX CONTAINER
 * Moves children at different speeds relative to scroll.
 * -----------------------------------------------------------------------------------------------*/
interface ParallaxProps {
    children: React.ReactNode
    offset?: number
    className?: string
    direction?: 'up' | 'down'
    style?: React.CSSProperties
}

export const Parallax = ({ children, offset = 50, className, direction = 'up', style }: ParallaxProps) => {
    const ref = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    })

    const yRange = direction === 'up' ? [offset, -offset] : [-offset, offset]
    const y = useTransform(scrollYProgress, [0, 1], yRange)

    return (
        <div ref={ref} className={cn("relative", className)} style={style}>
            <motion.div style={{ y }}>
                {children}
            </motion.div>
        </div>
    )
}

/* -------------------------------------------------------------------------------------------------
 * 3. 3D TILT CARD ON SCROLL
 * Tilts the card slightly towards viewer as it enters viewport.
 * -----------------------------------------------------------------------------------------------*/
interface ScrollTiltCardProps {
    children: React.ReactNode
    className?: string
    intensity?: number
}

export const ScrollTiltCard = ({ children, className, intensity = 15 }: ScrollTiltCardProps) => {
    const ref = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    })

    // Start tilted back, straighten out as it hits center, then tilt forward as it leaves
    const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [intensity, 0, -intensity])
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6])
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8])

    return (
        <motion.div
            ref={ref}
            style={{
                rotateX,
                opacity,
                scale,
                transformStyle: "preserve-3d",
                perspective: "1000px"
            }}
            className={cn("will-change-transform relative", className)}
        >
            {children}
        </motion.div>
    )
}

/* -------------------------------------------------------------------------------------------------
 * 4. PREMIUM TEXT REVEAL
 * Splits text into words/chars and reveals them with staggered spring physics.
 * -----------------------------------------------------------------------------------------------*/
interface TextRevealProps {
    text: string
    className?: string
    delay?: number
}

export const TextReveal = ({ text, className, delay = 0 }: TextRevealProps) => {
    const words = text.split(" ")

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.04 * i + delay },
        }),
    }

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            } as any,
        },
        hidden: {
            opacity: 0,
            y: 20,
            filter: "blur(10px)",
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            } as any,
        },
    }

    return (
        <motion.div
            className={cn("overflow-hidden flex flex-wrap", className)}
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
        >
            {words.map((word, index) => (
                <motion.span variants={child} key={index} className="mr-[0.25em] inline-block">
                    {word}
                </motion.span>
            ))}
        </motion.div>
    )
}

/* -------------------------------------------------------------------------------------------------
 * 5. STICKY CURTAIN REVEAL
 * Content stays sticky while the next section slides over it.
 * -----------------------------------------------------------------------------------------------*/
interface StickyScrollRevealProps {
    children: React.ReactNode
    className?: string
}

export const StickyScrollReveal = ({ children, className }: StickyScrollRevealProps) => {
    return (
        <div className={cn("relative z-10", className)}>
            {children}
        </div>
    )
}

/* -------------------------------------------------------------------------------------------------
 * 6. HERO ZOOM PARALLAX
 * Massive zoom through effect for the intro.
 * -----------------------------------------------------------------------------------------------*/
export const HeroZoom = ({ children }: { children: React.ReactNode }) => {
    const { scrollYProgress } = useScroll()
    const scale = useTransform(scrollYProgress, [0, 0.25], [1, 12])
    const opacity = useTransform(scrollYProgress, [0, 0.15, 0.25], [1, 1, 0])
    const filter = useTransform(scrollYProgress, [0, 0.25], ["blur(0px)", "blur(12px)"])

    return (
        <motion.div
            style={{ scale, opacity, filter, willChange: "transform, opacity, filter" }}
            className="w-full h-full flex items-center justify-center perspective-1000"
        >
            {children}
        </motion.div>
    )
}
