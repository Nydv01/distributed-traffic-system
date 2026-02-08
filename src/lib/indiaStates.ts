/**
 * India States Configuration
 * 
 * Complete list of 28 States + 8 Union Territories organized into 6 zones.
 * Used for routing nodes and regional analytics.
 */

/* ============================================================
   ZONE TYPES
============================================================ */

export type ZoneId =
    | 'north'
    | 'south'
    | 'east'
    | 'west'
    | 'central'
    | 'northeast'

export interface Zone {
    id: ZoneId
    name: string
    color: string
    emoji: string
}

export const ZONES: Record<ZoneId, Zone> = {
    north: { id: 'north', name: 'North India', color: '#3b82f6', emoji: '🏔️' },
    south: { id: 'south', name: 'South India', color: '#22c55e', emoji: '🌴' },
    east: { id: 'east', name: 'East India', color: '#f59e0b', emoji: '🌊' },
    west: { id: 'west', name: 'West India', color: '#ef4444', emoji: '🏜️' },
    central: { id: 'central', name: 'Central India', color: '#8b5cf6', emoji: '🏛️' },
    northeast: { id: 'northeast', name: 'North-East India', color: '#14b8a6', emoji: '🌲' },
}

/* ============================================================
   STATE TYPES
============================================================ */

export type StateType = 'state' | 'union_territory'

export interface IndiaState {
    id: string
    name: string
    code: string              // 2-letter code
    type: StateType
    zone: ZoneId
    capital: string
    coordinates: { lat: number; lng: number }
    population?: number       // in millions
}

/* ============================================================
   NORTH ZONE (10 states/UTs)
============================================================ */

const NORTH_STATES: IndiaState[] = [
    { id: 'delhi', name: 'Delhi NCR', code: 'DL', type: 'union_territory', zone: 'north', capital: 'New Delhi', coordinates: { lat: 28.6139, lng: 77.2090 }, population: 32 },
    { id: 'punjab', name: 'Punjab', code: 'PB', type: 'state', zone: 'north', capital: 'Chandigarh', coordinates: { lat: 31.1471, lng: 75.3412 }, population: 28 },
    { id: 'haryana', name: 'Haryana', code: 'HR', type: 'state', zone: 'north', capital: 'Chandigarh', coordinates: { lat: 29.0588, lng: 76.0856 }, population: 25 },
    { id: 'rajasthan', name: 'Rajasthan', code: 'RJ', type: 'state', zone: 'north', capital: 'Jaipur', coordinates: { lat: 27.0238, lng: 74.2179 }, population: 69 },
    { id: 'uttar_pradesh', name: 'Uttar Pradesh', code: 'UP', type: 'state', zone: 'north', capital: 'Lucknow', coordinates: { lat: 26.8467, lng: 80.9462 }, population: 200 },
    { id: 'uttarakhand', name: 'Uttarakhand', code: 'UK', type: 'state', zone: 'north', capital: 'Dehradun', coordinates: { lat: 30.0668, lng: 79.0193 }, population: 10 },
    { id: 'himachal_pradesh', name: 'Himachal Pradesh', code: 'HP', type: 'state', zone: 'north', capital: 'Shimla', coordinates: { lat: 31.1048, lng: 77.1734 }, population: 7 },
    { id: 'jammu_kashmir', name: 'Jammu & Kashmir', code: 'JK', type: 'union_territory', zone: 'north', capital: 'Srinagar', coordinates: { lat: 33.7782, lng: 76.5762 }, population: 12 },
    { id: 'ladakh', name: 'Ladakh', code: 'LA', type: 'union_territory', zone: 'north', capital: 'Leh', coordinates: { lat: 34.1526, lng: 77.5771 }, population: 0.3 },
    { id: 'chandigarh', name: 'Chandigarh', code: 'CH', type: 'union_territory', zone: 'north', capital: 'Chandigarh', coordinates: { lat: 30.7333, lng: 76.7794 }, population: 1 },
]

/* ============================================================
   SOUTH ZONE (7 states/UTs)
============================================================ */

