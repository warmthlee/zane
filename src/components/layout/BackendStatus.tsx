import { getHealth } from '@/api-client/client'
import { ErrorState } from '@/components/common/ErrorState'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { useAsyncData } from '@/hooks/useAsyncData'
import { cn } from '@/lib/utils'
import { eyebrowCompact } from '@/lib/styles'

const stateLabels = {
  loading: '检测中',
  online: '正常',
  offline: '不可用',
} as const

export function BackendStatus() {
  const { data: health, error, isLoading, isSuccess, isError, retry } = useAsyncData(getHealth)
  const status = isError ? 'offline' : isSuccess ? 'online' : 'loading'

  return (
    <section
      className="mt-5 flex items-center gap-3 rounded-2xl border border-border bg-card/75 px-[18px] py-3.5 text-muted-foreground"
      role="status"
      aria-live="polite"
    >
      <span
        aria-hidden="true"
        className={cn(
          'size-2.5 shrink-0 rounded-full bg-muted-foreground',
          status === 'online' && 'bg-success',
          status === 'offline' && 'bg-danger',
          status === 'loading' && 'animate-pulse motion-reduce:animate-none',
        )}
      />
      <div className="w-full">
        <p className={eyebrowCompact}>后端连接 · {stateLabels[status]}</p>
        {isLoading && (
          <>
            <p>正在检测后端健康状态…</p>
            <LoadingSkeleton
              lines={2}
              label="正在检测后端健康状态"
              className="mt-2 max-w-xl"
            />
          </>
        )}
        {isSuccess && health && (
          <p>
            {health.service} · {health.status} ·{' '}
            {new Date(health.checkedAtUtc).toLocaleString()}
          </p>
        )}
        {isError && error && (
          <ErrorState
            variant="inline"
            title="无法连接后端"
            error={error}
            onRetry={retry}
            retryLabel="重新检测"
            className="mt-1"
          />
        )}
      </div>
    </section>
  )
}
