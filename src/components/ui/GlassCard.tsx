import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    intensity?: number;
    glowColor?: string;
    showShine?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
    children,
    className = '',
    intensity = 15,
    glowColor = 'rgba(255, 255, 255, 0.05)',
    showShine = true
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    // Higher stiffness for a more responsive 'Magnetic' feel
    const x = useSpring(0, { stiffness: 150, damping: 30 });
    const y = useSpring(0, { stiffness: 150, damping: 30 });

    const rotateX = useTransform(y, [-0.5, 0.5], [intensity * 0.8, -intensity * 0.8]);
    const rotateY = useTransform(x, [-0.5, 0.5], [-intensity * 0.8, intensity * 0.8]);

    // Wider range for specular reflection to catch more light
    const lightX = useTransform(x, [-0.5, 0.5], [5, 95]);
    const lightY = useTransform(y, [-0.5, 0.5], [5, 95]);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }, [x, y]);

    const onMouseLeave = () => {
        x.set(0);
        y.set(0);
        setIsHovered(false);
    };

    return (
        <motion.div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={onMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
                perspective: '1200px',
                willChange: 'transform',
            }}
            className={cn(
                "glass-hyper noise-subtle group relative transition-all duration-300",
                className
            )}
        >
            {/* 1. Ultra-HD Specular Shine (Dynamic) */}
            <motion.div
                className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[inherit] z-0 overflow-hidden"
                style={{
                    background: useTransform(
                        [lightX, lightY],
                        ([lx, ly]) => `radial-gradient(circle at ${lx}% ${ly}%, rgba(255,255,255,0.15), transparent 45%),
                                       radial-gradient(circle at ${100 - Number(lx)}% ${100 - Number(ly)}%, rgba(37,99,235,0.08), transparent 65%)`
                    )
                }}
            />

            {/* 2. Magnetic Primary Rim Light */}
            <div
                className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[inherit] z-0"
                style={{
                    background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, hsl(var(--primary) / 0.2), transparent 75%)`,
                }}
            />

            {/* 3. Reflection Trace (Kinetic) */}
            <div className="mask-shine pointer-events-none absolute inset-0 z-10 opacity-30 group-hover:opacity-60 transition-opacity duration-1000 scale-110 group-hover:scale-100 transition-transform" />

            {/* 4. Content Holder with high Z-elevation */}
            <div
                style={{
                    transform: 'translateZ(60px)',
                    transformStyle: 'preserve-3d',
                    willChange: 'transform'
                }}
                className="relative z-20 h-full w-full"
            >
                {children}
            </div>

            {/* Active Atmosphere Shadow */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-4/5 h-10 bg-primary/10 dark:bg-primary/15 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-1000" />
        </motion.div>
    );
};
