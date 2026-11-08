import { contentCategories } from '@/features/notes/data'
import type { ThemeMode, ViewMode } from '@/features/notes/types'

type SiteHeaderProps = {
  theme: ThemeMode
  activeCategory: string
  onNavigate: (view: ViewMode) => void
  onOpenCategory: (categoryName: string) => void
  onToggleTheme: () => void
}

const navItems: Array<{ view: ViewMode; label: string }> = [
  { view: 'home', label: '首页' },
  { view: 'articles', label: '文章' },
]

const tailNavItems: Array<{ view: ViewMode; label: string }> = [
  { view: 'library', label: '文库' },
  { view: 'archive', label: '归档' },
  { view: 'author', label: '作者' },
  { view: 'about', label: '关于' },
]

export function SiteHeader({ theme, activeCategory, onNavigate, onOpenCategory, onToggleTheme }: SiteHeaderProps) {
  const openCategoryView = () => {
    const nextCategory = activeCategory !== '全部' ? activeCategory : contentCategories[0].name
    onOpenCategory(nextCategory)
  }

  return (
    <header className="topbar">
      <button type="button" className="brand" onClick={() => onNavigate('home')}>
        <span className="brand-mark">Z</span>
        <span>zane blog</span>
      </button>

      <nav className="main-nav" aria-label="Main navigation">
        {navItems.map((item) => (
          <button key={item.view} type="button" onClick={() => onNavigate(item.view)}>
            {item.label}
          </button>
        ))}
        <button type="button" onClick={openCategoryView}>
          分类
        </button>
        {tailNavItems.map((item) => (
          <button key={item.view} type="button" onClick={() => onNavigate(item.view)}>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="header-actions">
        <button type="button" className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? '深色' : '浅色'}
        </button>
        <button type="button" className="subscribe-link" onClick={() => onNavigate('author')}>
          订阅
        </button>
      </div>
    </header>
  )
}
