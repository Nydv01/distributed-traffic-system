import {
  Graph,
  GraphNode,
  RouteEdge,
  RouteResult,
  TrafficData,
  RegionId,
  Location,
} from '@/types/traffic'

export const LOCATIONS: Location[] = [
  { id: 'delhi', name: 'Delhi NCR', region: 'north_india', x: 50, y: 18 },
  { id: 'punjab', name: 'Punjab (Chandigarh)', region: 'north_india', x: 45, y: 12 },
  { id: 'haryana', name: 'Haryana (Chandigarh)', region: 'north_india', x: 48, y: 15 },
  { id: 'rajasthan', name: 'Rajasthan (Jaipur)', region: 'north_india', x: 38, y: 28 },
  { id: 'uttar_pradesh', name: 'Uttar Pradesh (Lucknow)', region: 'north_india', x: 58, y: 25 },
  { id: 'uttarakhand', name: 'Uttarakhand (Dehradun)', region: 'north_india', x: 52, y: 10 },
  { id: 'himachal_pradesh', name: 'Himachal Pradesh (Shimla)', region: 'north_india', x: 48, y: 8 },
  { id: 'jammu_kashmir', name: 'Jammu & Kashmir (Srinagar)', region: 'north_india', x: 45, y: 2 },
  { id: 'ladakh', name: 'Ladakh (Leh)', region: 'north_india', x: 48, y: 0 },
  { id: 'chandigarh', name: 'Chandigarh', region: 'north_india', x: 46, y: 13 },

  { id: 'tamil_nadu', name: 'Tamil Nadu (Chennai)', region: 'south_india', x: 58, y: 82 },
  { id: 'karnataka', name: 'Karnataka (Bengaluru)', region: 'south_india', x: 50, y: 75 },
  { id: 'kerala', name: 'Kerala (Thiruvananthapuram)', region: 'south_india', x: 48, y: 88 },
  { id: 'andhra_pradesh', name: 'Andhra Pradesh (Amaravati)', region: 'south_india', x: 55, y: 70 },
  { id: 'telangana', name: 'Telangana (Hyderabad)', region: 'south_india', x: 52, y: 65 },
  { id: 'puducherry', name: 'Puducherry', region: 'south_india', x: 60, y: 85 },
  { id: 'lakshadweep', name: 'Lakshadweep (Kavaratti)', region: 'south_india', x: 42, y: 90 },

  { id: 'west_bengal', name: 'West Bengal (Kolkata)', region: 'east_india', x: 78, y: 42 },
  { id: 'odisha', name: 'Odisha (Bhubaneswar)', region: 'east_india', x: 72, y: 55 },
  { id: 'bihar', name: 'Bihar (Patna)', region: 'east_india', x: 70, y: 35 },
  { id: 'jharkhand', name: 'Jharkhand (Ranchi)', region: 'east_india', x: 72, y: 42 },
  { id: 'andaman_nicobar', name: 'Andaman & Nicobar (Port Blair)', region: 'east_india', x: 88, y: 78 },

  { id: 'maharashtra', name: 'Maharashtra (Mumbai)', region: 'west_india', x: 42, y: 55 },
  { id: 'gujarat', name: 'Gujarat (Gandhinagar)', region: 'west_india', x: 32, y: 40 },
  { id: 'goa', name: 'Goa (Panaji)', region: 'west_india', x: 45, y: 68 },
  { id: 'dadra_nagar_haveli_daman_diu', name: 'Dadra & Daman (Daman)', region: 'west_india', x: 35, y: 48 },

  { id: 'madhya_pradesh', name: 'Madhya Pradesh (Bhopal)', region: 'central_india', x: 48, y: 42 },
  { id: 'chhattisgarh', name: 'Chhattisgarh (Raipur)', region: 'central_india', x: 58, y: 50 },

  { id: 'assam', name: 'Assam (Dispur)', region: 'northeast_india', x: 88, y: 28 },
  { id: 'meghalaya', name: 'Meghalaya (Shillong)', region: 'northeast_india', x: 86, y: 30 },
  { id: 'arunachal_pradesh', name: 'Arunachal Pradesh (Itanagar)', region: 'northeast_india', x: 92, y: 22 },
  { id: 'nagaland', name: 'Nagaland (Kohima)', region: 'northeast_india', x: 92, y: 28 },
  { id: 'manipur', name: 'Manipur (Imphal)', region: 'northeast_india', x: 92, y: 32 },
  { id: 'mizoram', name: 'Mizoram (Aizawl)', region: 'northeast_india', x: 88, y: 35 },
  { id: 'tripura', name: 'Tripura (Agartala)', region: 'northeast_india', x: 84, y: 35 },
  { id: 'sikkim', name: 'Sikkim (Gangtok)', region: 'northeast_india', x: 80, y: 25 },
]