const SOUTH_STATES: IndiaState[] = [
    { id: 'tamil_nadu', name: 'Tamil Nadu', code: 'TN', type: 'state', zone: 'south', capital: 'Chennai', coordinates: { lat: 11.1271, lng: 78.6569 }, population: 72 },
    { id: 'karnataka', name: 'Karnataka', code: 'KA', type: 'state', zone: 'south', capital: 'Bengaluru', coordinates: { lat: 15.3173, lng: 75.7139 }, population: 61 },
    { id: 'kerala', name: 'Kerala', code: 'KL', type: 'state', zone: 'south', capital: 'Thiruvananthapuram', coordinates: { lat: 10.8505, lng: 76.2711 }, population: 33 },
    { id: 'andhra_pradesh', name: 'Andhra Pradesh', code: 'AP', type: 'state', zone: 'south', capital: 'Amaravati', coordinates: { lat: 15.9129, lng: 79.7400 }, population: 50 },
    { id: 'telangana', name: 'Telangana', code: 'TS', type: 'state', zone: 'south', capital: 'Hyderabad', coordinates: { lat: 18.1124, lng: 79.0193 }, population: 35 },
    { id: 'puducherry', name: 'Puducherry', code: 'PY', type: 'union_territory', zone: 'south', capital: 'Puducherry', coordinates: { lat: 11.9416, lng: 79.8083 }, population: 1.2 },
    { id: 'lakshadweep', name: 'Lakshadweep', code: 'LD', type: 'union_territory', zone: 'south', capital: 'Kavaratti', coordinates: { lat: 10.5667, lng: 72.6417 }, population: 0.06 },
]

/* ============================================================
   EAST ZONE (5 states/UTs)
============================================================ */

const EAST_STATES: IndiaState[] = [
    { id: 'west_bengal', name: 'West Bengal', code: 'WB', type: 'state', zone: 'east', capital: 'Kolkata', coordinates: { lat: 22.9868, lng: 87.8550 }, population: 91 },
    { id: 'odisha', name: 'Odisha', code: 'OR', type: 'state', zone: 'east', capital: 'Bhubaneswar', coordinates: { lat: 20.9517, lng: 85.0985 }, population: 42 },
    { id: 'bihar', name: 'Bihar', code: 'BR', type: 'state', zone: 'east', capital: 'Patna', coordinates: { lat: 25.0961, lng: 85.3131 }, population: 104 },
    { id: 'jharkhand', name: 'Jharkhand', code: 'JH', type: 'state', zone: 'east', capital: 'Ranchi', coordinates: { lat: 23.6102, lng: 85.2799 }, population: 33 },
    { id: 'andaman_nicobar', name: 'Andaman & Nicobar', code: 'AN', type: 'union_territory', zone: 'east', capital: 'Port Blair', coordinates: { lat: 11.7401, lng: 92.6586 }, population: 0.4 },
]

/* ============================================================
   WEST ZONE (5 states/UTs)
============================================================ */

const WEST_STATES: IndiaState[] = [
    { id: 'maharashtra', name: 'Maharashtra', code: 'MH', type: 'state', zone: 'west', capital: 'Mumbai', coordinates: { lat: 19.7515, lng: 75.7139 }, population: 112 },
    { id: 'gujarat', name: 'Gujarat', code: 'GJ', type: 'state', zone: 'west', capital: 'Gandhinagar', coordinates: { lat: 22.2587, lng: 71.1924 }, population: 60 },
    { id: 'goa', name: 'Goa', code: 'GA', type: 'state', zone: 'west', capital: 'Panaji', coordinates: { lat: 15.2993, lng: 74.1240 }, population: 1.5 },
    { id: 'dadra_nagar_haveli_daman_diu', name: 'Dadra & Nagar Haveli and Daman & Diu', code: 'DD', type: 'union_territory', zone: 'west', capital: 'Daman', coordinates: { lat: 20.4283, lng: 72.8397 }, population: 0.6 },
]

/* ============================================================
   CENTRAL ZONE (2 states)
============================================================ */

