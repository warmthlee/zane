import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type SectionHeaderProps = {
  eyebrow?: string
  title?: ReactNode
  description?: ReactNode
  action?: ReactNode
  className?: string
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <header className={cn('flex flex-wrap items-end justify-between gap-3', className)}>
      <div className="grid gap-1">
        {eyebrow && (
          <p className="text-xs font-medium tracking-[0.14em] text-brand-text uppercase">
            {eyebrow}
          </p>
        )}
        {title && <h2 className="text-xl font-semibold text-foreground">{title}</h2>}
        {description && (
          <p className="text-sm leading-6 text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </header>
  )
}
