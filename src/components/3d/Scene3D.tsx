import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei'

interface Scene3DProps {
    children: React.ReactNode
    className?: string
    cameraPosition?: [number, number, number]
    enablePostProcessing?: boolean
}

/**
 * Scene3D - Main 3D Canvas Container
 * 
 * Provides the React Three Fiber canvas with:
 * - Suspense boundary for async loading
 * - Adaptive DPR for performance
 * - Preloading of assets
 * - Configurable camera position
 */
export function Scene3D({
    children,
    className = '',
    cameraPosition = [0, 8, 15],
    enablePostProcessing = true,
}: Scene3DProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    return (
        <div className={`relative w-full h-full ${className}`}>
            <Canvas
                ref={canvasRef}
                shadows
                dpr={[1, 2]}
                camera={{
                    position: cameraPosition,
                    fov: 45,
                    near: 0.1,
                    far: 1000,
                }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance',
                }}
                style={{ background: 'transparent' }}
            >
                <Suspense fallback={<LoadingFallback />}>
                    {children}
                    <Preload all />
                </Suspense>

                {/* Adaptive optimizations */}
                <AdaptiveDpr pixelated />
                <AdaptiveEvents />
            </Canvas>
        </div>
    )
}

/**
 * Loading fallback - simple spinner in 3D space
 */
function LoadingFallback() {
    return (
        <mesh>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshBasicMaterial color="#6366f1" wireframe />
        </mesh>
    )
}

export default Scene3D
