import { Button } from '@/components/ui/button'
import type { AsyncError } from '@/lib/asyncState'
import { cn } from '@/lib/utils'

type ErrorStateProps = {
  error: AsyncError | string
  title?: string
  onRetry?: () => void
  retryLabel?: string
  variant?: 'card' | 'inline'
  className?: string
}

export function ErrorState({
  error,
  title,
  onRetry,
  retryLabel = '重试',
  variant = 'card',
  className,
}: ErrorStateProps) {
  const message = typeof error === 'string' ? error : error.message
  const heading = title ?? (typeof error === 'string' ? '加载失败' : error.title)
  const status = typeof error === 'string' ? undefined : error.status

  return (
    <div
      role="alert"
      className={cn(
        'grid gap-2',
        variant === 'card' && 'rounded-2xl border border-danger/30 bg-danger/5 px-5 py-4',
        className,
      )}
    >
      <div className="flex flex-wrap items-baseline gap-2">
        <strong className="text-sm font-semibold text-danger">{heading}</strong>
        {status && <span className="text-xs text-muted-foreground">状态码 {status}</span>}
      </div>
      <p className="text-sm leading-6 text-muted-foreground">{message}</p>
      {onRetry && (
        <div className="pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="border-danger/40 text-danger hover:bg-danger/10"
          >
            {retryLabel}
          </Button>
        </div>
      )}
    </div>
  )
}
