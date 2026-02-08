import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Float, ContactShadows, OrbitControls, PerspectiveCamera, Text } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Premium 3D Extruded India Base
 */
function India3DBase() {
    const shape = useMemo(() => {
        const s = new THREE.Shape()
        // Coordinates for a more accurate India silhouette
        const points = [
            { lat: 37.0, lng: 74.5 }, { lat: 37.2, lng: 77.0 }, { lat: 34.5, lng: 79.5 },
            { lat: 31.0, lng: 81.0 }, { lat: 28.5, lng: 84.5 }, { lat: 27.5, lng: 88.5 },
            { lat: 28.5, lng: 91.5 }, { lat: 28.2, lng: 96.5 }, { lat: 24.5, lng: 95.0 },
            { lat: 22.0, lng: 92.5 }, { lat: 22.5, lng: 91.5 }, { lat: 26.5, lng: 90.0 },
            { lat: 22.5, lng: 89.0 }, { lat: 20.0, lng: 86.5 }, { lat: 17.5, lng: 83.5 },
            { lat: 13.5, lng: 80.5 }, { lat: 9.0, lng: 78.5 }, { lat: 8.1, lng: 77.5 },
            { lat: 9.5, lng: 76.5 }, { lat: 14.5, lng: 74.5 }, { lat: 18.5, lng: 73.5 },
            { lat: 21.0, lng: 72.5 }, { lat: 23.5, lng: 68.5 }, { lat: 24.5, lng: 71.5 },
            { lat: 30.5, lng: 74.0 }, { lat: 34.5, lng: 73.5 },
        ].map(p => ({
            x: (p.lng - 82.5) * 0.8,
            y: (22.5 - p.lat) * 1.0
        }))

        s.moveTo(points[0].x, points[0].y)
        points.slice(1).forEach(p => s.lineTo(p.x, p.y))
        s.closePath()
        return s
    }, [])

    const extrudeSettings = {
        steps: 2,
        depth: 0.8,
        bevelEnabled: true,
        bevelThickness: 0.2,
        bevelSize: 0.2,
        bevelOffset: 0,
        bevelSegments: 5
    }

    return (
        <group rotation={[-Math.PI / 2, 0, 0]}>
            <mesh receiveShadow castShadow>
                <extrudeGeometry args={[shape, extrudeSettings]} />
                <meshStandardMaterial
                    color="#0a1a2f"
                    emissive="#1d4ed8"
                    emissiveIntensity={0.2}
                    roughness={0.1}
                    metalness={0.8}
                />
            </mesh>
            <mesh scale={[1.02, 1.02, 1]} position={[0, 0, 0.01]}>
                <extrudeGeometry args={[shape, { ...extrudeSettings, depth: 0.2 }]} />
                <meshBasicMaterial
                    color="#3b82f6"
                    transparent
                    opacity={0.3}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
        </group>
    )
}

/**
 * Sweeping Scanning Beam Effect
 */
function ScanningBeam() {
    const beamRef = useRef<THREE.Mesh>(null!)
    const materialRef = useRef<THREE.MeshBasicMaterial>(null!)

    useFrame((state) => {
        const time = state.clock.elapsedTime
        if (beamRef.current && materialRef.current) {
            const x = (Math.sin(time * 0.4) * 12)
            beamRef.current.position.x = x
            materialRef.current.opacity = Math.max(0, Math.cos(time * 0.4) * 0.25)
        }
    })

    return (
        <mesh ref={beamRef} position={[0, 1, 0]}>
            <boxGeometry args={[0.2, 5, 25]} />
            <meshBasicMaterial
                ref={materialRef}
                color="#60a5fa"
                transparent
                opacity={0.2}
                blending={THREE.AdditiveBlending}
            />
        </mesh>
    )
}

function NetworkConduits() {
    const lines = useMemo(() => {
        const hubs = [
            { name: 'DELHI', lat: 28.6, lng: 77.2 },
            { name: 'MUMBAI', lat: 19.0, lng: 72.8 },
            { name: 'BENGALURU', lat: 12.9, lng: 77.6 },
            { name: 'CHENNAI', lat: 13.0, lng: 80.2 },
            { name: 'KOLKATA', lat: 22.5, lng: 88.3 },
            { name: 'HYDERABAD', lat: 17.3, lng: 78.4 },
        ].map(c => [
            (c.lng - 82.5) * 0.8,
            0.6,
            (22.5 - c.lat) * 1.0
        ])

        const curves: THREE.Vector3[][] = []
        for (let i = 0; i < hubs.length; i++) {
            for (let j = i + 1; j < hubs.length; j++) {
                const start = new THREE.Vector3(hubs[i][0], hubs[i][1], hubs[i][2])
                const end = new THREE.Vector3(hubs[j][0], hubs[j][1], hubs[j][2])
                const mid = new THREE.Vector3().lerpVectors(start, end, 0.5)
                mid.y += start.distanceTo(end) * 0.2
                const curve = new THREE.QuadraticBezierCurve3(start, mid, end)
                curves.push(curve.getPoints(30))
            }
        }
        return curves
    }, [])

    return (
        <group>
            {lines.map((pts, i) => (
                <mesh key={i}>
                    <tubeGeometry args={[new THREE.CatmullRomCurve3(pts), 32, 0.025, 8, false]} />
                    <meshBasicMaterial color="#3b82f6" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
                </mesh>
            ))}
        </group>
    )
}

