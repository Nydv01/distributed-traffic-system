import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Text, Billboard } from '@react-three/drei'
import * as THREE from 'three'

interface ComparisonArena3DProps {
    sequentialTime: number
    parallelTime: number
    speedup: number
    animate?: boolean
}

/**
 * ComparisonArena3D - 3D towers comparing sequential vs parallel performance
 * 
 * Features:
 * - Two animated towers rising
 * - Height proportional to execution time
 * - Speedup visualization as glowing connection
 */
export function ComparisonArena3D({
    sequentialTime,
    parallelTime,
    speedup,
    animate = true,
}: ComparisonArena3DProps) {
    const seqRef = useRef<THREE.Mesh>(null)
    const parRef = useRef<THREE.Mesh>(null)
    const speedupRef = useRef<THREE.Mesh>(null)

    // Calculate heights (normalized to max 10 units)
    const maxTime = Math.max(sequentialTime, parallelTime, 1)
    const seqHeight = (sequentialTime / maxTime) * 8 + 1
    const parHeight = (parallelTime / maxTime) * 8 + 1

    // Animation state
    const animProgress = useRef(0)

    useFrame((state, delta) => {
        if (!animate) return

        // Animate tower heights
        if (animProgress.current < 1) {
            animProgress.current = Math.min(animProgress.current + delta * 0.5, 1)
            const eased = easeOutElastic(animProgress.current)

            if (seqRef.current) {
                const targetHeight = seqHeight * eased
                seqRef.current.scale.y = targetHeight
                seqRef.current.position.y = targetHeight / 2 - 0.5
            }

            if (parRef.current) {
                const targetHeight = parHeight * eased
                parRef.current.scale.y = targetHeight
                parRef.current.position.y = targetHeight / 2 - 0.5
            }
        }

        // Pulse speedup indicator
        if (speedupRef.current) {
            const time = state.clock.elapsedTime
            const pulse = Math.sin(time * 2) * 0.1 + 1
            speedupRef.current.scale.setScalar(pulse)
        }
    })

    return (
        <group position={[0, 0, 0]}>
            {/* Sequential Tower (Red) */}
            <group position={[-3, 0, 0]}>
                <RoundedBox
                    ref={seqRef}
                    args={[2, 1, 2]}
                    radius={0.1}
                    smoothness={4}
                    castShadow
                >
                    <meshStandardMaterial
                        color="#ef4444"
                        emissive="#ef4444"
                        emissiveIntensity={0.3}
                        roughness={0.3}
                        metalness={0.7}
                    />
                </RoundedBox>

                {/* Label */}
                <Billboard position={[0, seqHeight + 1, 0]}>
                    <Text fontSize={0.4} color="#ef4444" anchorX="center">
                        Sequential
                    </Text>
                    <Text
                        fontSize={0.6}
                        color="white"
                        anchorX="center"
                        position={[0, -0.6, 0]}
                    >
                        {sequentialTime}ms
                    </Text>
                </Billboard>

                {/* Base glow */}
                <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <circleGeometry args={[1.5, 32]} />
                    <meshBasicMaterial color="#ef4444" transparent opacity={0.3} />
                </mesh>
            </group>

            {/* Parallel Tower (Green) */}
            <group position={[3, 0, 0]}>
                <RoundedBox
                    ref={parRef}
                    args={[2, 1, 2]}
                    radius={0.1}
                    smoothness={4}
                    castShadow
                >
                    <meshStandardMaterial
                        color="#22c55e"
                        emissive="#22c55e"
                        emissiveIntensity={0.5}
                        roughness={0.3}
                        metalness={0.7}
                    />
                </RoundedBox>

                {/* Label */}
                <Billboard position={[0, parHeight + 1, 0]}>
                    <Text fontSize={0.4} color="#22c55e" anchorX="center">
                        Parallel
                    </Text>
                    <Text
                        fontSize={0.6}
                        color="white"
                        anchorX="center"
                        position={[0, -0.6, 0]}
                    >
                        {parallelTime}ms
                    </Text>
                </Billboard>

                {/* Base glow */}
                <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <circleGeometry args={[1.5, 32]} />
                    <meshBasicMaterial color="#22c55e" transparent opacity={0.3} />
                </mesh>
            </group>

            {/* Speedup Indicator (Center) */}
            <group position={[0, Math.max(seqHeight, parHeight) + 2, 0]}>
                <mesh ref={speedupRef}>
                    <sphereGeometry args={[0.8, 32, 32]} />
                    <meshStandardMaterial
                        color="#f59e0b"
                        emissive="#f59e0b"
                        emissiveIntensity={0.8}
                        roughness={0.2}
                        metalness={0.8}
                    />
                </mesh>

                <Billboard position={[0, 1.5, 0]}>
                    <Text
                        fontSize={0.8}
                        color="#f59e0b"
                        anchorX="center"
                        fontWeight="bold"
                    >
                        {speedup.toFixed(1)}x
                    </Text>
                    <Text
                        fontSize={0.3}
                        color="#94a3b8"
                        anchorX="center"
                        position={[0, -0.6, 0]}
                    >
                        SPEEDUP
                    </Text>
                </Billboard>

                {/* Rays */}
                {[0, 60, 120, 180, 240, 300].map((angle) => (
                    <mesh
                        key={angle}
                        position={[
                            Math.cos((angle * Math.PI) / 180) * 1.5,
                            0,
                            Math.sin((angle * Math.PI) / 180) * 1.5,
                        ]}
                        rotation={[0, 0, 0]}
                    >
                        <boxGeometry args={[0.1, 0.05, 0.8]} />
                        <meshBasicMaterial color="#f59e0b" transparent opacity={0.6} />
                    </mesh>
                ))}
            </group>

            {/* Floor grid pattern */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
                <planeGeometry args={[16, 16]} />
                <meshStandardMaterial
                    color="#1e293b"
                    transparent
                    opacity={0.5}
                />
            </mesh>
        </group>
    )
}

// Easing function for bouncy animation
function easeOutElastic(x: number): number {
    const c4 = (2 * Math.PI) / 3
    return x === 0
        ? 0
        : x === 1
            ? 1
            : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1
}

export default ComparisonArena3D
