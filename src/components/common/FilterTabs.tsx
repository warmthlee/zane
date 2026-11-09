import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { TagPill } from './TagPill'

export type FilterTabOption<T extends string> = {
  value: T
  label: ReactNode
}

type FilterTabsProps<T extends string> = {
  options: ReadonlyArray<FilterTabOption<T>>
  value: T
  onChange: (value: T) => void
  ariaLabel: string
  className?: string
}

export function FilterTabs<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  className,
}: FilterTabsProps<T>) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn('flex flex-wrap gap-2', className)}
    >
      {options.map((option) => (
        <TagPill
          key={option.value}
          active={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </TagPill>
      ))}
    </div>
  )
}
