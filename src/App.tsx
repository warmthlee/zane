import { useEffect, useMemo, useState } from 'react'
import { postMarkdownContent } from './content/postContent'
import './App.css'

type ThemeMode = 'light' | 'dark'
type ViewMode = 'home' | 'articles' | 'category' | 'archive' | 'about' | 'author' | 'library'
type FilterMode = 'category' | 'year' | 'tag'
type StatusFilter = 'all' | 'favorites' | 'drafts' | 'reading'

type Section = {
  heading: string
  body: string[]
  checklist?: string[]
  code?: string
}

type Post = {
  id: string
  category: string
  title: string
  summary: string
  readTime: string
  date: string
  tags: string[]
  sections: Section[]
}

type ArchiveGroup = {
  year: string
  posts: Post[]
}

type ArchiveDisplayGroup = {
  name?: string
  year?: string
  posts: Post[]
}

const parseMarkdown = (markdown: string): Section[] => {
  return markdown
    .split(/^##\s+/m)
    .filter(Boolean)
    .map((block) => {
      const lines = block.split(/\r?\n/)
      const [heading, ...rest] = lines
      const body: string[] = []
      const checklist: string[] = []
      let code = ''
      let inCodeBlock = false

      for (const line of rest) {
        if (line.trim().startsWith('```')) {
          inCodeBlock = !inCodeBlock
          continue
        }

        if (inCodeBlock) {
          code += `${code ? '\n' : ''}${line}`
          continue
        }

        const trimmed = line.trim()
        if (!trimmed) {
          continue
        }

        if (trimmed.startsWith('- ')) {
          checklist.push(trimmed.replace('- ', ''))
          continue
        }

        body.push(trimmed)
      }

      return {
        heading: heading.trim(),
        body,
        ...(checklist.length > 0 ? { checklist } : {}),
        ...(code ? { code } : {}),
      }
    })
}

const contentCategories = [
  {
    id: 'learning',
    name: '技术学习分享',
    summary: '记录前端、工程实践和认知迭代过程中的关键收获。',
  },
  {
    id: 'reference',
    name: '参考文档',
    summary: '整理概念、规则和常用资料，适合反复查阅与回顾。',
  },
  {
    id: 'tools',
    name: '小工具实现',
    summary: '把重复动作和实验想法做成更轻量、更实用的产物。',
  },
  {
    id: 'essays',
    name: '随笔写作',
    summary: '把日常观察、感受和思考沉淀成更稳定的表达。',
  },
  {
    id: 'reading',
    name: '读书心得',
    summary: '吸收知识与观点，并把它们转化成个人判断力。',
  },
  {
    id: 'cheatsheet',
    name: 'Cheatsheet',
    summary: '用清单和速查方式降低重复决策和反复查找成本。',
  },
]

const posts: Post[] = [
  {
    id: 'typescript-utility-types',
    category: '技术学习分享',
    title: 'TypeScript Utility Types 实践：从“看懂”到“能落地”',
    summary:
      '这篇笔记整理了我在真实业务代码里常用的 TypeScript 工具类型，并附上了如何把抽象类型转换成可维护交互模型的思路。',
    readTime: '7 min read',
    date: '2026-10-09',
    tags: ['TypeScript', '类型系统', '工程实践'],
    sections: parseMarkdown(postMarkdownContent['typescript-utility-types']),
  },
  {
    id: 'react-state-patterns',
    category: '技术学习分享',
    title: 'React 状态设计：把“复杂”拆成“清晰的几个状态”',
    summary:
      '本文记录了一种更稳妥的状态拆分方式：当功能越来越复杂时，先整理状态边界，再决定谁拥有数据，避免无数 useEffect 和重复渲染。',
    readTime: '6 min read',
    date: '2026-09-21',
    tags: ['React', '状态管理', '组件设计'],
    sections: parseMarkdown(postMarkdownContent['react-state-patterns']),
  },
  {
    id: 'vite-deploy-checklist',
    category: '技术学习分享',
    title: 'Vite 项目部署速查：从本地开发到线上发布',
    summary:
      '这份速查笔记整理了我在 Vite 项目中最常踩的部署细节，包括 build 产物、静态资源处理和环境变量配置。',
    readTime: '5 min read',
    date: '2026-08-12',
    tags: ['Vite', '部署', 'Cheatsheet'],
    sections: parseMarkdown(postMarkdownContent['vite-deploy-checklist']),
  },
  {
    id: 'docs-structure',
    category: '参考文档',
    title: '文档结构化整理：让知识积累持续复用',
    summary:
      '这篇文章总结了我在整理经验时最常使用的文档结构：目标、内容、结论、上下文和复用场景。',
    readTime: '5 min read',
    date: '2026-07-19',
    tags: ['Docs', '知识管理', '方法论'],
    sections: parseMarkdown(postMarkdownContent['docs-structure']),
  },
  {
    id: 'mini-tooling',
    category: '小工具实现',
    title: '从一个“小工具”出发，如何快速验证想法并沉淀成可复用能力',
    summary:
      '小工具不是“玩具”，而是把概念转化为闭环反馈的最小可行验证器，是工程实践里最有价值的入口。',
    readTime: '7 min read',
    date: '2026-06-30',
    tags: ['CLI', 'Automation', '工具化'],
    sections: parseMarkdown(postMarkdownContent['mini-tooling']),
  },
  {
    id: 'product-clarity',
    category: '随笔写作',
    title: '做产品时，最重要的不是“做很多”，而是“留清晰的边界”',
    summary:
      '这篇随笔记录了一条经验：很多功能问题并不是技术问题，而是边界没定清楚，结果就是不断扩张却没有真正积累。',
    readTime: '4 min read',
    date: '2026-05-28',
    tags: ['产品思考', '边界', '工程'],
    sections: parseMarkdown(postMarkdownContent['product-clarity']),
  },
  {
    id: 'reading-notes',
    category: '读书心得',
    title: '读书不是为了记住更多，而是为了看见更多的可能',
    summary:
      '好的阅读并不是“读完”，而是把新视角变成一个可以持续反复调用的判断框架。',
    readTime: '8 min read',
    date: '2026-04-15',
    tags: ['Books', '成长', '阅读'],
    sections: parseMarkdown(postMarkdownContent['reading-notes']),
  },
  {
    id: 'quick-checklist',
    category: 'Cheatsheet',
    title: '我的日常 Cheatsheet：从重复动作到更稳定的工作节奏',
    summary:
      'Cheatsheet 的价值在于它让复杂工作被拆解成可执行、可检查的步骤，减少重复决策的认知负担。',
    readTime: '3 min read',
    date: '2026-02-21',
    tags: ['Checklist', 'Workflow', '效率'],
    sections: parseMarkdown(postMarkdownContent['quick-checklist']),
  },
]

const authorProfile = {
  name: 'Zane',
  role: '前端工程师 / 博客作者 / AI 协作实践者',
  bio: '我在前端工程、系统化思考和知识沉淀之间寻找稳定的工作方式。这里的内容更偏真实开发经验：如何拆解问题、如何保留上下文、如何把零散知识变成可复用的方法论，而不是单纯展示一个看起来“很厉害”的技术结果。',
  location: '中国 · 远程协作',
  focus: ['前端工程', 'TypeScript', '系统设计', 'AI 协作', '知识管理', '发布运维'],
  stats: [
    { label: '累计文章', value: '18+' },
    { label: '持续主题', value: '12个' },
    { label: '内容方向', value: '6类' },
  ],
}

const focusAreas = ['技术学习分享', '参考文档', '小工具实现', '随笔写作', '读书心得', 'Cheatsheet']

const stats = [
  { value: '6', label: '精选文章' },
  { value: '6', label: '内容板块' },
  { value: '4', label: '速查清单' },
]

const allTags = Array.from(new Set(posts.flatMap((post) => post.tags))).sort((a, b) => a.localeCompare(b))
const allYears = Array.from(new Set(posts.map((post) => new Date(post.date).getFullYear().toString()))).sort((a, b) => Number(b) - Number(a))

const socials = [
  { label: 'Email', href: 'mailto:hello@zane.blog' },
  { label: 'GitHub', href: 'https://github.com/warmthlee' },
  { label: 'RSS', href: '#rss' },
  { label: 'Newsletter', href: '#newsletter' },
]

const archiveGroups: ArchiveGroup[] = Array.from(
  posts.reduce((map, post) => {
    const year = String(new Date(post.date).getFullYear())
    const yearPosts = map.get(year) ?? []
    yearPosts.push(post)
    map.set(year, yearPosts)
    return map
  }, new Map<string, Post[]>()),
)
  .map(([year, yearPosts]) => ({
    year,
    posts: [...yearPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  }))
  .sort((a, b) => Number(b.year) - Number(a.year))

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const highlightText = (text: string, query: string) => {
  if (!query) {
    return text
  }

  const regex = new RegExp(`(${escapeRegExp(query)})`, 'ig')
  return text.split(regex).map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? <mark key={`${part}-${index}`}>{part}</mark> : <span key={`${part}-${index}`}>{part}</span>,
  )
}

const readStoredValue = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') {
    return fallback
  }

  try {
    const saved = window.localStorage.getItem(key)
    return saved ? (JSON.parse(saved) as T) : fallback
  } catch {
    return fallback
  }
}

