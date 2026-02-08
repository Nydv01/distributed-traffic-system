import { useRef, useMemo, useState, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Float, Text, Line, Html } from '@react-three/drei'
import * as THREE from 'three'
import { REGION_MAP, RegionId } from '@/lib/designTokens'
import { INDIA_STATES, STATES_BY_ID } from '@/lib/indiaStates'
import { useTrafficStore } from '@/stores/trafficStore'
import { Zap, Globe, MousePointer2, Flag, LocateFixed, MoveRight, RotateCcw, Play } from 'lucide-react'
import { SelectionStage } from '@/types/traffic'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

/* =========================================================
   TYPES & CONSTANTS
 ========================================================= */

interface NodePoint {
    id: string
    position: [number, number, number]
    color: string
    name: string
    zone: string
}

// Improved coordinate mapping for India
const mapCoords = (lat: number, lng: number): [number, number, number] => {
    // Normalizing India bounds: Lng [68, 98], Lat [8, 38]
    const x = (lng - 82.5) * 0.55
    const z = (22.5 - lat) * 0.65
    return [x, 0.1, z]
}

/* =========================================================
   INDIA MAP OUTLINE - Simplified polygon outline
 ========================================================= */

// Simplified India outline points (major boundary points)
const INDIA_OUTLINE: [number, number][] = [
    // Starting from Gujarat coast, going clockwise
    [68.5, 23.5], // Gujarat coast
    [70.0, 20.5], // Gujarat south
    [72.5, 18.5], // Maharashtra coast
    [73.0, 15.5], // Goa
    [74.5, 13.0], // Karnataka coast
    [76.5, 8.5],  // Kerala tip
    [77.5, 8.2],  // Kanyakumari
    [79.5, 9.5],  // Tamil Nadu coast
    [80.0, 13.0], // Chennai area
    [82.5, 16.5], // Andhra coast
    [85.0, 20.0], // Odisha coast
    [88.0, 21.5], // West Bengal coast
    [88.5, 22.5], // Kolkata area
    [89.5, 26.5], // Bangladesh border
    [92.0, 26.0], // NE states
    [95.0, 27.5], // Arunachal
    [96.0, 28.5], // NE tip
    [94.0, 26.0], // Return through NE
    [90.0, 26.5], // Assam
    [88.0, 27.0], // Sikkim
    [88.5, 28.0], // Nepal border
    [84.5, 27.0], // Bihar/Nepal
    [80.5, 27.5], // UP/Nepal
    [80.0, 29.5], // Uttarakhand
    [78.0, 31.0], // Himachal
    [76.0, 32.5], // J&K
    [74.5, 34.0], // Kashmir tip
    [73.5, 35.5], // Ladakh north
    [77.0, 35.0], // Ladakh
    [78.5, 33.0], // Return
    [76.0, 31.0], // Punjab
    [74.0, 30.0], // Punjab/Rajasthan
    [71.0, 24.5], // Rajasthan
    [68.5, 23.5], // Back to Gujarat
]

function IndiaOutline({ theme }: { theme: string }) {
    const points = useMemo(() => {
        return INDIA_OUTLINE.map(([lng, lat]) => {
            const pos = mapCoords(lat, lng)
            return new THREE.Vector3(pos[0], 0.05, pos[2])
        })
    }, [])

    return (
        <Line
            points={points}
            color={theme === 'dark' ? '#4b5563' : '#9ca3af'}
            lineWidth={2}
            opacity={0.8}
        />
    )
}

/* =========================================================
   INDIA GRID - Dot pattern inside outline
 ========================================================= */

function IndiaGrid({ theme }: { theme: string }) {
    const points = useMemo(() => {
        const p: THREE.Vector3[] = []
        // Grid within approximate India bounds
        for (let lng = 70; lng < 95; lng += 1.5) {
            for (let lat = 8; lat < 35; lat += 1.5) {
                // Simple boundary check
                const isInBounds = (
                    lng > 68 && lng < 97 &&
                    lat > 6 && lat < 36 &&
                    !(lng < 74 && lat < 18) && // Exclude Arabian Sea
                    !(lng > 90 && lat < 16)    // Exclude Bay of Bengal
                )

                if (isInBounds) {
                    const pos = mapCoords(lat, lng)
                    p.push(new THREE.Vector3(pos[0], 0.02, pos[2]))
                }
            }
        }
        return p
    }, [])

    return (
        <points>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={points.length}
                    array={new Float32Array(points.flatMap(v => [v.x, v.y, v.z]))}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.08}
                color={theme === 'dark' ? '#3b82f6' : '#60a5fa'}
                transparent
                opacity={0.4}
                sizeAttenuation
            />
        </points>
    )
}

