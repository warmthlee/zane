import { useEffect, useState } from 'react'
import { getHealth } from '@/api-client/client'
import type { HealthResponse } from '@/api-client/client'

type BackendState =
  | { status: 'loading' }
  | { status: 'online'; health: HealthResponse }
  | { status: 'offline'; message: string }

const stateLabels: Record<BackendState['status'], string> = {
  loading: '检测中',
  online: '正常',
  offline: '不可用',
}

export function BackendStatus() {
  const [state, setState] = useState<BackendState>({ status: 'loading' })

  useEffect(() => {
    const controller = new AbortController()

    getHealth(controller.signal)
      .then((health) => {
        if (!controller.signal.aborted) {
          setState({ status: 'online', health })
        }
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return
        }

        setState({
          status: 'offline',
          message: error instanceof Error ? error.message : '无法连接后端',
        })
      })

    return () => controller.abort()
  }, [])

  return (
    <section className={`backend-status ${state.status}`} role="status" aria-live="polite">
      <span className="backend-status-dot" aria-hidden="true" />
      <div>
        <p className="eyebrow-alt">后端连接 · {stateLabels[state.status]}</p>
        {state.status === 'loading' && <p>正在检测后端健康状态…</p>}
        {state.status === 'online' && (
          <p>
            {state.health.service} · {state.health.status} · {new Date(state.health.checkedAtUtc).toLocaleString()}
          </p>
        )}
        {state.status === 'offline' && <p>无法连接后端：{state.message}</p>}
      </div>
    </section>
  )
}
