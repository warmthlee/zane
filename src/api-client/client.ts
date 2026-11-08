import type { components } from './schema'

export type HealthResponse = components['schemas']['HealthResponse']
export type ProblemDetails = components['schemas']['ProblemDetails']

export class ApiError extends Error {
  status: number
  problem?: ProblemDetails

  constructor(message: string, status: number, problem?: ProblemDetails) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.problem = problem
  }
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')
const REQUEST_TIMEOUT_MS = 5000

const request = async <T>(path: string, signal?: AbortSignal): Promise<T> => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(new Error('请求超时')), REQUEST_TIMEOUT_MS)
  const abortFromCaller = () => controller.abort(signal?.reason)
  signal?.addEventListener('abort', abortFromCaller, { once: true })

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })

    if (!response.ok) {
      const problem = (await response.json().catch(() => undefined)) as ProblemDetails | undefined
      throw new ApiError(
        problem?.detail ?? problem?.title ?? `请求失败（HTTP ${response.status}）`,
        response.status,
        problem,
      )
    }

    return (await response.json()) as T
  } finally {
    clearTimeout(timeoutId)
    signal?.removeEventListener('abort', abortFromCaller)
  }
}

export const getHealth = (signal?: AbortSignal) => request<HealthResponse>('/api/v1/health', signal)
