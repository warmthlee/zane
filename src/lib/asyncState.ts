import { ApiError } from '@/api-client/client'

export type AsyncError = {
  title: string
  message: string
  status?: number
  code?: string
}

export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'empty'; data: T }
  | { status: 'error'; error: AsyncError }

export function isAbortError(error: unknown) {
  return error instanceof Error && error.name === 'AbortError'
}

function toStatus(value: number | string | null | undefined) {
  if (typeof value === 'number') {
    return value
  }

  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : undefined
  }

  return undefined
}

/**
 * 把 ApiError（ProblemDetails）、原生 Error 与未知异常统一成可展示的错误。
 * 页面只消费 title / message / status，不再各自判断错误类型。
 */
export function normalizeAsyncError(error: unknown): AsyncError {
  if (error instanceof ApiError) {
    return {
      title: error.problem?.title ?? '请求失败',
      message: error.problem?.detail ?? error.message,
      status: toStatus(error.problem?.status) ?? error.status,
      code: error.problem?.type ?? undefined,
    }
  }

  if (error instanceof Error) {
    return {
      title: '请求失败',
      message: error.message || '请稍后重试。',
    }
  }

  return {
    title: '未知错误',
    message: '发生了未预期的错误，请稍后重试。',
  }
}