/* =========================================================
   ROUTE PATH - Animated flowing trail between states
 ========================================================= */

function RoutePath({ route, theme }: { route: string[], theme: string }) {
    const curves = useMemo(() => {
        const c: { curve: THREE.QuadraticBezierCurve3, from: string, to: string }[] = []
        for (let i = 0; i < route.length - 1; i++) {
            const startNode = STATES_BY_ID[route[i]]
            const endNode = STATES_BY_ID[route[i + 1]]
            if (!startNode || !endNode) continue

            const start = new THREE.Vector3(...mapCoords(startNode.coordinates.lat, startNode.coordinates.lng))
            const end = new THREE.Vector3(...mapCoords(endNode.coordinates.lat, endNode.coordinates.lng))

            start.y = 0.15
            end.y = 0.15

            const mid = new THREE.Vector3().lerpVectors(start, end, 0.5)
            mid.y = Math.max(0.8, start.distanceTo(end) * 0.35)

            c.push({
                curve: new THREE.QuadraticBezierCurve3(start, mid, end),
                from: route[i],
                to: route[i + 1]
            })
        }
        return c
    }, [route])

    // Animated flow progress for each segment
    const flowProgress = useRef(curves.map(() => 0))
    const trailHeadRefs = useRef<THREE.Mesh[]>([])
    const trailRefs = useRef<any[]>([])

    useFrame((state, delta) => {
        const baseSpeed = 0.4 // Speed of flow

        curves.forEach((c, idx) => {
            // Each segment starts flowing after the previous one reaches ~30%
            const startDelay = idx * 0.25
            const elapsed = state.clock.elapsedTime - startDelay

            if (elapsed > 0) {
                // Continuous looping animation
                flowProgress.current[idx] = (elapsed * baseSpeed) % 1.3
            }

            // Update trail head position
            if (trailHeadRefs.current[idx]) {
                const progress = Math.min(flowProgress.current[idx], 1)
                const pos = new THREE.Vector3()
                c.curve.getPoint(progress, pos)
                trailHeadRefs.current[idx].position.copy(pos)

                // Pulsing glow
                const scale = 0.12 + Math.sin(state.clock.elapsedTime * 8) * 0.03
                trailHeadRefs.current[idx].scale.setScalar(scale)
            }
        })
    })

    return (
        <group>
            {curves.map((c, idx) => {
                const points = c.curve.getPoints(80)
                return (
                    <group key={idx}>
                        {/* Base glow line - always visible */}
                        <Line
                            points={points}
                            color={theme === 'dark' ? '#1e3a5f' : '#bfdbfe'}
                            lineWidth={8}
                            transparent
                            opacity={0.2}
                        />

                        {/* Animated flowing trail */}
                        <AnimatedFlowingTrail
                            curve={c.curve}
                            index={idx}
                            totalSegments={curves.length}
                        />

                        {/* Trail head - glowing sphere that moves along curve */}
                        <mesh ref={el => { if (el) trailHeadRefs.current[idx] = el }}>
                            <sphereGeometry args={[0.15, 16, 16]} />
                            <meshBasicMaterial color="#fbbf24" transparent opacity={0.9} />
                        </mesh>

                        {/* Trail head outer glow */}
                        <mesh ref={el => { if (el) trailHeadRefs.current[idx] = el }}>
                            <sphereGeometry args={[0.25, 12, 12]} />
                            <meshBasicMaterial color="#fbbf24" transparent opacity={0.3} />
                        </mesh>
                    </group>
                )
            })}
        </group>
    )
}

