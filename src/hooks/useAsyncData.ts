import { useCallback, useEffect, useRef, useState } from 'react'
import {
  isAbortError,
  normalizeAsyncError,
  type AsyncError,
  type AsyncState,
} from '@/lib/asyncState'

type AsyncDataKey = string | number | boolean | null

type UseAsyncDataOptions<T> = {
  /** 判断空结果；默认把 null / undefined 与空数组视为空。 */
  isEmpty?: (data: T) => boolean
  /** 变化时重新请求；适合放 URL 查询串或筛选条件的稳定值。 */
  key?: AsyncDataKey
}

type AsyncOutcome<T> = {
  key: AsyncDataKey
  revision: number
  state: AsyncState<T>
}

export type AsyncDataResult<T> = {
  state: AsyncState<T>
  data: T | undefined
  error: AsyncError | undefined
  isLoading: boolean
  isSuccess: boolean
  isEmpty: boolean
  isError: boolean
  retry: () => void
}

function defaultIsEmpty<T>(data: T) {
  return data == null || (Array.isArray(data) && data.length === 0)
}

/**
 * 统一异步数据状态：loading / success / empty / error + 重试。
 * loader 通过 ref 读取，调用方不必为内联函数手写 useCallback；
 * 需要重新请求时改变 key，或调用 retry()。
 */
export function useAsyncData<T>(
  load: (signal: AbortSignal) => Promise<T>,
  options: UseAsyncDataOptions<T> = {},
): AsyncDataResult<T> {
  const { key = null } = options
  const [revision, setRevision] = useState(0)
  const [outcome, setOutcome] = useState<AsyncOutcome<T>>({
    key,
    revision: 0,
    state: { status: 'loading' },
  })

  const loadRef = useRef(load)
  const isEmptyRef = useRef(options.isEmpty)

  useEffect(() => {
    loadRef.current = load
    isEmptyRef.current = options.isEmpty
  })

  useEffect(() => {
    const controller = new AbortController()
    const requestKey = key
    const requestRevision = revision

    void (async () => {
      try {
        const data = await loadRef.current(controller.signal)
        if (controller.signal.aborted) {
          return
        }

        const isEmpty = (isEmptyRef.current ?? defaultIsEmpty)(data)
        setOutcome({
          key: requestKey,
          revision: requestRevision,
          state: isEmpty ? { status: 'empty', data } : { status: 'success', data },
        })
      } catch (error) {
        if (controller.signal.aborted || isAbortError(error)) {
          return
        }

        setOutcome({
          key: requestKey,
          revision: requestRevision,
          state: { status: 'error', error: normalizeAsyncError(error) },
        })
      }
    })()

    return () => controller.abort()
  }, [key, revision])

  const retry = useCallback(() => {
    setRevision((current) => current + 1)
  }, [])

  const isCurrent = outcome.key === key && outcome.revision === revision
  const state: AsyncState<T> = isCurrent ? outcome.state : { status: 'loading' }

  const data =
    state.status === 'success' || state.status === 'empty' ? state.data : undefined
  const error = state.status === 'error' ? state.error : undefined

  return {
    state,
    data,
    error,
    isLoading: state.status === 'loading',
    isSuccess: state.status === 'success',
    isEmpty: state.status === 'empty',
    isError: state.status === 'error',
    retry,
  }
}
