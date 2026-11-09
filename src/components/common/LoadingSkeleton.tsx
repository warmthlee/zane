import { cn } from '@/lib/utils'

type LoadingSkeletonProps = {
  lines?: number
  label?: string
  className?: string
}

const lineWidths = ['w-full', 'w-4/5', 'w-2/3', 'w-3/4']

export function LoadingSkeleton({
  lines = 3,
  label = '正在加载…',
  className,
}: LoadingSkeletonProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className={cn('grid gap-2', className)}
    >
      <span className="sr-only">{label}</span>
      {Array.from({ length: lines }, (_, index) => (
        <span
          key={index}
          aria-hidden="true"
          className={cn(
            'block h-3 animate-pulse rounded-full bg-muted motion-reduce:animate-none',
            lineWidths[index % lineWidths.length],
          )}
        />
      ))}
    </div>
  )
}