/* Animated flowing trail segment */
function AnimatedFlowingTrail({
    curve,
    index,
    totalSegments
}: {
    curve: THREE.QuadraticBezierCurve3
    index: number
    totalSegments: number
}) {
    const trailRef = useRef<THREE.Line>(null!)
    const basePoints = useMemo(() => curve.getPoints(100), [curve])

    useFrame((state) => {
        if (!trailRef.current) return

        // Staggered start for each segment
        const staggerDelay = index * 0.4
        const elapsed = state.clock.elapsedTime - staggerDelay

        if (elapsed < 0) return

        // Continuous flowing animation
        const cycleTime = 2.5 // seconds per full cycle
        const cycle = (elapsed / cycleTime) % 1

        // Trail has a head and a tail that move together
        const headProgress = cycle
        const tailProgress = Math.max(0, cycle - 0.35) // Trail length

        // Generate visible portion of trail
        const startIdx = Math.floor(tailProgress * 100)
        const endIdx = Math.floor(headProgress * 100)

        if (endIdx > startIdx && trailRef.current.geometry) {
            const visiblePoints = basePoints.slice(startIdx, endIdx + 1)
            if (visiblePoints.length > 1) {
                const positions = new Float32Array(visiblePoints.flatMap(p => [p.x, p.y, p.z]))
                trailRef.current.geometry.setAttribute(
                    'position',
                    new THREE.BufferAttribute(positions, 3)
                )
                trailRef.current.geometry.attributes.position.needsUpdate = true
            }
        }
    })

    return (
        <>
            {/* Main flowing trail - using Line from drei */}
            <FlowingLine
                curve={curve}
                index={index}
            />

            {/* Outer glow for trail */}
            <Line
                points={basePoints}
                color="#fbbf24"
                lineWidth={6}
                transparent
                opacity={0.15}
            />
        </>
    )
}

/* Flowing line that updates its geometry each frame */
function FlowingLine({ curve, index }: { curve: THREE.QuadraticBezierCurve3, index: number }) {
    const [visiblePoints, setVisiblePoints] = useState<THREE.Vector3[]>([])
    const basePoints = useMemo(() => curve.getPoints(100), [curve])

    useFrame((state) => {
        // Staggered start for each segment
        const staggerDelay = index * 0.5
        const elapsed = state.clock.elapsedTime - staggerDelay

        if (elapsed < 0) {
            setVisiblePoints([])
            return
        }

        // Continuous flowing animation
        const cycleTime = 2.0 // seconds per full cycle
        const cycle = (elapsed / cycleTime) % 1

        // Trail has a head and a tail that move together
        const headProgress = cycle
        const tailProgress = Math.max(0, cycle - 0.4) // Trail length

        // Generate visible portion of trail
        const startIdx = Math.floor(tailProgress * 100)
        const endIdx = Math.floor(headProgress * 100)

        if (endIdx > startIdx) {
            const points = basePoints.slice(startIdx, endIdx + 1)
            if (points.length > 1) {
                setVisiblePoints(points)
            }
        } else if (cycle < 0.1) {
            setVisiblePoints([])
        }
    })

    if (visiblePoints.length < 2) return null

    return (
        <Line
            points={visiblePoints}
            color="#fbbf24"
            lineWidth={4}
            transparent
            opacity={0.95}
        />
    )
}

/* =========================================================
   TRAFFIC PARTICLES - Flowing along routes
 ========================================================= */

function TrafficParticles({ route, nodePoints }: { route: string[], nodePoints: NodePoint[] }) {
    const meshRef = useRef<THREE.InstancedMesh>(null!)
    const dummy = useMemo(() => new THREE.Object3D(), [])
    const count = 100

    const routeCurves = useMemo(() => {
        if (!route.length) return []
        const curves: THREE.QuadraticBezierCurve3[] = []
        for (let i = 0; i < route.length - 1; i++) {
            const start = nodePoints.find(n => n.id === route[i])
            const end = nodePoints.find(n => n.id === route[i + 1])
            if (!start || !end) continue

            const startV = new THREE.Vector3(...start.position)
            const endV = new THREE.Vector3(...end.position)
            startV.y = 0.15
            endV.y = 0.15
            const mid = new THREE.Vector3().lerpVectors(startV, endV, 0.5)
            mid.y = Math.max(0.8, startV.distanceTo(endV) * 0.35)
            curves.push(new THREE.QuadraticBezierCurve3(startV, mid, endV))
        }
        return curves
    }, [route, nodePoints])

    const particles = useMemo(() => {
        return Array.from({ length: count }, () => ({
            curve: routeCurves[Math.floor(Math.random() * routeCurves.length)],
            progress: Math.random(),
            speed: 0.003 + Math.random() * 0.005,
        }))
    }, [routeCurves])

    useFrame(() => {
        if (!meshRef.current || routeCurves.length === 0) return

        particles.forEach((p, i) => {
            p.progress += p.speed
            if (p.progress >= 1) p.progress = 0

            if (p.curve) {
                const pos = new THREE.Vector3()
                p.curve.getPoint(p.progress, pos)
                dummy.position.copy(pos)
                dummy.scale.setScalar(0.05 * (1 - Math.abs(0.5 - p.progress) * 1.5))
                dummy.updateMatrix()
                meshRef.current.setMatrixAt(i, dummy.matrix)
            }
        })
        meshRef.current.instanceMatrix.needsUpdate = true
    })

    if (routeCurves.length === 0) return null

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshBasicMaterial color="#fbbf24" transparent opacity={0.8} />
        </instancedMesh>
    )
}

