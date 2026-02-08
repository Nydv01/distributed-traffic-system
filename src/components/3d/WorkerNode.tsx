import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Text, Billboard } from '@react-three/drei'
import * as THREE from 'three'
import { REGION_MAP, RegionId, RegionConfig } from '@/lib/designTokens'

interface WorkerNodeProps {
    regionId: RegionId
    position: [number, number, number]
    status: 'idle' | 'processing' | 'success' | 'failed'
    progress: number
    trafficLoad: number
}

// Calculate orbital positions for 6 nodes
export const WORKER_POSITIONS: Record<RegionId, [number, number, number]> = {
    north_india: [0, 0, -6],     // Front
    south_india: [0, 0, 6],      // Back
    east_india: [5.2, 0, 3],     // Right-back
    west_india: [-5.2, 0, 3],    // Left-back
    central_india: [5.2, 0, -3], // Right-front
    northeast_india: [-5.2, 0, -3], // Left-front
}

/**
 * WorkerNode - 3D representation of a region worker
 * 
 * Visual behaviors:
 * - Idle: Dim, small scale
 * - Processing: Pulsing, bright emission
 * - Success: Green glow, full scale
 * - Failed: Red, flickering
 */
export function WorkerNode({
    regionId,
    position,
    status,
    progress,
    trafficLoad,
}: WorkerNodeProps) {
    const meshRef = useRef<THREE.Mesh>(null)
    const glowRef = useRef<THREE.Mesh>(null)
    const config: RegionConfig = REGION_MAP[regionId]

    // Status-based colors
    const statusColors = useMemo(() => ({
        idle: new THREE.Color(config.color).multiplyScalar(0.5),
        processing: new THREE.Color(config.color),
        success: new THREE.Color('#22c55e'),
        failed: new THREE.Color('#ef4444'),
    }), [config.color])

    const currentColor = statusColors[status]

    // Animation
    useFrame((state) => {
        if (!meshRef.current) return

        const time = state.clock.elapsedTime

        // Base Y position with slight hover
        const hoverY = Math.sin(time * 1.5 + position[0]) * 0.1
        meshRef.current.position.y = position[1] + hoverY

        // Scale based on progress and status
        let targetScale = 0.8
        if (status === 'processing') {
            targetScale = 0.8 + (progress / 100) * 0.4
            // Add pulse
            targetScale += Math.sin(time * 4) * 0.05
        } else if (status === 'success') {
            targetScale = 1.2
        } else if (status === 'failed') {
            targetScale = 0.7
            // Flicker effect
            if (Math.sin(time * 20) > 0.8) targetScale *= 0.9
        }

        // Smooth scale transition
        meshRef.current.scale.lerp(
            new THREE.Vector3(targetScale, targetScale, targetScale),
            0.1
        )

        // Rotation
        meshRef.current.rotation.y = time * 0.2

        // Glow opacity
        if (glowRef.current && glowRef.current.material instanceof THREE.MeshBasicMaterial) {
            const glowOpacity = status === 'processing'
                ? 0.4 + Math.sin(time * 3) * 0.2
                : status === 'success' ? 0.5 : 0.15
            glowRef.current.material.opacity = glowOpacity
        }
    })

    return (
        <group position={position}>
            {/* Outer glow */}
            <mesh ref={glowRef} scale={[1.8, 1.8, 1.8]}>
                <sphereGeometry args={[0.8, 16, 16]} />
                <meshBasicMaterial
                    color={currentColor}
                    transparent
                    opacity={0.2}
                    side={THREE.BackSide}
                />
            </mesh>

            {/* Main node box */}
            <RoundedBox
                ref={meshRef}
                args={[1.2, 1.2, 1.2]}
                radius={0.15}
                smoothness={4}
                castShadow
                receiveShadow
            >
                <meshStandardMaterial
                    color={currentColor}
                    emissive={currentColor}
                    emissiveIntensity={status === 'processing' ? 0.6 : 0.2}
                    roughness={0.3}
                    metalness={0.7}
                />
            </RoundedBox>

            {/* Emoji label */}
            <Billboard position={[0, 1.5, 0]}>
                <Text
                    fontSize={0.5}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                >
                    {config.emoji}
                </Text>
            </Billboard>

            {/* Region name */}
            <Billboard position={[0, -1.2, 0]}>
                <Text
                    fontSize={0.25}
                    color="#94a3b8"
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={2}
                >
                    {config.shortName}
                </Text>
            </Billboard>

            {/* Progress ring (when processing) */}
            {status === 'processing' && (
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.7, 0]}>
                    <ringGeometry args={[0.9, 1.1, 32, 1, 0, (progress / 100) * Math.PI * 2]} />
                    <meshBasicMaterial color={currentColor} side={THREE.DoubleSide} />
                </mesh>
            )}

            {/* Point light */}
            <pointLight
                color={currentColor}
                intensity={status === 'processing' ? 2 : 0.5}
                distance={5}
                decay={2}
            />
        </group>
    )
}

export default WorkerNode
