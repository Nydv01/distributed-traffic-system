import { RPCRequest, RPCResponse, RegionId } from '@/types/traffic'
import { generateId, delay, randomBetween } from './utils'

const MIN_LATENCY = 60
const MAX_LATENCY = 320
const BASE_PROCESSING_TIME = [250, 900]

const FAILURE_PROBABILITY = 0.12
const MAX_RETRIES = 2
const TIMEOUT_MS = 1200

export interface RPCCallback {
  onRequestSent?: (request: RPCRequest) => void
  onProcessing?: (request: RPCRequest) => void
  onResponseReceived?: (response: RPCResponse) => void
  onRetry?: (request: RPCRequest, attempt: number) => void
  onTimeout?: (request: RPCRequest) => void
  onError?: (request: RPCRequest, error: string) => void
}

type NodeHealth = {
  failures: number
  circuitOpen: boolean
}

class RPCSimulator {
  private callbacks: RPCCallback = {}
  private requestQueue = new Map<string, RPCRequest>()
  private nodeHealth = new Map<RegionId, NodeHealth>()

  constructor() {
    ; (['north_india', 'south_india', 'east_india', 'west_india'] as RegionId[]).forEach(r =>
      this.nodeHealth.set(r, { failures: 0, circuitOpen: false })
    )
  }

  setCallbacks(callbacks: RPCCallback) {
    this.callbacks = callbacks
  }

  async sendRequest(
    from: string,
    to: RegionId,
    type: RPCRequest['type'],
    payload: unknown,
    forceSuccess = false
  ): Promise<RPCResponse> {
    const health = this.nodeHealth.get(to)!
    const request: RPCRequest = {
      id: generateId(),
      from,
      to,
      type,
      payload,
      timestamp: Date.now(),
    }

    if (health.circuitOpen) {
      const error = `Circuit open for ${to} node`
      this.callbacks.onError?.(request, error)
      return this.failedResponse(request, error, 0)
    }

    this.requestQueue.set(request.id, request)
    this.callbacks.onRequestSent?.(request)

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        if (attempt > 0) {
          this.callbacks.onRetry?.(request, attempt)
          await delay(200 * Math.pow(2, attempt))
        }

        return await this.executeRequest(request, forceSuccess)
      } catch (err) {
        if (attempt === MAX_RETRIES) {
          health.failures++
          if (health.failures >= 3) health.circuitOpen = true

          this.callbacks.onError?.(request, String(err))
          return this.failedResponse(request, String(err), 0)
        }
      }
    }

    return this.failedResponse(request, 'Unexpected RPC failure', 0)
  }

  private async executeRequest(
    request: RPCRequest,
    forceSuccess: boolean
  ): Promise<RPCResponse> {
    const start = Date.now()

    await delay(randomBetween(MIN_LATENCY / 2, MAX_LATENCY / 2))
    this.callbacks.onProcessing?.(request)

    const processingTime = randomBetween(
      BASE_PROCESSING_TIME[0],
      BASE_PROCESSING_TIME[1]
    )
    await delay(processingTime)

    if (processingTime > TIMEOUT_MS) {
      this.callbacks.onTimeout?.(request)
      throw new Error('RPC Timeout')
    }

    const shouldFail =
      !forceSuccess && Math.random() < FAILURE_PROBABILITY

    if (shouldFail) {
      throw new Error(`Node ${request.to} failed to respond`)
    }

    await delay(randomBetween(MIN_LATENCY / 2, MAX_LATENCY / 2))

    const response: RPCResponse = {
      id: generateId(),
      requestId: request.id,
      from: request.to,
      to: request.from,
      success: true,
      data: request.payload,
      processingTime: Date.now() - start,
      timestamp: Date.now(),
    }

    const targetHealth = this.nodeHealth.get(request.to as RegionId)
    if (targetHealth) {
      targetHealth.failures = 0
    }
    this.callbacks.onResponseReceived?.(response)
    this.requestQueue.delete(request.id)

    return response
  }

  async broadcastRequest(
    from: string,
    targets: RegionId[],
    type: RPCRequest['type'],
    payload: unknown
  ): Promise<Map<RegionId, RPCResponse>> {
    const responses = await Promise.all(
      targets.map(async region => ({
        region,
        response: await this.sendRequest(from, region, type, payload),
      }))
    )

    const map = new Map<RegionId, RPCResponse>()
    responses.forEach(r => map.set(r.region, r.response))
    return map
  }

  private failedResponse(
    req: RPCRequest,
    error: string,
    processingTime: number
  ): RPCResponse {
    return {
      id: generateId(),
      requestId: req.id,
      from: req.to,
      to: req.from,
      success: false,
      error,
      processingTime,
      timestamp: Date.now(),
    }
  }

  getActiveRequests() {
    return [...this.requestQueue.values()]
  }

  reset() {
    this.requestQueue.clear()
    this.nodeHealth.forEach(h => {
      h.failures = 0
      h.circuitOpen = false
    })
  }
}

export const rpcSimulator = new RPCSimulator()
