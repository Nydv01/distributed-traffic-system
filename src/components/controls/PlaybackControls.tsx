import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    ChevronLeft,
    ChevronRight,
    Gauge,
    RotateCcw,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface PlaybackControlsProps {
    /** Current playback time in ms */
    currentTime: number
    /** Total duration in ms */
    totalDuration: number
    /** Whether playback is running */
    isPlaying: boolean
    /** Current playback speed multiplier */
    speed: number
    /** Callback when play/pause is toggled */
    onPlayPause: () => void
    /** Callback when seeking to specific time */
    onSeek: (time: number) => void
    /** Callback when speed changes */
    onSpeedChange: (speed: number) => void
    /** Callback when step forward is pressed */
    onStepForward?: () => void
    /** Callback when step backward is pressed */
    onStepBack?: () => void
    /** Callback when reset is pressed */
    onReset?: () => void
    /** Additional className */
    className?: string
}

const SPEED_OPTIONS = [0.5, 1, 2, 4]

/**
 * Premium playback controls with timeline scrubber
 * 
 * Features:
 * - Play/Pause with smooth animation
 * - Speed selector (0.5x - 4x)
 * - Timeline scrubber with progress visualization
 * - Step forward/backward
 * - Reset button
 */
export function PlaybackControls({
    currentTime,
    totalDuration,
    isPlaying,
    speed,
    onPlayPause,
    onSeek,
    onSpeedChange,
    onStepForward,
    onStepBack,
    onReset,
    className,
}: PlaybackControlsProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [showSpeedMenu, setShowSpeedMenu] = useState(false)
    const progressRef = useRef<HTMLDivElement>(null)

    const progress = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0

    // Format time as mm:ss.ms
    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000)
        const minutes = Math.floor(totalSeconds / 60)
        const seconds = totalSeconds % 60
        const milliseconds = Math.floor((ms % 1000) / 10)
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`
    }

    // Handle click on progress bar
    const handleProgressClick = useCallback((e: React.MouseEvent) => {
        if (!progressRef.current) return
        const rect = progressRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
        const newTime = (percentage / 100) * totalDuration
        onSeek(newTime)
    }, [totalDuration, onSeek])

    // Handle drag on progress bar
    const handleDrag = useCallback((e: MouseEvent | TouchEvent) => {
        if (!isDragging || !progressRef.current) return
        const rect = progressRef.current.getBoundingClientRect()
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
        const x = clientX - rect.left
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
        const newTime = (percentage / 100) * totalDuration
        onSeek(newTime)
    }, [isDragging, totalDuration, onSeek])

    useEffect(() => {
        if (isDragging) {
            const handleMove = (e: MouseEvent | TouchEvent) => handleDrag(e)
            const handleUp = () => setIsDragging(false)

            window.addEventListener('mousemove', handleMove)
            window.addEventListener('mouseup', handleUp)
            window.addEventListener('touchmove', handleMove)
            window.addEventListener('touchend', handleUp)

            return () => {
                window.removeEventListener('mousemove', handleMove)
                window.removeEventListener('mouseup', handleUp)
                window.removeEventListener('touchmove', handleMove)
                window.removeEventListener('touchend', handleUp)
            }
        }
    }, [isDragging, handleDrag])

    return (
        <div className={cn(
            'bg-gradient-to-b from-slate-900/95 to-slate-950/95 backdrop-blur-xl',
            'border border-white/10 rounded-2xl p-4 shadow-2xl shadow-black/50',
            className
        )}>
            {/* Timeline Scrubber */}
            <div className="mb-4">
                <div
                    ref={progressRef}
                    className="relative h-2 bg-white/10 rounded-full cursor-pointer group"
                    onClick={handleProgressClick}
                    onMouseDown={() => setIsDragging(true)}
                    onTouchStart={() => setIsDragging(true)}
                >
                    {/* Progress fill */}
                    <motion.div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-blue-400 rounded-full"
                        style={{ width: `${progress}%` }}
                        transition={{ duration: isDragging ? 0 : 0.1 }}
                    />

                    {/* Glow effect */}
                    <motion.div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary/50 to-blue-400/50 rounded-full blur-sm"
                        style={{ width: `${progress}%` }}
                        transition={{ duration: isDragging ? 0 : 0.1 }}
                    />

                    {/* Scrubber thumb */}
                    <motion.div
                        className={cn(
                            'absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full',
                            'shadow-lg shadow-primary/50 cursor-grab active:cursor-grabbing',
                            'opacity-0 group-hover:opacity-100 transition-opacity',
                            isDragging && 'opacity-100'
                        )}
                        style={{ left: `calc(${progress}% - 8px)` }}
                        transition={{ duration: isDragging ? 0 : 0.1 }}
                    />
                </div>

                {/* Time display */}
                <div className="flex justify-between mt-2 text-xs font-mono text-muted-foreground">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(totalDuration)}</span>
                </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
                {/* Left: Reset */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onReset}
                    className="text-muted-foreground hover:text-foreground"
                    title="Reset"
                >
                    <RotateCcw className="w-4 h-4" />
                </Button>

                {/* Center: Main Controls */}
                <div className="flex items-center gap-2">
                    {/* Step Back */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onStepBack}
                        className="text-muted-foreground hover:text-foreground"
                        title="Step Back"
                    >
                        <SkipBack className="w-5 h-5" />
                    </Button>

                    {/* Play/Pause */}
                    <motion.button
                        onClick={onPlayPause}
                        className={cn(
                            'w-12 h-12 rounded-full flex items-center justify-center',
                            'bg-gradient-to-br from-primary to-blue-600',
                            'shadow-lg shadow-primary/40 hover:shadow-primary/60',
                            'transition-shadow duration-200'
                        )}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title={isPlaying ? 'Pause' : 'Play'}
                    >
                        <AnimatePresence mode="wait">
                            {isPlaying ? (
                                <motion.div
                                    key="pause"
                                    initial={{ scale: 0, rotate: -90 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0, rotate: 90 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <Pause className="w-5 h-5 text-white" fill="white" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="play"
                                    initial={{ scale: 0, rotate: -90 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    exit={{ scale: 0, rotate: 90 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>

                    {/* Step Forward */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onStepForward}
                        className="text-muted-foreground hover:text-foreground"
                        title="Step Forward"
                    >
                        <SkipForward className="w-5 h-5" />
                    </Button>
                </div>

                {/* Right: Speed Selector */}
                <div className="relative">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                        className="gap-1 text-muted-foreground hover:text-foreground font-mono"
                        title="Playback Speed"
                    >
                        <Gauge className="w-4 h-4" />
                        <span>{speed}x</span>
                    </Button>

                    <AnimatePresence>
                        {showSpeedMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className={cn(
                                    'absolute bottom-full right-0 mb-2 p-1',
                                    'bg-slate-900 border border-white/10 rounded-xl shadow-xl',
                                    'flex flex-col gap-1'
                                )}
                            >
                                {SPEED_OPTIONS.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => {
                                            onSpeedChange(s)
                                            setShowSpeedMenu(false)
                                        }}
                                        className={cn(
                                            'px-4 py-2 rounded-lg font-mono text-sm',
                                            'transition-colors duration-150',
                                            s === speed
                                                ? 'bg-primary text-white'
                                                : 'hover:bg-white/10 text-muted-foreground hover:text-foreground'
                                        )}
                                    >
                                        {s}x
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}

export default PlaybackControls