function App() {
  const [theme, setTheme] = useState<ThemeMode>(() => readStoredValue<ThemeMode>('blog-theme', 'light'))
  const [activeView, setActiveView] = useState<ViewMode>(() => {
    if (typeof window === 'undefined') {
      return 'home'
    }

    const hashView = window.location.hash.replace('#', '')
    return (['home', 'articles', 'category', 'library', 'archive', 'about', 'author'] as const).includes(hashView as ViewMode) ? (hashView as ViewMode) : 'home'
  })
  const [selectedPostId, setSelectedPostId] = useState<string>(() => {
    if (typeof window === 'undefined') {
      return posts[0].id
    }

    const fromHash = new URLSearchParams(window.location.search).get('post')
    return fromHash ?? posts[0].id
  })
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [selectedYear, setSelectedYear] = useState('全部')
  const [selectedTag, setSelectedTag] = useState('全部')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterMode, setFilterMode] = useState<FilterMode>('category')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [archiveMode, setArchiveMode] = useState<FilterMode>('year')
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => readStoredValue<string[]>('blog-favorites', ['typescript-utility-types']))
  const [draftIds, setDraftIds] = useState<string[]>(() => readStoredValue<string[]>('blog-drafts', ['react-state-patterns']))
  const [readingProgress, setReadingProgress] = useState<Record<string, number>>(() =>
    readStoredValue<Record<string, number>>('blog-progress', {
      'typescript-utility-types': 40,
      'react-state-patterns': 65,
      'vite-deploy-checklist': 25,
    }),
  )

  useEffect(() => {
    window.localStorage.setItem('blog-theme', JSON.stringify(theme))
  }, [theme])

  useEffect(() => {
    window.localStorage.setItem('blog-favorites', JSON.stringify(favoriteIds))
  }, [favoriteIds])

  useEffect(() => {
    window.localStorage.setItem('blog-drafts', JSON.stringify(draftIds))
  }, [draftIds])

  useEffect(() => {
    window.localStorage.setItem('blog-progress', JSON.stringify(readingProgress))
  }, [readingProgress])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (activeView !== 'home') {
      params.set('view', activeView)
    } else {
      params.delete('view')
    }

    params.set('post', selectedPostId)
    const nextUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}${window.location.hash}`
    window.history.replaceState({}, '', nextUrl)
  }, [activeView, selectedPostId])

  const normalizedSearch = searchTerm.trim().toLowerCase()

  const filteredPosts = useMemo(
    () =>
      posts.filter((post) => {
        const matchesCategory = selectedCategory === '全部' || post.category === selectedCategory
        const matchesYear = selectedYear === '全部' || new Date(post.date).getFullYear().toString() === selectedYear
        const matchesTag = selectedTag === '全部' || post.tags.includes(selectedTag)
        const matchesStatus =
          statusFilter === 'all' ||
          (statusFilter === 'favorites' && favoriteIds.includes(post.id)) ||
          (statusFilter === 'drafts' && draftIds.includes(post.id)) ||
          (statusFilter === 'reading' && (readingProgress[post.id] ?? 0) > 0)
        const searchTarget = `${post.title} ${post.summary} ${post.category} ${post.tags.join(' ')}`.toLowerCase()
        const matchesSearch = !normalizedSearch || searchTarget.includes(normalizedSearch)

        return matchesCategory && matchesYear && matchesTag && matchesStatus && matchesSearch
      }),
    [draftIds, favoriteIds, normalizedSearch, readingProgress, selectedCategory, selectedTag, selectedYear, statusFilter],
  )

  const selectedCategoryInfo = contentCategories.find((category) => category.name === selectedCategory) ?? null
  const selectedCategoryPosts = useMemo(
    () => (selectedCategory === '全部' ? posts : posts.filter((post) => post.category === selectedCategory)),
    [selectedCategory],
  )
  const selectedPost = filteredPosts.find((post) => post.id === selectedPostId) ?? posts.find((post) => post.id === selectedPostId) ?? posts[0]
  const selectedProgress = readingProgress[selectedPost.id] ?? 0

  const filterOptions = useMemo(() => {
    if (filterMode === 'year') {
      return ['全部', ...allYears]
    }

    if (filterMode === 'tag') {
      return ['全部', ...allTags]
    }

    return ['全部', ...contentCategories.map((category) => category.name)]
  }, [filterMode])

  const archiveDisplayGroups: ArchiveDisplayGroup[] = useMemo(() => {
    if (archiveMode === 'category') {
      return contentCategories
        .map((category) => ({
          name: category.name,
          posts: posts.filter((post) => post.category === category.name),
        }))
        .filter((group) => group.posts.length > 0)
    }

    if (archiveMode === 'tag') {
      return allTags
        .map((tag) => ({
          name: tag,
          posts: posts.filter((post) => post.tags.includes(tag)),
        }))
        .filter((group) => group.posts.length > 0)
    }

    return archiveGroups
  }, [archiveMode])

  const currentIndex = filteredPosts.findIndex((post) => post.id === selectedPost.id)
  const previousArticle = currentIndex > 0 ? filteredPosts[currentIndex - 1] : filteredPosts[filteredPosts.length - 1]
  const nextArticle = currentIndex >= 0 && currentIndex < filteredPosts.length - 1 ? filteredPosts[currentIndex + 1] : filteredPosts[0]

  const setViewHash = (view: string) => {
    if (typeof window === 'undefined') {
      return
    }

    const nextUrl = new URL(window.location.href)
    nextUrl.hash = view
    window.history.replaceState({}, '', nextUrl)
  }

  const openPost = (postId: string) => {
    const matchedPost = posts.find((post) => post.id === postId)
    setSelectedPostId(postId)
    setCurrentSectionIndex(0)
    setSelectedCategory(matchedPost?.category ?? '全部')
    setSelectedYear('全部')
    setSelectedTag('全部')
    setActiveView('articles')
    setViewHash('articles')
  }

  const openCategory = (categoryName: string) => {
    setSelectedCategory(categoryName)
    setSelectedYear('全部')
    setSelectedTag('全部')
    setSearchTerm('')
    setFilterMode('category')
    setActiveView('category')
    setViewHash('category')
  }

  const resetFilters = () => {
    setSelectedCategory('全部')
    setSelectedYear('全部')
    setSelectedTag('全部')
    setSearchTerm('')
    setFilterMode('category')
  }

  const toggleFavorite = (postId: string) => {
    setFavoriteIds((current) =>
      current.includes(postId) ? current.filter((id) => id !== postId) : [...current, postId],
    )
  }

  const toggleDraft = (postId: string) => {
    setDraftIds((current) =>
      current.includes(postId) ? current.filter((id) => id !== postId) : [...current, postId],
    )
  }

  const adjustProgress = (postId: string, delta: number) => {
    setReadingProgress((current) => {
      const previous = current[postId] ?? 0
      const next = Math.min(100, Math.max(0, previous + delta))
      return { ...current, [postId]: next }
    })
  }

  const renderFilterPills = () => {
    if (filterMode === 'year') {
      return filterOptions.map((option) => (
        <button
          key={option}
          type="button"
          className={selectedYear === option ? 'filter-chip active' : 'filter-chip'}
          onClick={() => {
            setSelectedYear(option)
            setSelectedCategory('全部')
            setSelectedTag('全部')
          }}
        >
          {option}
        </button>
      ))
    }

    if (filterMode === 'tag') {
      return filterOptions.map((option) => (
        <button
          key={option}
          type="button"
          className={selectedTag === option ? 'filter-chip active' : 'filter-chip'}
          onClick={() => {
            setSelectedTag(option)
            setSelectedCategory('全部')
            setSelectedYear('全部')
          }}
        >
          {option}
        </button>
      ))
    }

    return filterOptions.map((option) => (
      <button
        key={option}
        type="button"
        className={selectedCategory === option ? 'filter-chip active' : 'filter-chip'}
        onClick={() => {
          setSelectedCategory(option)
          setSelectedYear('全部')
          setSelectedTag('全部')
        }}
      >
        {option}
      </button>
    ))
  }

  return (
    <div className={`page-shell theme-${theme}`}>
      <header className="topbar">
        <button type="button" className="brand" onClick={() => { setActiveView('home'); setViewHash('home') }}>
          <span className="brand-mark">Z</span>
          <span>zane blog</span>
        </button>

        <nav className="main-nav" aria-label="Main navigation">
        <button type="button" onClick={() => { setActiveView('home'); setViewHash('home') }}>
            首页
          </button>
        <button type="button" onClick={() => { setActiveView('articles'); setViewHash('articles') }}>
            文章
          </button>
          <button
            type="button"
            onClick={() => {
              const nextCategory = selectedCategory !== '全部' ? selectedCategory : contentCategories[0].name
              setSelectedCategory(nextCategory)
              setSelectedYear('全部')
              setSelectedTag('全部')
              setSearchTerm('')
              setFilterMode('category')
              setActiveView('category')
              setViewHash('category')
            }}
          >
            分类
          </button>
          <button type="button" onClick={() => { setActiveView('library'); setViewHash('library') }}>
            文库
          </button>
          <button type="button" onClick={() => { setActiveView('archive'); setViewHash('archive') }}>
            归档
          </button>
          <button type="button" onClick={() => { setActiveView('author'); setViewHash('author') }}>
            作者
          </button>
          <button type="button" onClick={() => { setActiveView('about'); setViewHash('about') }}>
            关于
          </button>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="theme-toggle"
            onClick={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '深色' : '浅色'}
          </button>
          <button type="button" className="subscribe-link" onClick={() => { setActiveView('author'); setViewHash('author') }}>
            订阅
          </button>
        </div>
      </header>

      <main className="content">
        {activeView === 'home' && (
          <>
            <section className="hero">
              <div className="hero-copy">
                <p className="eyebrow">技术学习 · 记录 · 速查</p>
                <h1>把知识整理成可继续前进的东西。</h1>
                <p className="lede">
                  我在这里记录前端工程实践、设计思考和学习过程，整理成适合反复阅读的文档、速查和笔记。目标不是炫技，而是让每次学习都更稳一点。
                </p>

                <div className="hero-actions">
                  <button type="button" className="primary-button" onClick={() => openPost(posts[0].id)}>
                    阅读最新笔记
                  </button>
                  <button type="button" className="secondary-button" onClick={() => { setActiveView('articles'); setViewHash('articles') }}>
                    查看全部内容
                  </button>
                </div>

                <ul className="hero-meta" aria-label="Quick summary">
                  <li>技术学习分享</li>
                  <li>参考文档</li>
                  <li>小工具实现</li>
                  <li>随笔写作</li>
                  <li>读书心得</li>
                  <li>Cheatsheet</li>
                </ul>
              </div>

              <aside className="hero-card" aria-label="Current focus">
                <p className="card-label">重点围绕</p>
                <h2>让复杂的技术概念变得更容易理解、更容易复用。</h2>
                <div className="mini-grid">
                  <div>
                    <span className="mini-label">本月主题</span>
                    <strong>TypeScript</strong>
                  </div>
                  <div>
                    <span className="mini-label">实践方式</span>
                    <strong>写作 + 工具</strong>
                  </div>
                </div>
              </aside>
            </section>

            <section className="category-section">
              <div className="section-heading">
                <p className="eyebrow-alt">内容板块</p>
                <button type="button" className="inline-link" onClick={() => { setActiveView('archive'); setViewHash('archive') }}>
                  查看归档
                </button>
              </div>

              <div className="category-grid">
                {contentCategories.map((category) => (
                  <article key={category.id} className="category-card category-card-clickable">
                    <button type="button" className="category-button" onClick={() => openCategory(category.name)}>
                      <div className="category-header">
                        <span className="category-icon" aria-hidden="true">
                          {category.name.slice(0, 1)}
                        </span>
                        <span className="category-tag">{category.name}</span>
                      </div>
                      <h3>{category.name}</h3>
                      <p>{category.summary}</p>
                    </button>
                  </article>
                ))}
              </div>
            </section>

            <section className="featured-section">
              <div className="section-heading">
                <p className="eyebrow-alt">精选内容</p>
                <button type="button" className="inline-link" onClick={() => { setActiveView('articles'); setViewHash('articles') }}>
                  查看归档
                </button>
              </div>

              <div className="featured-layout">
                <div className="featured-list">
                  {posts.slice(0, 3).map((post) => {
                    const progress = readingProgress[post.id] ?? 0
                    const isFavorite = favoriteIds.includes(post.id)
                    const isDraft = draftIds.includes(post.id)

                    return (
                      <article key={post.id} className="post-card featured-post-card">
                        <div className="card-meta-row">
                          <p className="post-category">{post.category}</p>
                          <div className="badge-row">
                            {isFavorite && <span className="mini-badge favorite">收藏</span>}
                            {isDraft && <span className="mini-badge draft">草稿</span>}
                          </div>
                        </div>
                        <h3>{post.title}</h3>
                        <p>{post.summary}</p>
                        <div className="progress-inline">
                          <div className="progress-bar">
                            <span style={{ width: `${progress}%` }} />
                          </div>
                          <span>{progress}%</span>
                        </div>
                        <div className="post-footer">
                          <span>{post.readTime}</span>
                          <div className="mini-actions">
                            <button type="button" className="card-action-button" onClick={() => toggleFavorite(post.id)}>
                              {isFavorite ? '已收藏' : '收藏'}
                            </button>
                            <button type="button" onClick={() => openPost(post.id)}>
                              阅读文章
                            </button>
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>

                <aside className="reading-dashboard">
                  <p className="eyebrow-alt">阅读台账</p>
                  <div className="reading-dashboard-grid">
                    <div>
                      <strong>{favoriteIds.length}</strong>
                      <span>收藏</span>
                    </div>
                    <div>
                      <strong>{draftIds.length}</strong>
                      <span>草稿</span>
                    </div>
                    <div>
                      <strong>{Math.round(Object.values(readingProgress).reduce((sum, value) => sum + value, 0) / Math.max(Object.keys(readingProgress).length, 1))}%</strong>
                      <span>平均进度</span>
                    </div>
                    <div>
                      <strong>{filteredPosts.length}</strong>
                      <span>筛选结果</span>
                    </div>
                  </div>
                  <button type="button" className="secondary-button dashboard-action" onClick={() => { setStatusFilter('all'); setActiveView('articles'); }}>
                    查看文章列表
                  </button>
                </aside>
              </div>
            </section>

            <section className="insight-row">
              <blockquote className="quote-panel">
                “我更关注的是能不能把难懂的东西讲清楚，并且让后续自己和别人都能继续使用。”
              </blockquote>

              <div className="topic-panel">
                <p className="eyebrow-alt">内容方向</p>
                <ul>
                  {focusAreas.map((topic) => (
                    <li key={topic}>{topic}</li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="about-grid">
              <div className="about-card">
                <p className="eyebrow-alt">写作方向</p>
                <h2>技术学习分享，不只记录答案，也记录过程与整理方式。</h2>
                <p>
                  这里的内容会覆盖技术学习分享、参考文档、小工具实现、随笔写作、读书心得和 Cheatsheet。写作不是为了展示，而是为了对未来的自己保持清晰的理解。
                </p>
              </div>

              <div className="stats-panel" aria-label="Blog statistics">
                {stats.map((stat) => (
                  <div key={stat.label} className="stat-box">
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {activeView === 'category' && (
          <section className="category-layout">
            <div className="category-banner">
              <div>
                <p className="eyebrow-alt">分类页</p>
                <h2>{selectedCategory === '全部' ? '全部分类' : selectedCategory}</h2>
                <p>
                  {selectedCategory === '全部'
                    ? '浏览所有学习、文档、工具和写作内容，按长期积累的结构快速切换。'
                    : (selectedCategoryInfo?.summary ?? '深入浏览这一类主题下的文章与记录。')}
                </p>
              </div>

              <div className="category-banner-stats" aria-label="Category summary stats">
                <div>
                  <strong>{selectedCategory === '全部' ? posts.length : selectedCategoryPosts.length}</strong>
                  <span>篇文章</span>
                </div>
                <div>
                  <strong>{selectedCategory === '全部' ? new Set(posts.flatMap((post) => post.tags)).size : new Set(selectedCategoryPosts.flatMap((post) => post.tags)).size}</strong>
                  <span>标签数</span>
                </div>
              </div>
            </div>

            <div className="category-rail">
              <div className="category-panel">
                <p className="eyebrow-alt">内容模块</p>
                <div className="category-links">
                  <button type="button" className={selectedCategory === '全部' ? 'category-link active' : 'category-link'} onClick={() => { setSelectedCategory('全部'); setSelectedYear('全部'); setSelectedTag('全部'); setSearchTerm(''); setFilterMode('category'); }}>
                    全部内容
                  </button>
                  {contentCategories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      className={selectedCategory === category.name ? 'category-link active' : 'category-link'}
                      onClick={() => openCategory(category.name)}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="category-panel">
                <p className="eyebrow-alt">在此专栏中</p>
                <ul className="category-highlights">
                  {(selectedCategory === '全部' ? posts : selectedCategoryPosts).slice(0, 4).map((post) => (
                    <li key={post.id}>
                      <button type="button" onClick={() => openPost(post.id)}>
                        <strong>{post.title}</strong>
                        <span>{post.readTime}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="category-post-grid">
              {(selectedCategory === '全部' ? posts : selectedCategoryPosts).map((post) => {
                const progress = readingProgress[post.id] ?? 0
                const isFavorite = favoriteIds.includes(post.id)
                const isDraft = draftIds.includes(post.id)

                return (
                  <article key={post.id} className="post-card category-post-card">
                    <div className="card-meta-row">
                      <p className="post-category">{post.category}</p>
                      <div className="badge-row">
                        {isFavorite && <span className="mini-badge favorite">收藏</span>}
                        {isDraft && <span className="mini-badge draft">草稿</span>}
                      </div>
                    </div>
                    <h3>{post.title}</h3>
                    <p>{post.summary}</p>
                    <div className="progress-inline compact">
                      <div className="progress-bar">
                        <span style={{ width: `${progress}%` }} />
                      </div>
                      <span>{progress}%</span>
                    </div>
                    <div className="post-footer">
                      <span>{post.readTime}</span>
                      <div className="mini-actions">
                        <button type="button" className="card-action-button" onClick={() => toggleFavorite(post.id)}>
                          {isFavorite ? '已收藏' : '收藏'}
                        </button>
                        <button type="button" onClick={() => openPost(post.id)}>
                          阅读
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        )}

        {activeView === 'articles' && (
          <section className="journal-layout">
            <div className="journal-banner">
              <div className="journal-banner-copy">
                <p className="eyebrow-alt">文章列表</p>
                <h2>把学习、记录和复用沉淀成一条稳定的写作脉络。</h2>
              </div>
              <div className="journal-banner-chip-row">
                <span>首页</span>
                <span>分类</span>
                <span>文章</span>
              </div>
            </div>

            <aside className="journal-sidebar">
              <div className="section-heading compact">
                <p className="eyebrow-alt">文章筛选</p>
              </div>

              <div className="filter-panel">
                <div className="search-box">
                  <label htmlFor="article-search">搜索</label>
                  <input
                    id="article-search"
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="标题、标签、关键词"
                  />
                </div>

                <div className="filter-tabs">
                  {(['category', 'year', 'tag'] as FilterMode[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      className={filterMode === mode ? 'filter-tab active' : 'filter-tab'}
                      onClick={() => setFilterMode(mode)}
                    >
                      {mode === 'category' ? '分类' : mode === 'year' ? '年份' : '标签'}
                    </button>
                  ))}
                </div>

                <div className="filter-group">{renderFilterPills()}</div>

                <div className="stats-mini">
                  <div>
                    <strong>{filteredPosts.length}</strong>
                    <span>篇文章</span>
                  </div>
                  <div>
                    <strong>{posts.reduce((sum, post) => sum + Number(post.readTime.match(/(\d+)/)?.[1] ?? 0), 0)}</strong>
                    <span>分钟总计</span>
                  </div>
                </div>

                <div className="state-filters" aria-label="Article state filters">
                  {([
                    { key: 'all', label: '全部' },
                    { key: 'favorites', label: '收藏' },
                    { key: 'drafts', label: '草稿' },
                    { key: 'reading', label: '在读' },
                  ] as const).map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      className={statusFilter === option.key ? 'state-filter active' : 'state-filter'}
                      onClick={() => setStatusFilter(option.key)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                {(selectedCategory !== '全部' || selectedYear !== '全部' || selectedTag !== '全部' || searchTerm || statusFilter !== 'all') && (
                  <button type="button" className="clear-filters" onClick={() => { resetFilters(); setStatusFilter('all') }}>
                    清除筛选
                  </button>
                )}
              </div>

              <div className="tag-cloud">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className={selectedTag === tag ? 'tag-pill active' : 'tag-pill'}
                    onClick={() => {
                      setSelectedTag(tag)
                      setSelectedCategory('全部')
                      setSelectedYear('全部')
                      setFilterMode('tag')
                    }}
                  >
                    #{tag}
                  </button>
                ))}
              </div>

              <div className="post-list">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post) => {
                    const progress = readingProgress[post.id] ?? 0
                    const isFavorite = favoriteIds.includes(post.id)
                    const isDraft = draftIds.includes(post.id)

                    return (
                      <button
                        type="button"
                        key={post.id}
                        className={post.id === selectedPost.id ? 'list-item active' : 'list-item'}
                        onClick={() => {
                          setSelectedPostId(post.id)
                          setCurrentSectionIndex(0)
                        }}
                      >
                        <div className="list-top-row">
                          <span>{post.date}</span>
                          <div className="badge-row">
                            {isFavorite && <span className="mini-badge favorite">收藏</span>}
                            {isDraft && <span className="mini-badge draft">草稿</span>}
                          </div>
                        </div>
                        <strong>{highlightText(post.title, normalizedSearch)}</strong>
                        <small>{post.readTime}</small>
                        <p>{highlightText(post.summary, normalizedSearch)}</p>
                        <div className="progress-inline compact">
                          <div className="progress-bar">
                            <span style={{ width: `${progress}%` }} />
                          </div>
                          <span>{progress}%</span>
                        </div>
                      </button>
                    )
                  })
                ) : (
                  <div className="empty-state">
                    <strong>没有匹配的文章</strong>
                    <span>换一个关键词或筛选条件再试一次。</span>
                  </div>
                )}
              </div>
            </aside>

            {filteredPosts.length > 0 ? (
              <article className="article-panel">
                <header className="article-header">
                  <div className="article-header-top">
                    <div>
                      <nav className="breadcrumb" aria-label="Breadcrumb">
                        <button type="button" onClick={() => setActiveView('home')}>首页</button>
                        <span>/</span>
                        <button type="button" onClick={() => setActiveView('articles')}>文章</button>
                        <span>/</span>
                        <span>{selectedPost.category}</span>
                      </nav>
                      <p className="eyebrow-alt">{selectedPost.category}</p>
                      <h2>{selectedPost.title}</h2>
                    </div>

                    <div className="article-header-actions">
                      <button
                        type="button"
                        className={favoriteIds.includes(selectedPost.id) ? 'utility-button active' : 'utility-button'}
                        onClick={() => toggleFavorite(selectedPost.id)}
                      >
                        {favoriteIds.includes(selectedPost.id) ? '已收藏' : '收藏'}
                      </button>
                      <button
                        type="button"
                        className={draftIds.includes(selectedPost.id) ? 'utility-button active' : 'utility-button'}
                        onClick={() => toggleDraft(selectedPost.id)}
                      >
                        {draftIds.includes(selectedPost.id) ? '草稿中' : '保存草稿'}
                      </button>
                    </div>
                  </div>

                  <div className="article-meta-row">
                    <div className="article-meta">
                      <span>{selectedPost.date}</span>
                      <span>{selectedPost.readTime}</span>
                    </div>

                    <div className="article-progress-box">
                      <span>阅读进度</span>
                      <div className="progress-bar">
                        <span style={{ width: `${selectedProgress}%` }} />
                      </div>
                      <strong>{selectedProgress}%</strong>
                    </div>
                  </div>

                  <div className="article-summary-card">
                    <div>
                      <p className="eyebrow-alt">文章摘要</p>
                      <p>{selectedPost.summary}</p>
                    </div>
                    <div className="summary-meta">
                      <span>作者：{authorProfile.name}</span>
                      <span>主题：{selectedPost.category}</span>
                      <span>标签：{selectedPost.tags.join(' / ')}</span>
                    </div>
                  </div>

                  <div className="tag-row">
                    {selectedPost.tags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        className="tag"
                        onClick={() => {
                          setSelectedTag(tag)
                          setSelectedCategory('全部')
                          setSelectedYear('全部')
                          setFilterMode('tag')
                        }}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  <div className="article-actions-row">
                    <button type="button" className="utility-button" onClick={() => adjustProgress(selectedPost.id, -10)}>
                      -10%
                    </button>
                    <button type="button" className="utility-button" onClick={() => adjustProgress(selectedPost.id, 10)}>
                      +10%
                    </button>
                    <button
                      type="button"
                      className="utility-button"
                      onClick={() => {
                        setSelectedPostId(previousArticle.id)
                        setCurrentSectionIndex(0)
                      }}
                    >
                      上一篇
                    </button>
                    <button
                      type="button"
                      className="utility-button"
                      onClick={() => {
                        setSelectedPostId(nextArticle.id)
                        setCurrentSectionIndex(0)
                      }}
                    >
                      下一篇
                    </button>
                  </div>
                </header>

                <div className="article-layout">
                  <nav className="article-toc" aria-label="Article table of contents">
                    <p className="eyebrow-alt">目录</p>
                    {selectedPost.sections.map((section, index) => (
                      <button
                        key={`${section.heading}-${index}`}
                        type="button"
                        className={currentSectionIndex === index ? 'toc-link active' : 'toc-link'}
                        onClick={() => {
                          setCurrentSectionIndex(index)
                          document.getElementById(`article-section-${index}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        }}
                      >
                        {section.heading}
                      </button>
                    ))}
                  </nav>

                  <div className="article-body">
                    {selectedPost.sections.map((section, index) => (
                      <section
                        key={`${section.heading}-${index}`}
                        id={`article-section-${index}`}
                        className={currentSectionIndex === index ? 'article-section active' : 'article-section'}
                      >
                        <h3>{section.heading}</h3>
                        {section.body.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                        {section.checklist && (
                          <ul className="checklist">
                            {section.checklist.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        )}
                        {section.code && <pre className="code-block">{section.code}</pre>}
                      </section>
                    ))}
                  </div>

                  <aside className="article-side-panel">
                    <div className="side-card author-side-card">
                      <p className="eyebrow-alt">作者</p>
                      <h3>{authorProfile.name}</h3>
                      <p>{authorProfile.role}</p>
                      <div className="focus-list">
                        {authorProfile.focus.slice(0, 4).map((focus) => (
                          <span key={focus} className="focus-tag">{focus}</span>
                        ))}
                      </div>
                    </div>

                    <div className="side-card">
                      <p className="eyebrow-alt">阅读状态</p>
                      <div className="side-stat">
                        <strong>{selectedProgress}%</strong>
                        <span>已完成</span>
                      </div>
                    </div>

                    <div className="side-card">
                      <p className="eyebrow-alt">相关标签</p>
                      <div className="tag-cloud compact">
                        {selectedPost.tags.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            className={selectedTag === tag ? 'tag-pill active' : 'tag-pill'}
                            onClick={() => {
                              setSelectedTag(tag)
                              setSelectedCategory('全部')
                              setSelectedYear('全部')
                              setFilterMode('tag')
                            }}
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="side-card">
                      <p className="eyebrow-alt">快速入口</p>
                      <div className="quick-links">
                        <button type="button" className="secondary-button" onClick={() => setActiveView('archive')}>
                          归档页
                        </button>
                        <button type="button" className="secondary-button" onClick={() => setActiveView('articles')}>
                          文章列表
                        </button>
                      </div>
                    </div>
                  </aside>
                </div>
              </article>
            ) : (
              <div className="article-panel empty-article-panel">
                <p className="eyebrow-alt">暂无内容</p>
                <h2>当前筛选条件下没有匹配的文章。</h2>
                <p>试试更换关键字，或清除筛选条件查看全部笔记。</p>
              </div>
            )}
          </section>
        )}

        {activeView === 'library' && (
          <section className="library-layout">
            <div className="archive-intro">
              <p className="eyebrow-alt">我的文库</p>
              <h2>收藏、草稿和阅读进度的专门入口。</h2>
              <p>持续积累的内容，不只是文章清单，而是可继续回看的笔记状态。</p>
            </div>

            <div className="library-grid">
              {[
                { key: 'favorites', label: '收藏', items: favoriteIds.map((id) => posts.find((post) => post.id === id)).filter(Boolean) as Post[] },
                { key: 'drafts', label: '草稿', items: draftIds.map((id) => posts.find((post) => post.id === id)).filter(Boolean) as Post[] },
                {
                  key: 'reading',
                  label: '在读',
                  items: posts.filter((post) => (readingProgress[post.id] ?? 0) > 0),
                },
              ].map((group) => (
                <div key={group.key} className="library-panel">
                  <div className="library-panel-header">
                    <p className="eyebrow-alt">{group.label}</p>
                    <span>{group.items.length}</span>
                  </div>

                  {group.items.length > 0 ? (
                    <ul className="library-list">
                      {group.items.map((post) => (
                        <li key={post.id}>
                          <button type="button" onClick={() => openPost(post.id)}>
                            <strong>{post.title}</strong>
                            <span>{post.category}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="empty-state compact-empty">
                      <strong>暂无内容</strong>
                      <span>这里会显示你的收藏、草稿和阅读记录。</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {activeView === 'archive' && (
          <section className="archive-layout">
            <div className="archive-intro">
              <p className="eyebrow-alt">归档</p>
              <h2>按时间线、分类和标签整理的内容集合。</h2>
              <p>
                这里的内容会持续积累，便于回顾学习过程、检查思路演进，并在未来重新使用这些知识时减少重复探索。
              </p>
            </div>

            <div className="archive-mode-tabs">
              {(['year', 'category', 'tag'] as FilterMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={archiveMode === mode ? 'archive-tab active' : 'archive-tab'}
                  onClick={() => setArchiveMode(mode)}
                >
                  {mode === 'year' ? '按年份' : mode === 'category' ? '按分类' : '按标签'}
                </button>
              ))}
            </div>

            <div className="archive-groups">
              {archiveDisplayGroups.map((group) => (
                <div key={group.name ?? group.year} className="archive-group">
                  <h3>{group.name ?? group.year}</h3>
                  <ul className="archive-list">
                    {group.posts.map((post) => (
                      <li key={post.id}>
                        <button type="button" onClick={() => openPost(post.id)}>
                          <span>{post.date}</span>
                          <strong>{post.title}</strong>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeView === 'author' && (
          <section className="author-layout">
            <div className="author-card profile-card">
              <p className="eyebrow-alt">作者</p>
              <h2>{authorProfile.name}</h2>
              <p className="role-line">{authorProfile.role}</p>
              <p>{authorProfile.bio}</p>
              <ul className="author-meta">
                <li>{authorProfile.location}</li>
                <li>写作以长期可用性为目标</li>
              </ul>
            </div>

            <div className="author-card">
              <p className="eyebrow-alt">关注领域</p>
              <div className="focus-list">
                {authorProfile.focus.map((item) => (
                  <span key={item} className="focus-tag">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="author-card stats-card">
              <p className="eyebrow-alt">数据概览</p>
              <div className="author-stats">
                {authorProfile.stats.map((stat) => (
                  <div key={stat.label} className="author-stat">
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeView === 'about' && (
          <section className="about-layout">
            <div className="about-card broad">
              <p className="eyebrow-alt">关于</p>
              <h2>我希望博客像一本温暖而实用的技术手册，而不是一张浮夸的宣传海报。</h2>
              <p>
                这里的内容更偏工程学习、知识沉淀、文档化整理和反思式写作。很多文章都来自真实的学习过程，有时会附上代码样例、速查清单和工具思路，也会从技术学习分享、参考文档、小工具实现、随笔写作、读书心得和 Cheatsheet 这些板块中持续积累。目标是让阅读者不只看到结论，更能看到“怎么走到结论”。
              </p>
              <p>
                从前端开发、工程协作到 AI 辅助编程，我都在尝试让工作更稳定、知识更持续、交付更清晰。这个博客不是为了制造流量，而是为了让自己和未来的阅读者在面对复杂问题时，能更快地找到参考、判断和下一步行动。
              </p>
              <p>
                我希望内容尽量温和、稳定、可信。就像写一本长期保值的笔记：不追热点，不急着展示，不为了阅读时的刺激而牺牲内容的清晰度。
              </p>
            </div>

            <div className="stats-panel about-stats" aria-label="About statistics">
              {stats.map((stat) => (
                <div key={stat.label} className="stat-box">
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer id="newsletter" className="site-footer">
        <div>
          <p className="eyebrow-alt">保持联系</p>
          <h3>记录小问题、整理大思路。</h3>
        </div>

        <div className="social-links" aria-label="Social links">
          {socials.map((social) => (
            <a key={social.label} href={social.href}>
              {social.label}
            </a>
          ))}
        </div>
      </footer>
    </div>
  )
}

export default App