function TechOverlayWidgets() {
    const widgets = useMemo(() => [
        { pos: [-10, 2, -10], size: 4, label: 'SYS_NORTH' },
        { pos: [12, 3, -2], size: 5, label: 'DATA_EAST' },
        { pos: [-12, 1, 10], size: 3.5, label: 'CORE_WEST' },
        { pos: [8, 4, 15], size: 4.5, label: 'OPS_SOUTH' },
    ], [])

    return (
        <group>
            {widgets.map((w, i) => (
                <group key={i} position={w.pos as [number, number, number]}>
                    <Float speed={2} rotationIntensity={1} floatIntensity={0.5}>
                        <mesh rotation={[Math.PI / 3, 0, 0]}>
                            <ringGeometry args={[w.size * 0.85, w.size, 64]} />
                            <meshBasicMaterial color="#3b82f6" transparent opacity={0.1} side={THREE.DoubleSide} />
                        </mesh>
                        <Text position={[0, w.size * 1.2, 0]} fontSize={0.4} color="#60a5fa" anchorX="center">
                            {w.label}
                        </Text>
                    </Float>
                </group>
            ))}
        </group>
    )
}

function CityNodes() {
    const cities = useMemo(() => [
        { name: 'Delhi', pos: [28.6, 77.2] },
        { name: 'Mumbai', pos: [19.0, 72.8] },
        { name: 'Bengaluru', pos: [12.9, 77.6] },
        { name: 'Chennai', pos: [13.0, 80.2] },
        { name: 'Kolkata', pos: [22.5, 88.3] },
        { name: 'Hyderabad', pos: [17.3, 78.4] },
    ].map(c => ({
        name: c.name,
        position: [(c.pos[1] - 82.5) * 0.8, 0.6, (22.5 - c.pos[0]) * 1.0] as [number, number, number]
    })), [])

    return (
        <group>
            {cities.map((city, i) => (
                <group key={i} position={city.position}>
                    <Float speed={3} rotationIntensity={0} floatIntensity={0.2}>
                        <mesh>
                            <sphereGeometry args={[0.18, 16, 16]} />
                            <meshStandardMaterial color="#60a5fa" emissive="#3b82f6" emissiveIntensity={8} />
                        </mesh>
                        <mesh rotation={[Math.PI / 2, 0, 0]}>
                            <ringGeometry args={[0.3, 0.4, 32]} />
                            <meshBasicMaterial color="#60a5fa" transparent opacity={0.5} side={THREE.DoubleSide} />
                        </mesh>
                        <Text position={[0, 0.6, 0]} fontSize={0.35} color="white" anchorX="center">
                            {city.name}
                        </Text>
                    </Float>
                </group>
            ))}
        </group>
    )
}

export function DynamicIndiaMap() {
    return (
        <div className="w-full h-full relative overflow-hidden bg-[#02040a]" style={{ minHeight: '800px' }}>
            <Canvas shadows dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 18, 22]} fov={35} />
                <ambientLight intensity={0.4} />
                <pointLight position={[10, 20, 10]} intensity={1.5} color="#3b82f6" />
                <spotLight position={[0, 40, 0]} angle={0.4} penumbra={1} intensity={15} castShadow />
                <Stars radius={120} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

                <group scale={1.2} position={[0, -2, 0]}>
                    <India3DBase />
                    <CityNodes />
                    <NetworkConduits />
                    <TechOverlayWidgets />
                    <ScanningBeam />
                    <ContactShadows position={[0, -0.4, 0]} opacity={0.3} scale={40} blur={2.5} far={6} />
                </group>

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate
                    autoRotateSpeed={0.4}
                    maxPolarAngle={Math.PI / 2.1}
                    minPolarAngle={Math.PI / 4}
                />
            </Canvas>

            {/* HUD Overlays */}
            <div className="absolute top-12 left-12 flex flex-col gap-8 pointer-events-none z-50">
                <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[1em] text-primary/40">Network Matrix</span>
                    <div className="text-4xl font-black text-white italic tracking-tighter">BHARAT_GRID <span className="text-primary text-2xl">v5.0</span></div>
                </div>
                <div className="flex gap-16">
                    <div className="flex flex-col"><span className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">Grid Load</span><span className="text-2xl font-black text-primary">14.2 EH/s</span></div>
                    <div className="flex flex-col"><span className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">Node Sync</span><span className="text-2xl font-black text-emerald-400">99.98%</span></div>
                </div>
            </div>

            <div className="absolute bottom-12 right-12 glass-hyper p-6 rounded-[30px] border-white/5 pointer-events-none z-50">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Live Topology Stream </span>
                </div>
            </div>
        </div>
    )
}