const CENTRAL_STATES: IndiaState[] = [
    { id: 'madhya_pradesh', name: 'Madhya Pradesh', code: 'MP', type: 'state', zone: 'central', capital: 'Bhopal', coordinates: { lat: 22.9734, lng: 78.6569 }, population: 73 },
    { id: 'chhattisgarh', name: 'Chhattisgarh', code: 'CG', type: 'state', zone: 'central', capital: 'Raipur', coordinates: { lat: 21.2787, lng: 81.8661 }, population: 26 },
]

/* ============================================================
   NORTH-EAST ZONE (8 states)
============================================================ */

const NORTHEAST_STATES: IndiaState[] = [
    { id: 'assam', name: 'Assam', code: 'AS', type: 'state', zone: 'northeast', capital: 'Dispur', coordinates: { lat: 26.2006, lng: 92.9376 }, population: 31 },
    { id: 'meghalaya', name: 'Meghalaya', code: 'ML', type: 'state', zone: 'northeast', capital: 'Shillong', coordinates: { lat: 25.4670, lng: 91.3662 }, population: 3 },
    { id: 'arunachal_pradesh', name: 'Arunachal Pradesh', code: 'AR', type: 'state', zone: 'northeast', capital: 'Itanagar', coordinates: { lat: 28.2180, lng: 94.7278 }, population: 1.4 },
    { id: 'nagaland', name: 'Nagaland', code: 'NL', type: 'state', zone: 'northeast', capital: 'Kohima', coordinates: { lat: 26.1584, lng: 94.5624 }, population: 2 },
    { id: 'manipur', name: 'Manipur', code: 'MN', type: 'state', zone: 'northeast', capital: 'Imphal', coordinates: { lat: 24.6637, lng: 93.9063 }, population: 2.9 },
    { id: 'mizoram', name: 'Mizoram', code: 'MZ', type: 'state', zone: 'northeast', capital: 'Aizawl', coordinates: { lat: 23.1645, lng: 92.9376 }, population: 1.1 },
    { id: 'tripura', name: 'Tripura', code: 'TR', type: 'state', zone: 'northeast', capital: 'Agartala', coordinates: { lat: 23.9408, lng: 91.9882 }, population: 3.7 },
    { id: 'sikkim', name: 'Sikkim', code: 'SK', type: 'state', zone: 'northeast', capital: 'Gangtok', coordinates: { lat: 27.5330, lng: 88.5122 }, population: 0.6 },
]

/* ============================================================
   EXPORTS
============================================================ */

export const INDIA_STATES: IndiaState[] = [
    ...NORTH_STATES,
    ...SOUTH_STATES,
    ...EAST_STATES,
    ...WEST_STATES,
    ...CENTRAL_STATES,
    ...NORTHEAST_STATES,
]

// Quick lookup by ID
export const STATES_BY_ID: Record<string, IndiaState> =
    INDIA_STATES.reduce((acc, state) => ({ ...acc, [state.id]: state }), {})

// States grouped by zone
export const STATES_BY_ZONE: Record<ZoneId, IndiaState[]> = {
    north: NORTH_STATES,
    south: SOUTH_STATES,
    east: EAST_STATES,
    west: WEST_STATES,
    central: CENTRAL_STATES,
    northeast: NORTHEAST_STATES,
}

// Get all state IDs
export const ALL_STATE_IDS = INDIA_STATES.map(s => s.id)

// Get state count
export const TOTAL_STATES = INDIA_STATES.length // 36

/**
 * Get zone for a state
 */
export function getStateZone(stateId: string): Zone | undefined {
    const state = STATES_BY_ID[stateId]
    return state ? ZONES[state.zone] : undefined
}

/**
 * Get state display color (based on zone)
 */
export function getStateColor(stateId: string): string {
    const zone = getStateZone(stateId)
    return zone?.color ?? '#6b7280'
}

/**
 * Format state for dropdown display
 */
export function formatStateOption(state: IndiaState): string {
    return `${state.name} (${state.code})`
}