/* =========================================================
   STATE NODE - Interactive city markers
 ========================================================= */

function StateNode({
    node,
    isSource,
    isDestination,
    isPartOfRoute,
    isActive,
    theme,
    onClick
}: {
    node: NodePoint
    isSource: boolean
    isDestination: boolean
    isPartOfRoute: boolean
    isActive: boolean
    theme: string
    onClick: () => void
}) {
    const [hovered, setHovered] = useState(false)
    const meshRef = useRef<THREE.Mesh>(null!)

    useFrame((state) => {
        if (meshRef.current) {
            // Subtle floating animation
            meshRef.current.position.y = 0.15 + Math.sin(state.clock.elapsedTime * 2 + node.position[0]) * 0.03

            // Pulse for active nodes
            if (isActive || isSource || isDestination || isPartOfRoute) {
                const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.1
                meshRef.current.scale.setScalar(scale)
            }
        }
    })

    const getColor = () => {
        if (isSource) return '#22c55e' // Green for source
        if (isDestination) return '#ef4444' // Red for destination
        if (isPartOfRoute) return '#fbbf24' // Amber for route
        return node.color
    }

    const size = isSource || isDestination ? 0.22 : isPartOfRoute ? 0.18 : 0.12

    return (
        <group position={node.position as [number, number, number]}>
            <mesh
                ref={meshRef}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                onClick={(e) => { e.stopPropagation(); onClick() }}
            >
                <sphereGeometry args={[size, 16, 16]} />
                <meshStandardMaterial
                    color={getColor()}
                    emissive={getColor()}
                    emissiveIntensity={hovered || isActive ? 2 : 0.5}
                    metalness={0.8}
                    roughness={0.2}
                />
            </mesh>

            {/* Ripple for source/destination */}
            {(isSource || isDestination) && (
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
                    <ringGeometry args={[0.15, 0.4, 32]} />
                    <meshBasicMaterial color={getColor()} transparent opacity={0.2} />
                </mesh>
            )}

            {/* Label */}
            {(hovered || isSource || isDestination || isPartOfRoute) && (
                <Html position={[0, 0.5, 0]} center>
                    <div className={cn(
                        'px-2 py-1 rounded text-xs font-medium whitespace-nowrap',
                        theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-slate-900',
                        'shadow-lg border border-border'
                    )}>
                        {isSource && <span className="text-green-500 mr-1">●</span>}
                        {isDestination && <span className="text-red-500 mr-1">●</span>}
                        {node.name}
                    </div>
                </Html>
            )}
        </group>
    )
}

/* =========================================================
   SELECTION HUD
 ========================================================= */

