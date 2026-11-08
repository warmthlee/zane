import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
  icon?: ReactNode
  className?: string
}

export function EmptyState({
  title,
  description,
  action,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      role="status"
      className={cn(
        'grid justify-items-center gap-3 rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center',
        className,
      )}
    >
      {icon && (
        <div className="grid size-10 place-items-center rounded-full bg-secondary text-brand-text">
          {icon}
        </div>
      )}
      <strong className="text-base text-foreground">{title}</strong>
      {description && (
        <p className="max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
      )}
      {action && <div className="pt-1">{action}</div>}
    </div>
  )
}