function generateEdges(): RouteEdge[] {
  const baseEdges = [
    ['delhi', 'punjab', 4.5],
    ['delhi', 'haryana', 1.5],
    ['delhi', 'uttar_pradesh', 5.0],
    ['delhi', 'rajasthan', 5.2],
    ['punjab', 'haryana', 2.0],
    ['punjab', 'himachal_pradesh', 4.0],
    ['haryana', 'rajasthan', 4.5],
    ['uttarakhand', 'uttar_pradesh', 3.5],
    ['himachal_pradesh', 'jammu_kashmir', 5.5],
    ['jammu_kashmir', 'ladakh', 4.0],
    ['chandigarh', 'punjab', 0.5],

    ['tamil_nadu', 'karnataka', 5.5],
    ['tamil_nadu', 'kerala', 6.8],
    ['tamil_nadu', 'andhra_pradesh', 5.0],
    ['karnataka', 'kerala', 4.2],
    ['karnataka', 'goa', 4.5],
    ['karnataka', 'telangana', 4.0],
    ['andhra_pradesh', 'telangana', 3.0],
    ['tamil_nadu', 'puducherry', 2.5],

    ['west_bengal', 'bihar', 5.0],
    ['west_bengal', 'jharkhand', 4.0],
    ['west_bengal', 'odisha', 5.5],
    ['bihar', 'jharkhand', 3.5],
    ['odisha', 'jharkhand', 4.2],
    ['odisha', 'chhattisgarh', 4.8],

    ['maharashtra', 'gujarat', 5.8],
    ['maharashtra', 'goa', 4.5],
    ['maharashtra', 'madhya_pradesh', 6.0],
    ['gujarat', 'rajasthan', 5.5],
    ['gujarat', 'dadra_nagar_haveli_daman_diu', 2.5],

    ['madhya_pradesh', 'chhattisgarh', 5.0],
    ['madhya_pradesh', 'rajasthan', 5.5],
    ['madhya_pradesh', 'uttar_pradesh', 5.0],

    ['assam', 'meghalaya', 1.5],
    ['assam', 'arunachal_pradesh', 4.5],
    ['assam', 'nagaland', 4.0],
    ['assam', 'manipur', 5.5],
    ['assam', 'mizoram', 6.0],
    ['assam', 'tripura', 5.0],
    ['meghalaya', 'tripura', 4.5],
    ['nagaland', 'manipur', 3.0],
    ['mizoram', 'manipur', 3.5],
    ['sikkim', 'west_bengal', 4.0],

    ['madhya_pradesh', 'delhi', 8.5],
    ['karnataka', 'maharashtra', 7.0],
    ['west_bengal', 'assam', 8.5],
    ['telangana', 'maharashtra', 6.5],
    ['uttar_pradesh', 'bihar', 6.0],
    ['chhattisgarh', 'telangana', 7.0],
    ['rajasthan', 'maharashtra', 9.0],
    ['odisha', 'andhra_pradesh', 5.5],
  ] as const

  const edges: RouteEdge[] = []

  baseEdges.forEach(([from, to, distance]) => {
    edges.push({
      from,
      to,
      distance,
      baseWeight: distance,
      dynamicWeight: distance,
      congestionDelay: 0,
    })

    edges.push({
      from: to,
      to: from,
      distance,
      baseWeight: distance,
      dynamicWeight: distance,
      congestionDelay: 0,
    })
  })

  return edges
}