function SelectionHUD({
    stage,
    source,
    destination,
    routeFetched,
    onStart,
    onReset
}: {
    stage: SelectionStage
    source: string | null
    destination: string | null
    routeFetched: boolean
    onStart: () => void
    onReset: () => void
}) {
    if (stage === 'idle' && !source && !destination) return null

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-20 right-8 z-20"
        >
            <div className="bg-card/90 backdrop-blur-xl border border-border rounded-xl p-4 shadow-xl min-w-[350px]">
                <div className="flex items-center gap-4 justify-end">
                    {/* Source */}
                    <div className="flex items-center gap-2">
                        <div className="text-right">
                            <div className="text-[10px] text-muted-foreground uppercase">Source</div>
                            <div className="text-sm font-medium">
                                {source ? STATES_BY_ID[source]?.name : 'Select...'}
                            </div>
                        </div>
                        <div className={cn(
                            'w-8 h-8 rounded-lg flex items-center justify-center',
                            source ? 'bg-green-500/20' : 'bg-muted'
                        )}>
                            <LocateFixed className={cn('w-4 h-4', source ? 'text-green-500' : 'text-muted-foreground')} />
                        </div>
                    </div>

                    <MoveRight className="w-4 h-4 text-muted-foreground/40" />

                    {/* Destination */}
                    <div className="flex items-center gap-2">
                        <div className={cn(
                            'w-8 h-8 rounded-lg flex items-center justify-center',
                            destination ? 'bg-red-500/20' : 'bg-muted'
                        )}>
                            <Flag className={cn('w-4 h-4', destination ? 'text-red-500' : 'text-muted-foreground')} />
                        </div>
                        <div className="text-left">
                            <div className="text-[10px] text-muted-foreground uppercase">Destination</div>
                            <div className="text-sm font-medium">
                                {destination ? STATES_BY_ID[destination]?.name : 'Select...'}
                            </div>
                        </div>
                    </div>

                    <div className="h-8 w-px bg-border mx-2" />

                    {/* Actions */}
                    {source && destination ? (
                        <button
                            onClick={onStart}
                            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium"
                        >
                            {routeFetched ? 'Re-run' : 'Launch'}
                        </button>
                    ) : (
                        <div className="text-xs text-primary animate-pulse">
                            {stage === 'picking-source' ? 'Pick source' : 'Pick destination'}
                        </div>
                    )}

                    <button onClick={onReset} className="p-2 hover:bg-muted rounded-lg">
                        <RotateCcw className="w-4 h-4 text-muted-foreground" />
                    </button>
                </div>
            </div>
        </motion.div>
    )
}

/* =========================================================
   TELEMETRY PANEL
 ========================================================= */

