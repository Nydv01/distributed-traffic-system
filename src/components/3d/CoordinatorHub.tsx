import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

interface CoordinatorHubProps {
    phase: string  // SimulationPhase - using string for flexibility
    isRunning: boolean
}

/**
 * CoordinatorHub - Central glowing node representing the master coordinator
 * 
 * Visual behaviors:
 * - Idle: Gentle pulse, blue glow
 * - Processing: Strong pulse, purple glow
 * - Complete: Static, green glow
 */
export function CoordinatorHub({ phase, isRunning }: CoordinatorHubProps) {
    const meshRef = useRef<THREE.Mesh>(null)
    const glowRef = useRef<THREE.Mesh>(null)

    // Phase-based colors
    const colors = useMemo(() => ({
        idle: new THREE.Color('#3b82f6'),      // blue
        request: new THREE.Color('#8b5cf6'),   // purple
        processing: new THREE.Color('#f59e0b'), // amber
        aggregating: new THREE.Color('#6366f1'), // indigo
        optimizing: new THREE.Color('#14b8a6'),  // teal
        complete: new THREE.Color('#22c55e'),   // green
    }), [])

    const currentColor = colors[phase] || colors.idle

    // Animation loop
    useFrame((state) => {
        if (!meshRef.current || !glowRef.current) return

        const time = state.clock.elapsedTime

        // Rotation
        meshRef.current.rotation.y = time * 0.3

        // Pulse scale based on phase
        const pulseIntensity = phase === 'processing' ? 0.15 : 0.08
        const pulseSpeed = phase === 'processing' ? 3 : 1.5
        const scale = 1 + Math.sin(time * pulseSpeed) * pulseIntensity
        meshRef.current.scale.setScalar(scale)

        // Glow pulse
        if (glowRef.current.material instanceof THREE.MeshBasicMaterial) {
            const glowOpacity = 0.3 + Math.sin(time * 2) * 0.15
            glowRef.current.material.opacity = isRunning ? glowOpacity : 0.2
        }
        glowRef.current.scale.setScalar(scale * 1.8)
    })

    return (
        <group position={[0, 0, 0]}>
            {/* Outer glow sphere */}
            <mesh ref={glowRef}>
                <sphereGeometry args={[1.5, 32, 32]} />
                <meshBasicMaterial
                    color={currentColor}
                    transparent
                    opacity={0.25}
                    side={THREE.BackSide}
                />
            </mesh>

            {/* Main coordinator sphere */}
            <Sphere ref={meshRef} args={[1, 64, 64]}>
                <MeshDistortMaterial
                    color={currentColor}
                    emissive={currentColor}
                    emissiveIntensity={isRunning ? 0.8 : 0.3}
                    roughness={0.2}
                    metalness={0.8}
                    distort={isRunning ? 0.3 : 0.1}
                    speed={2}
                />
            </Sphere>

            {/* Inner core light */}
            <pointLight
                color={currentColor}
                intensity={isRunning ? 3 : 1}
                distance={10}
                decay={2}
            />
        </group>
    )
}

export default CoordinatorHub
