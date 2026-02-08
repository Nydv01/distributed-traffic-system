import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Hook to detect if user is actively scrolling
 * 
 * Returns true when user is scrolling, false after a delay
 * Use this to prevent auto-navigation while user is interacting
 */
export function useScrollGuard(delay: number = 1000) {
    const [isUserScrolling, setIsUserScrolling] = useState(false)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const lastScrollY = useRef(0)

    const handleScroll = useCallback(() => {
        const currentScrollY = window.scrollY
        const scrollDelta = Math.abs(currentScrollY - lastScrollY.current)

        // Only trigger if there's meaningful scroll movement
        if (scrollDelta > 5) {
            setIsUserScrolling(true)
            lastScrollY.current = currentScrollY

            // Clear existing timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }

            // Set new timeout to reset scrolling state
            timeoutRef.current = setTimeout(() => {
                setIsUserScrolling(false)
            }, delay)
        }
    }, [delay])

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true })
        window.addEventListener('wheel', handleScroll, { passive: true })
        window.addEventListener('touchmove', handleScroll, { passive: true })

        return () => {
            window.removeEventListener('scroll', handleScroll)
            window.removeEventListener('wheel', handleScroll)
            window.removeEventListener('touchmove', handleScroll)

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [handleScroll])

    return isUserScrolling
}

/**
 * Hook for playback state management
 * 
 * Manages:
 * - Play/pause state
 * - Playback speed
 * - Current time tracking
 * - Timeline seeking
 */
export function usePlaybackState(totalDuration: number = 10000) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [speed, setSpeed] = useState(1)
    const [currentTime, setCurrentTime] = useState(0)
    const animationRef = useRef<number | null>(null)
    const lastTickRef = useRef<number>(Date.now())

    // Animation loop
    useEffect(() => {
        if (!isPlaying) {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
            return
        }

        const tick = () => {
            const now = Date.now()
            const delta = (now - lastTickRef.current) * speed
            lastTickRef.current = now

            setCurrentTime((prev) => {
                const next = prev + delta
                if (next >= totalDuration) {
                    setIsPlaying(false)
                    return totalDuration
                }
                return next
            })

            animationRef.current = requestAnimationFrame(tick)
        }

        lastTickRef.current = Date.now()
        animationRef.current = requestAnimationFrame(tick)

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [isPlaying, speed, totalDuration])

    const togglePlayPause = useCallback(() => {
        if (currentTime >= totalDuration) {
            setCurrentTime(0)
        }
        setIsPlaying((prev) => !prev)
    }, [currentTime, totalDuration])

    const seek = useCallback((time: number) => {
        setCurrentTime(Math.max(0, Math.min(totalDuration, time)))
    }, [totalDuration])

    const stepForward = useCallback(() => {
        seek(currentTime + 500)
    }, [currentTime, seek])

    const stepBack = useCallback(() => {
        seek(currentTime - 500)
    }, [currentTime, seek])

    const reset = useCallback(() => {
        setCurrentTime(0)
        setIsPlaying(false)
    }, [])

    return {
        isPlaying,
        speed,
        currentTime,
        totalDuration,
        setSpeed,
        togglePlayPause,
        seek,
        stepForward,
        stepBack,
        reset,
    }
}

export default useScrollGuard
