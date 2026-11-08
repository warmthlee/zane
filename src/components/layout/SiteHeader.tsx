import { Link, useLocation, useMatch, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { contentCategories } from '@/features/notes/data'
import type { ThemeMode } from '@/features/notes/types'

type SiteHeaderProps = {
  theme: ThemeMode
  onToggleTheme: () => void
}

const primaryNavItems = [
  { path: '/', label: '首页' },
  { path: '/notes', label: '文章' },
]

const tailNavItems = [
  { path: '/library', label: '文库' },
  { path: '/archive', label: '归档' },
  { path: '/author', label: '作者' },
  { path: '/about', label: '关于' },
]

export function SiteHeader({ theme, onToggleTheme }: SiteHeaderProps) {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const categoryMatch = useMatch('/categories/:categoryId')

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  const categoryName = searchParams.get('category')
  const matchedCategory =
    categoryName && categoryName !== '全部'
      ? contentCategories.find((category) => category.name === categoryName)
      : undefined
  const categoryPath = `/categories/${
    categoryMatch?.params.categoryId ?? matchedCategory?.id ?? contentCategories[0].id
  }`

  const navLinkClassName =
    'inline-flex items-center rounded-full px-4 py-2.5 text-muted-foreground transition hover:-translate-y-px hover:bg-secondary hover:text-foreground aria-[current=page]:bg-secondary aria-[current=page]:text-foreground'

  return (
    <header className="sticky top-4 z-20 flex flex-wrap items-center justify-between gap-4 rounded-[22px] border border-border bg-card/40 px-5 py-4 shadow-elevation backdrop-blur-xl max-sm:justify-center max-sm:px-4 max-sm:py-3.5">
      <Link
        to="/"
        className="inline-flex items-center gap-2.5 font-bold tracking-[0.04em] text-foreground lowercase"
      >
        <span className="grid size-8 place-items-center rounded-[10px] bg-primary text-[0.95rem] text-primary-foreground shadow-[0_12px_20px_color-mix(in_srgb,var(--primary)_20%,transparent)]">
          Z
        </span>
        <span>zane blog</span>
      </Link>

      <nav
        className="flex flex-wrap items-center justify-center gap-2 max-sm:w-full"
        aria-label="Main navigation"
      >
        {primaryNavItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={navLinkClassName}
            aria-current={isActive(item.path) ? 'page' : undefined}
          >
            {item.label}
          </Link>
        ))}
        <Link
          to={categoryPath}
          className={navLinkClassName}
          aria-current={categoryMatch ? 'page' : undefined}
        >
          分类
        </Link>
        {tailNavItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={navLinkClassName}
            aria-current={isActive(item.path) ? 'page' : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2.5 max-sm:w-full max-sm:justify-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-10 px-4"
          onClick={onToggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? '深色' : '浅色'}
        </Button>
      </div>
    </header>
  )
}
