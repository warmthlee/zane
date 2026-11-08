/**
 * 共享 Tailwind 组合。
 *
 * 页面视觉由 utility class 和 index.css 中的设计 token 共同表达；
 * 这里只收敛重复出现的表面、眉题与胶囊样式，避免各页面各写一套。
 */

export const surface =
  'rounded-[28px] border border-border bg-card/75 shadow-elevation'

export const surfaceSoft =
  'rounded-[26px] border border-border bg-card/75 shadow-elevation'

export const eyebrow =
  'm-0 text-xs font-bold tracking-[0.12em] text-brand-text uppercase'

export const eyebrowCompact =
  'mb-0.5 text-[0.68rem] font-bold tracking-[0.12em] text-brand-text uppercase'

export const pill =
  'inline-flex items-center rounded-full border border-border bg-card/75 px-3 py-2 text-sm text-foreground transition hover:-translate-y-px'

export const pillActive = 'border-primary/40 bg-secondary text-foreground'

export const secondaryButton =
  'inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-[1.1rem] py-[0.82rem] text-foreground transition hover:-translate-y-px'

export const progressBar =
  'relative h-2 w-full overflow-hidden rounded-full bg-primary/10'

export const progressFill =
  'block h-full rounded-[inherit] bg-linear-to-br from-primary to-brand-strong'

export const miniBadge =
  'inline-flex items-center rounded-full border border-border bg-primary/10 px-2 py-1 text-[0.63rem] tracking-[0.06em] uppercase text-foreground'

export const miniBadgeFavorite = 'bg-success/10'
export const miniBadgeDraft = 'bg-warning/10'