function TelemetryPanel({ routeResult, theme }: { routeResult: any, theme: string }) {
    if (!routeResult) return null

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-6 right-6 z-20"
        >
            <div className={cn(
                'p-5 rounded-xl border shadow-xl backdrop-blur-xl min-w-[240px]',
                theme === 'dark' ? 'bg-slate-900/90 border-slate-700' : 'bg-white/90 border-slate-200'
            )}>
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Route Analysis</span>
                </div>

                <div className="space-y-4">
                    <div>
                        <div className="text-xs text-muted-foreground mb-1">Total Distance</div>
                        <div className="text-2xl font-semibold">{routeResult.totalDistance} km</div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <div className="text-xs text-muted-foreground mb-1">Latency</div>
                            <div className="font-medium">{routeResult.estimatedTime}ms</div>
                        </div>
                        <div>
                            <div className="text-xs text-muted-foreground mb-1">Congestion</div>
                            <div className={cn(
                                'font-medium capitalize',
                                routeResult.congestionLevel === 'low' ? 'text-green-500' :
                                    routeResult.congestionLevel === 'medium' ? 'text-amber-500' : 'text-red-500'
                            )}>
                                {routeResult.congestionLevel}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

/* =========================================================
   MAIN COMPONENT
 ========================================================= */

export function ThreeDTrafficFlow() {
    const {
        regions,
        isRunning,
        routeResult,
        theme,
        selectionStage,
        source,
        destination,
        setSource,
        setDestination,
        setSelectionStage,
        startSimulation,
        reset
    } = useTrafficStore()

    const nodePoints: NodePoint[] = useMemo(() => {
        return INDIA_STATES.map(state => {
            const pos = mapCoords(state.coordinates.lat, state.coordinates.lng)
            const zoneCfg = REGION_MAP[state.zone as RegionId]
            return {
                id: state.id,
                position: pos,
                color: zoneCfg?.color || '#6b7280',
                name: state.name,
                zone: state.zone
            }
        })
    }, [])

    const handleNodeClick = useCallback((nodeId: string) => {
        if (isRunning) return

        if (selectionStage === 'idle') {
            setSource(nodeId)
            setSelectionStage('picking-destination')
        } else if (selectionStage === 'picking-source') {
            setSource(nodeId)
            setSelectionStage('picking-destination')
        } else if (selectionStage === 'picking-destination') {
            if (nodeId === source) return
            setDestination(nodeId)
            setSelectionStage('idle')
        }
    }, [isRunning, selectionStage, source, setSource, setDestination, setSelectionStage])

    const routeNodeIds = useMemo(() => routeResult?.pathIds || [], [routeResult])

    return (
        <div className={cn(
            'w-full h-full rounded-2xl overflow-hidden border relative',
            theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
        )}>
            {/* Header */}
            <div className="absolute top-6 left-6 z-10">
                <div className={cn(
                    'p-4 rounded-xl border backdrop-blur-xl shadow-lg',
                    theme === 'dark' ? 'bg-slate-900/80 border-slate-700' : 'bg-white/80 border-slate-200'
                )}>
                    <div className="flex items-center gap-3 mb-2">
                        <Globe className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">India Traffic Network</h3>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            <span>36 Nodes</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Zap className="w-3 h-3 text-amber-500" />
                            <span>{isRunning ? 'Active' : 'Idle'}</span>
                        </div>
                    </div>
                </div>

                {/* Pick Route Button */}
                <button
                    onClick={() => setSelectionStage(selectionStage === 'idle' ? 'picking-source' : 'idle')}
                    className={cn(
                        'mt-3 px-4 py-2 rounded-lg border text-xs font-medium transition-all flex items-center gap-2',
                        selectionStage !== 'idle'
                            ? 'bg-primary text-primary-foreground border-primary'
                            : theme === 'dark'
                                ? 'bg-slate-800 border-slate-700 hover:border-primary'
                                : 'bg-white border-slate-200 hover:border-primary'
                    )}
                >
                    <MousePointer2 className={cn('w-4 h-4', selectionStage !== 'idle' && 'animate-bounce')} />
                    {selectionStage !== 'idle' ? 'Picking...' : 'Select Route'}
                </button>
            </div>

            {/* 3D Canvas */}
            <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 12, 10], fov: 40 }}>
                <color attach="background" args={[theme === 'dark' ? '#020617' : '#f8fafc']} />

                <group scale={1.6} position={[0, -1, 0]}>
                    <Stars radius={80} depth={40} count={2000} factor={3} saturation={0} fade speed={0.3} />

                    <ambientLight intensity={theme === 'dark' ? 0.4 : 0.6} />
                    <pointLight position={[10, 10, 10]} intensity={1.5} color="#3b82f6" />
                    <spotLight position={[0, 15, 0]} angle={0.4} penumbra={1} intensity={3} castShadow />

                    {/* Grid floor */}
                    <gridHelper
                        args={[25, 25, theme === 'dark' ? '#1e293b' : '#e2e8f0', theme === 'dark' ? '#0f172a' : '#f1f5f9']}
                        position={[0, -0.1, 0]}
                    />

                    {/* India outline */}
                    <IndiaOutline theme={theme} />

                    {/* India grid dots */}
                    <IndiaGrid theme={theme} />

                    {/* State nodes */}
                    {nodePoints.map(node => (
                        <StateNode
                            key={node.id}
                            node={node}
                            isSource={source === node.id}
                            isDestination={destination === node.id}
                            isPartOfRoute={routeNodeIds.includes(node.id)}
                            isActive={regions[node.id as RegionId]?.status === 'processing'}
                            theme={theme}
                            onClick={() => handleNodeClick(node.id)}
                        />
                    ))}

                    {/* Route path */}
                    {routeNodeIds.length > 0 && <RoutePath route={routeNodeIds} theme={theme} />}

                    {/* Traffic particles */}
                    {isRunning && routeNodeIds.length > 0 && (
                        <TrafficParticles route={routeNodeIds} nodePoints={nodePoints} />
                    )}
                </group>

                <OrbitControls
                    makeDefault
                    enableZoom
                    enablePan
                    minPolarAngle={Math.PI / 6}
                    maxPolarAngle={Math.PI / 2.2}
                    dampingFactor={0.05}
                    enableDamping
                />
            </Canvas>

            {/* Selection HUD */}
            <SelectionHUD
                stage={selectionStage}
                source={source}
                destination={destination}
                routeFetched={!!routeResult}
                onStart={startSimulation}
                onReset={reset}
            />

            {/* Telemetry Panel */}
            <TelemetryPanel routeResult={routeResult} theme={theme} />

            {/* Instructions */}
            <div className={cn(
                'absolute bottom-2 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-lg border text-xs backdrop-blur-xl',
                theme === 'dark' ? 'bg-slate-900/80 border-slate-700 text-slate-400' : 'bg-white/80 border-slate-200 text-slate-500'
            )}>
                Click nodes to select route • Scroll to zoom • Drag to rotate
            </div>
        </div>
    )
}

export default ThreeDTrafficFlow
