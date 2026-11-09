import { Link } from 'react-router-dom'
import {
  EmptyState,
  ErrorState,
  LoadingSkeleton,
  SectionHeader,
} from '@/components/common'
import { BackendStatus } from '@/components/layout/BackendStatus'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PostCard } from '@/features/notes/components/PostCard'
import { contentCategories, focusAreas, stats } from '@/features/notes/data'
import { useLibraryState } from '@/features/notes/libraryContext'
import { countNotes, listRecentNotes } from '@/features/notes/repository'
import { useAsyncData } from '@/hooks/useAsyncData'
import { eyebrow, surface } from '@/lib/styles'

export function HomePage() {
  const library = useLibraryState()
  const {
    data: recentNotes,
    error,
    isLoading,
    isSuccess,
    isEmpty,
    isError,
    retry,
  } = useAsyncData(
    (signal) => listRecentNotes({ limit: 3, signal }),
    { isEmpty: (notes) => notes.length === 0 },
  )

  const { data: noteCount } = useAsyncData((signal) => countNotes({ signal }), {})
  const latestNoteId = recentNotes?.[0]?.id

  const averageProgress = Math.round(
    Object.values(library.readingProgress).reduce((sum, value) => sum + value, 0) /
      Math.max(Object.keys(library.readingProgress).length, 1),
  )

  return (
    <>
      <section className="mb-7 grid gap-[22px] min-[980px]:grid-cols-[1.5fr_0.9fr]">
        <div
          className={`${surface} px-[34px] py-[38px] max-sm:px-4`}
        >
          <p className={eyebrow}>技术学习 · 记录 · 速查</p>
          <h1 className="max-w-[600px] text-balance text-[clamp(2.8rem,6vw,5rem)] leading-[1.08] font-semibold text-foreground">
            把知识整理成可继续前进的东西。
          </h1>
          <p className="mt-[18px] max-w-[620px] text-[1.08rem] leading-[1.85] text-muted-foreground">
            我在这里记录前端工程实践、设计思考和学习过程，整理成适合反复阅读的文档、速查和笔记。目标不是炫技，而是让每次学习都更稳一点。
          </p>

          <div className="mt-7 flex flex-wrap gap-3.5">
            <Button asChild className="h-auto px-5 py-3">
              <Link to={latestNoteId ? `/notes/${latestNoteId}` : '/notes'}>阅读最新笔记</Link>
            </Button>
            <Button asChild variant="outline" className="h-auto px-5 py-3">
              <Link to="/notes">查看全部内容</Link>
            </Button>
          </div>

          <ul
            className="mt-6 flex list-none flex-wrap gap-3.5 p-0 leading-[1.7] text-muted-foreground"
            aria-label="Quick summary"
          >
            {['技术学习分享', '参考文档', '小工具实现', '随笔写作', '读书心得', 'Cheatsheet'].map(
              (item) => (
                <li
                  key={item}
                  className="relative pl-4 before:absolute before:left-0 before:text-brand-text before:content-['•']"
                >
                  {item}
                </li>
              ),
            )}
          </ul>
        </div>

        <aside
          className={`${surface} flex flex-col justify-center bg-linear-to-b from-secondary/70 to-card/75 px-6 py-7`}
          aria-label="Current focus"
        >
          <p className={eyebrow}>重点围绕</p>
          <h2 className="text-[clamp(1.5rem,2vw,2.1rem)] leading-[1.08] font-semibold text-foreground">
            让复杂的技术概念变得更容易理解、更容易复用。
          </h2>
          <div className="mt-7 grid grid-cols-2 gap-[18px] max-sm:grid-cols-1">
            {[
              { label: '本月主题', value: 'TypeScript' },
              { label: '实践方式', value: '写作 + 工具' },
            ].map((item) => (
              <div key={item.label} className="rounded-[18px] border border-border bg-card p-4">
                <span className="mb-2 block text-[0.74rem] tracking-[0.08em] text-muted-foreground uppercase">
                  {item.label}
                </span>
                <strong className="text-[0.98rem] text-foreground">{item.value}</strong>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <BackendStatus />

      <section className="mt-[42px]">
        <SectionHeader
          title="内容板块"
          className="mb-5"
          action={
            <Button variant="link" size="sm" asChild>
              <Link to="/archive">查看归档</Link>
            </Button>
          }
        />

        <div className="grid gap-[22px] min-[980px]:grid-cols-3">
          {contentCategories.map((category) => (
            <Link
              key={category.id}
              to={`/categories/${category.id}`}
              className="block rounded-[28px] border border-border bg-card/75 p-[22px_20px] text-left text-inherit no-underline shadow-elevation transition hover:-translate-y-px"
            >
              <div className="mb-3.5 flex items-center gap-3">
                <span
                  className="grid size-8 place-items-center rounded-[10px] bg-primary text-[0.8rem] font-bold text-primary-foreground"
                  aria-hidden="true"
                >
                  {category.name.slice(0, 1)}
                </span>
                <span className="text-[0.72rem] tracking-[0.08em] text-brand-text uppercase">
                  {category.name}
                </span>
              </div>
              <h3 className="mb-2.5 text-[clamp(1.2rem,1.8vw,1.6rem)] leading-[1.38] font-semibold text-foreground">
                {category.name}
              </h3>
              <p className="m-0 leading-[1.75] text-muted-foreground">{category.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-[42px]">
        <SectionHeader
          title="精选内容"
          className="mb-5"
          action={
            <Button variant="link" size="sm" asChild>
              <Link to="/notes">查看全部文章</Link>
            </Button>
          }
        />

        <div className="grid gap-[22px] min-[980px]:grid-cols-[minmax(0,1.5fr)_minmax(260px,0.7fr)]">
          <div className="grid gap-[22px] min-[980px]:grid-cols-3">
            {isLoading && (
              <Card className="col-span-full p-5">
                <LoadingSkeleton lines={6} label="正在加载精选内容" />
              </Card>
            )}

            {isError && error && (
              <ErrorState
                className="col-span-full"
                title="精选内容加载失败"
                error={error}
                onRetry={retry}
              />
            )}

            {isEmpty && (
              <EmptyState
                className="col-span-full"
                title="还没有可展示的文章"
                description="发布第一篇笔记后，这里会出现最近更新。"
                action={
                  <Button asChild variant="outline" size="sm">
                    <Link to="/notes">浏览文章列表</Link>
                  </Button>
                }
              />
            )}

            {isSuccess &&
              recentNotes?.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  variant="featured"
                  progress={library.readingProgress[post.id] ?? 0}
                  isFavorite={library.favoriteIds.includes(post.id)}
                  isDraft={library.draftIds.includes(post.id)}
                  onToggleFavorite={library.toggleFavorite}
                />
              ))}
          </div>

          <Card
            className="grid gap-[18px] border-border bg-card/75 px-[18px] py-[22px] shadow-elevation"
            role="region"
            aria-label="阅读台账"
          >
            <p className={eyebrow}>阅读台账</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: library.favoriteIds.length, label: '收藏' },
                { value: library.draftIds.length, label: '草稿' },
                { value: `${averageProgress}%`, label: '平均进度' },
                { value: noteCount ?? '—', label: '文章总数' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="grid gap-1.5 rounded-[18px] border border-border bg-card px-3 py-3.5"
                >
                  <strong className="text-[1.2rem] text-foreground">{item.value}</strong>
                  <span className="text-[0.72rem] tracking-[0.08em] text-muted-foreground uppercase">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
            <Button asChild variant="outline" className="h-auto w-full">
              <Link to="/notes">查看文章列表</Link>
            </Button>
          </Card>
        </div>
      </section>

      <section className="mt-[42px] grid gap-[22px] min-[980px]:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <blockquote
          className={`${surface} m-0 px-[22px] py-6 text-[clamp(1.4rem,2.8vw,2.2rem)] leading-[1.4] font-semibold text-foreground`}
        >
          “我更关注的是能不能把难懂的东西讲清楚，并且让后续自己和别人都能继续使用。”
        </blockquote>

        <div className={`${surface} px-[22px] py-6`}>
          <p className={eyebrow}>内容方向</p>
          <ul className="m-0 flex list-none flex-wrap gap-3 p-0">
            {focusAreas.map((topic) => (
              <li
                key={topic}
                className="rounded-full border border-border bg-muted px-[0.9rem] py-[0.7rem] text-muted-foreground"
              >
                {topic}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-[42px] grid gap-[22px] min-[980px]:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)]">
        <div className={`${surface} px-[22px] py-6`}>
          <p className={eyebrow}>写作方向</p>
          <h2 className="mb-3.5 text-[clamp(2rem,3vw,2.7rem)] leading-[1.1] font-semibold text-foreground">
            技术学习分享，不只记录答案，也记录过程与整理方式。
          </h2>
          <p className="m-0 leading-[1.85] text-muted-foreground">
            这里的内容会覆盖技术学习分享、参考文档、小工具实现、随笔写作、读书心得和 Cheatsheet。写作不是为了展示，而是为了对未来的自己保持清晰的理解。
          </p>
        </div>

        <div
          className={`${surface} grid grid-cols-3 gap-[18px] p-[18px] max-sm:grid-cols-1`}
          aria-label="Blog statistics"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="grid gap-2.5 border border-border bg-card px-4 py-[18px]"
            >
              <strong className="text-[clamp(1.5rem,2vw,2rem)] text-foreground">
                {stat.value}
              </strong>
              <span className="text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
