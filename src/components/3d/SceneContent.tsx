import { useMemo } from 'react'
import { OrbitControls, Environment, Stars, Grid } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import CoordinatorHub from './CoordinatorHub'
import WorkerNode, { WORKER_POSITIONS } from './WorkerNode'
import { DataStreams } from './DataStream'
import { REGIONS, RegionId } from '@/lib/designTokens'
import type { SimulationPhase, RegionNode } from '@/types/traffic'

interface SceneContentProps {
    phase: string  // SimulationPhase
    isRunning: boolean
    regions: Record<RegionId, RegionNode>
    enablePostProcessing?: boolean
}

/**
 * SceneContent - Main 3D scene with all visual elements
 */
export function SceneContent({
    phase,
    isRunning,
    regions,
    enablePostProcessing = true,
}: SceneContentProps) {
    // Active regions for data streams
    const activeRegions = useMemo(() => {
        return REGIONS.map(r => r.id).filter(id => {
            const node = regions[id]
            return node && (node.status === 'processing' || node.status === 'success')
        })
    }, [regions])

    return (
        <>
            {/* Camera controls */}
            <OrbitControls
                makeDefault
                enablePan={false}
                enableZoom={true}
                enableRotate={true}
                minDistance={8}
                maxDistance={30}
                minPolarAngle={Math.PI / 6}
                maxPolarAngle={Math.PI / 2.2}
                dampingFactor={0.05}
                rotateSpeed={0.5}
            />

            {/* Lighting */}
            <ambientLight intensity={0.3} />
            <spotLight
                position={[10, 20, 10]}
                angle={0.5}
                penumbra={1}
                intensity={1}
                castShadow
                shadow-mapSize={[2048, 2048]}
            />
            <pointLight position={[-10, 10, -10]} intensity={0.5} color="#6366f1" />

            {/* Environment */}
            <Environment preset="city" />
            <Stars
                radius={100}
                depth={50}
                count={1000}
                factor={4}
                saturation={0}
                fade
                speed={0.5}
            />

            {/* Grid floor */}
            <Grid
                position={[0, -2, 0]}
                args={[30, 30]}
                cellSize={1}
                cellThickness={0.5}
                cellColor="#1e293b"
                sectionSize={5}
                sectionThickness={1}
                sectionColor="#334155"
                fadeDistance={40}
                fadeStrength={1}
                followCamera={false}
                infiniteGrid
            />

            {/* Central Coordinator */}
            <CoordinatorHub phase={phase} isRunning={isRunning} />

            {/* Worker Nodes */}
            {REGIONS.map(region => {
                const node = regions[region.id]
                return (
                    <WorkerNode
                        key={region.id}
                        regionId={region.id}
                        position={WORKER_POSITIONS[region.id]}
                        status={node?.status ?? 'idle'}
                        progress={node?.trafficLoad ?? 0}
                        trafficLoad={node?.trafficLoad ?? 0}
                    />
                )
            })}

            {/* Data Streams */}
            <DataStreams phase={phase} activeRegions={activeRegions} />

            {/* Post-processing effects */}
            {enablePostProcessing && (
                <EffectComposer>
                    <Bloom
                        luminanceThreshold={0.2}
                        luminanceSmoothing={0.9}
                        intensity={0.5}
                        mipmapBlur
                    />
                    <Vignette eskil={false} offset={0.1} darkness={0.5} />
                </EffectComposer>
            )}
        </>
    )
}

export default SceneContent
