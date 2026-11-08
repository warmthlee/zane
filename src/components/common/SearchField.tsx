import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type SearchFieldProps = {
  id: string
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  hint?: string
  className?: string
}

export function SearchField({
  id,
  value,
  onChange,
  label = '搜索',
  placeholder,
  hint,
  className,
}: SearchFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined

  return (
    <div className={cn('grid gap-2', className)}>
      <label
        htmlFor={id}
        className="text-xs font-medium tracking-[0.08em] text-brand-text uppercase"
      >
        {label}
      </label>
      <Input
        id={id}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-describedby={hintId}
        autoComplete="off"
        className="h-auto py-3"
      />
      {hint && (
        <span id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </span>
      )}
    </div>
  )
}
