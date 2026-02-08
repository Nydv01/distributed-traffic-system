import { useMemo } from 'react'
import { CubicBezierLine } from '@react-three/drei'
import * as THREE from 'three'
import { RegionId, REGION_MAP } from '@/lib/designTokens'
import { WORKER_POSITIONS } from './WorkerNode'

interface DataStreamProps {
    from: 'coordinator' | RegionId
    to: 'coordinator' | RegionId
    active: boolean
    color?: string
}

/**
 * DataStream - Animated line representing data flow between nodes
 * 
 * Uses curved bezier lines for smooth flow visualization
 */
export function DataStream({ from, to, active, color }: DataStreamProps) {
    // Calculate positions
    const fromPos = useMemo(() => {
        if (from === 'coordinator') return new THREE.Vector3(0, 0, 0)
        return new THREE.Vector3(...WORKER_POSITIONS[from])
    }, [from])

    const toPos = useMemo(() => {
        if (to === 'coordinator') return new THREE.Vector3(0, 0, 0)
        return new THREE.Vector3(...WORKER_POSITIONS[to])
    }, [to])

    // Control points for bezier curve
    const midPoint = useMemo(() => {
        const mid = fromPos.clone().add(toPos).multiplyScalar(0.5)
        mid.y += 3 // Arc height
        return mid
    }, [fromPos, toPos])

    // Determine color
    const lineColor = useMemo(() => {
        if (color) return color
        if (from !== 'coordinator' && from in REGION_MAP) {
            return REGION_MAP[from as RegionId].color
        }
        if (to !== 'coordinator' && to in REGION_MAP) {
            return REGION_MAP[to as RegionId].color
        }
        return '#6366f1'
    }, [from, to, color])

    if (!active) return null

    return (
        <CubicBezierLine
            start={[fromPos.x, fromPos.y, fromPos.z]}
            end={[toPos.x, toPos.y, toPos.z]}
            midA={[midPoint.x - 1, midPoint.y, midPoint.z]}
            midB={[midPoint.x + 1, midPoint.y, midPoint.z]}
            color={lineColor}
            lineWidth={2}
            opacity={0.7}
            transparent
        />
    )
}

/**
 * DataStreams - Container for all data flow connections
 */
interface DataStreamsProps {
    phase: string
    activeRegions: RegionId[]
}

export function DataStreams({ phase, activeRegions }: DataStreamsProps) {
    const showOutgoing = phase === 'request' || phase === 'processing'
    const showIncoming = phase === 'aggregating' || phase === 'optimizing'

    return (
        <group>
            {/* Outgoing streams (coordinator -> workers) */}
            {showOutgoing && activeRegions.map(region => (
                <DataStream
                    key={`out-${region}`}
                    from="coordinator"
                    to={region}
                    active
                />
            ))}

            {/* Incoming streams (workers -> coordinator) */}
            {showIncoming && activeRegions.map(region => (
                <DataStream
                    key={`in-${region}`}
                    from={region}
                    to="coordinator"
                    active
                />
            ))}
        </group>
    )
}

export default DataStream
