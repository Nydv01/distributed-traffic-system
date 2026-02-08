// @ts-ignore
import { ReactLenis } from 'lenis/react'
import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

export const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
    const lenisRef = useRef(null)
    const { pathname } = useLocation()

    useEffect(() => {
        // Reset scroll on route change
        window.scrollTo(0, 0)

        // Optional: if you want to force lenis to reset
        // if (lenisRef.current?.lenis) {
        //   lenisRef.current.lenis.scrollTo(0, { immediate: true })
        // }
    }, [pathname])

    return (
        <ReactLenis root options={{ lerp: 0.08, duration: 1.5, smoothWheel: true }}>
            {children}
        </ReactLenis>
    )
}