export function createGraph(): Graph {
  const nodes: GraphNode[] = LOCATIONS.map(loc => ({
    id: loc.id,
    name: loc.name,
    region: loc.region,
  }))

  return {
    nodes,
    edges: generateEdges(),
  }
}

export function updateEdgeWeights(
  graph: Graph,
  trafficData: Record<RegionId, TrafficData>
): Graph {
  const updatedEdges = graph.edges.map(edge => {
    const fromLoc = LOCATIONS.find(l => l.id === edge.from)!
    const toLoc = LOCATIONS.find(l => l.id === edge.to)!

    const fromTraffic = trafficData[fromLoc.region]
    const toTraffic = trafficData[toLoc.region]

    const avgSpeed =
      ((fromTraffic?.averageSpeed ?? 50) +
        (toTraffic?.averageSpeed ?? 50)) / 2

    const congestionFactor =
      ((fromTraffic?.congestionScore ?? 0) +
        (toTraffic?.congestionScore ?? 0)) /
      200

    const baseTime = (edge.distance / avgSpeed) * 60
    const congestionDelay = baseTime * congestionFactor

    return {
      ...edge,
      congestionDelay,
      dynamicWeight: baseTime + congestionDelay,
    }
  })

  return { ...graph, edges: updatedEdges }
}

export function dijkstra(
  graph: Graph,
  sourceId: string,
  destId: string
): RouteResult | null {
  const distances: Record<string, number> = {}
  const previous: Record<string, string | null> = {}
  const visited = new Set<string>()

  graph.nodes.forEach(n => {
    distances[n.id] = n.id === sourceId ? 0 : Infinity
    previous[n.id] = null
  })

  while (true) {
    const current = Object.entries(distances)
      .filter(([id]) => !visited.has(id))
      .sort((a, b) => a[1] - b[1])[0]

    if (!current) break
    const [currentId] = current
    if (currentId === destId) break

    visited.add(currentId)

    graph.edges
      .filter(e => e.from === currentId)
      .forEach(edge => {
        const newDist = distances[currentId] + edge.dynamicWeight
        if (newDist < distances[edge.to]) {
          distances[edge.to] = newDist
          previous[edge.to] = currentId
        }
      })
  }

  if (distances[destId] === Infinity) return null

  const pathIds: string[] = []
  let cur: string | null = destId

  while (cur) {
    pathIds.unshift(cur)
    cur = previous[cur]
  }

  const path = pathIds.map(
    id => LOCATIONS.find(l => l.id === id)!.name
  )

  let totalDistance = 0
  let totalDelay = 0
  const regions = new Set<RegionId>()

  for (let i = 0; i < pathIds.length - 1; i++) {
    const edge = graph.edges.find(
      e => e.from === pathIds[i] && e.to === pathIds[i + 1]
    )!

    totalDistance += edge.distance
    totalDelay += edge.congestionDelay

    regions.add(
      LOCATIONS.find(l => l.id === pathIds[i])!.region
    )
  }

  const avgDelay = totalDelay / Math.max(pathIds.length - 1, 1)

  const congestionLevel =
    avgDelay < 0.5
      ? 'low'
      : avgDelay < 1.5
        ? 'medium'
        : avgDelay < 3
          ? 'high'
          : 'severe'

  return {
    path,
    pathIds,
    totalDistance: Math.round(totalDistance * 10) / 10,
    estimatedTime: Math.round(distances[destId] * 10) / 10,
    congestionLevel,
    affectedRegions: Array.from(regions),
  }
}

export const getLocationById = (id: string) =>
  LOCATIONS.find(l => l.id === id)

export const getLocationByName = (name: string) =>
  LOCATIONS.find(l => l.name === name)
