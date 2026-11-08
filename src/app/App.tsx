import { useEffect, useMemo, useState } from 'react'
import { BackendStatus } from '@/components/layout/BackendStatus'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { PostCard } from '@/features/notes/components/PostCard'
import {
  allTags,
  allYears,
  archiveGroups,
  authorProfile,
  contentCategories,
  focusAreas,
  posts,
  stats,
} from '@/features/notes/data'
import type { ArchiveDisplayGroup, FilterMode, Post, StatusFilter, ThemeMode, ViewMode } from '@/features/notes/types'
import { highlightText, readStoredValue } from '@/features/notes/utils'

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
      <SiteHeader
        theme={theme}
        activeCategory={selectedCategory}
        onNavigate={(view) => {
          setActiveView(view)
          setViewHash(view)
        }}
        onOpenCategory={openCategory}
        onToggleTheme={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
      />

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

            <BackendStatus />

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
                  {posts.slice(0, 3).map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      variant="featured"
                      progress={readingProgress[post.id] ?? 0}
                      isFavorite={favoriteIds.includes(post.id)}
                      isDraft={draftIds.includes(post.id)}
                      onToggleFavorite={toggleFavorite}
                      onOpen={openPost}
                    />
                  ))}
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
              {(selectedCategory === '全部' ? posts : selectedCategoryPosts).map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  variant="category"
                  progress={readingProgress[post.id] ?? 0}
                  isFavorite={favoriteIds.includes(post.id)}
                  isDraft={draftIds.includes(post.id)}
                  onToggleFavorite={toggleFavorite}
                  onOpen={openPost}
                />
              ))}
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

      <SiteFooter />
    </div>
  )
}

export default App
