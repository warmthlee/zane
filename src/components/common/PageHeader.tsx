import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type PageHeaderProps = {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
  headingLevel?: 'h1' | 'h2'
  className?: string
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  headingLevel = 'h1',
  className,
}: PageHeaderProps) {
  const Heading = headingLevel

  return (
    <header
      className={cn(
        'flex flex-wrap items-end justify-between gap-6 rounded-3xl border border-border bg-linear-to-br from-primary/10 via-card to-card px-6 py-7 shadow-sm',
        className,
      )}
    >
      <div className="grid max-w-2xl gap-3">
        {eyebrow && (
          <p className="text-xs font-medium tracking-[0.14em] text-brand-text uppercase">
            {eyebrow}
          </p>
        )}
        <Heading className="text-balance text-3xl leading-tight font-semibold text-foreground md:text-4xl">
          {title}
        </Heading>
        {description && (
          <p className="text-sm leading-7 text-muted-foreground md:text-base">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  )
}
