import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
    const [phase, setPhase] = useState<'logo' | 'text' | 'expand' | 'done'>('logo')

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase('text'), 800),
            setTimeout(() => setPhase('expand'), 2000),
            setTimeout(() => {
                setPhase('done')
                onComplete()
            }, 2800),
        ]
        return () => timers.forEach(clearTimeout)
    }, [onComplete])

    return (
        <AnimatePresence>
            {phase !== 'done' && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-background overflow-hidden"
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
                    }}
                >
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    />

                    <motion.div
                        className="absolute w-[800px] h-[800px] rounded-full"
                        style={{
                            background: 'radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)',
                        }}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{
                            scale: phase === 'expand' ? 3 : 1,
                            opacity: phase === 'expand' ? 0 : 0.8
                        }}
                        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
                    />

                    <div className="relative z-10 flex flex-col items-center">
                        <motion.div
                            className="relative"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{
                                scale: phase === 'expand' ? 1.5 : 1,
                                rotate: 0,
                                opacity: phase === 'expand' ? 0 : 1
                            }}
                            transition={{
                                type: 'spring',
                                stiffness: 200,
                                damping: 20,
                                delay: 0.2
                            }}
                        >
                            <motion.div
                                className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary via-primary to-blue-500 flex items-center justify-center shadow-2xl shadow-primary/30"
                                animate={{
                                    boxShadow: [
                                        '0 0 0 0 hsl(var(--primary) / 0.4)',
                                        '0 0 60px 20px hsl(var(--primary) / 0.2)',
                                        '0 0 0 0 hsl(var(--primary) / 0.4)',
                                    ],
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <motion.svg
                                    viewBox="0 0 24 24"
                                    className="w-12 h-12 text-primary-foreground"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1.5, ease: 'easeInOut' }}
                                >
                                    <motion.path d="M12 2L12 6" />
                                    <motion.path d="M12 18L12 22" />
                                    <motion.path d="M4.93 4.93L7.76 7.76" />
                                    <motion.path d="M16.24 16.24L19.07 19.07" />
                                    <motion.path d="M2 12L6 12" />
                                    <motion.path d="M18 12L22 12" />
                                    <motion.path d="M4.93 19.07L7.76 16.24" />
                                    <motion.path d="M16.24 7.76L19.07 4.93" />
                                    <motion.circle cx="12" cy="12" r="4" />
                                </motion.svg>
                            </motion.div>

                            <motion.div
                                className="absolute -inset-4 rounded-[32px] border-2 border-primary/30"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1.2, opacity: 0 }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                        </motion.div>

                        <AnimatePresence>
                            {(phase === 'text' || phase === 'expand') && (
                                <motion.div
                                    className="mt-8 text-center"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: phase === 'expand' ? 0 : 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <motion.h1
                                        className="text-3xl font-bold tracking-tight mb-2"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <span className="text-foreground">Distributed Traffic</span>
                                    </motion.h1>
                                    <motion.p
                                        className="text-muted-foreground"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        Analysis System
                                    </motion.p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.div
                            className="mt-8 flex gap-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: phase === 'expand' ? 0 : 1 }}
                        >
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className="w-2 h-2 rounded-full bg-primary"
                                    animate={{
                                        scale: [1, 1.3, 1],
                                        opacity: [0.5, 1, 0.5],
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        repeat: Infinity,
                                        delay: i * 0.15,
                                    }}
                                />
                            ))}
                        </motion.div>
                    </div>

                    <motion.div
                        className="absolute bottom-8 text-xs text-muted-foreground/50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                    >
                        Loading experience...
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
