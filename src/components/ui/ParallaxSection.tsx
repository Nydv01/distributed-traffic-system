import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface ParallaxSectionProps {
    children: React.ReactNode;
    offset?: number;
    className?: string;
}

export const ParallaxSection: React.FC<ParallaxSectionProps> = ({
    children,
    offset = 50,
    className = ""
}) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const yValue = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
    const y = useSpring(yValue, { stiffness: 100, damping: 30 });

    return (
        <motion.div ref={ref} style={{ y }} className={`relative ${className}`}>
            {children}
        </motion.div>
    );
};
