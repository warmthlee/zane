import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type TagPillProps = {
  children: ReactNode
  active?: boolean
  onClick?: () => void
  className?: string
}

const pillClassName = 'rounded-full px-3'
const activeClassName = 'border-primary/40 bg-secondary text-foreground'

export function TagPill({ children, active = false, onClick, className }: TagPillProps) {
  if (onClick) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        aria-pressed={active}
        onClick={onClick}
        className={cn(pillClassName, active && activeClassName, className)}
      >
        {children}
      </Button>
    )
  }

  return (
    <span
      data-active={active}
      className={cn(
        'inline-flex h-7 items-center rounded-full border border-border bg-background px-3 text-sm text-foreground',
        active && activeClassName,
        className,
      )}
    >
      {children}
    </span>
  )
}
