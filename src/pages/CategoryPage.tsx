import { Link, useParams } from 'react-router-dom'
import {
  EmptyState,
  ErrorState,
  LoadingSkeleton,
  PageHeader,
  SectionHeader,
} from '@/components/common'
import { Button } from '@/components/ui/button'
import { PostCard } from '@/features/notes/components/PostCard'
import { contentCategories } from '@/features/notes/data'
import { useLibraryState } from '@/features/notes/libraryContext'
import { listNotes } from '@/features/notes/repository'
import { useAsyncData } from '@/hooks/useAsyncData'
import { surfaceSoft } from '@/lib/styles'
import { cn } from '@/lib/utils'
import { NotFoundPage } from './NotFoundPage'

const categoryLinkClassName =
  'rounded-full border border-border bg-card px-[0.8rem] py-[0.55rem] text-foreground transition hover:-translate-y-px'
const categoryLinkActiveClassName = 'border-primary/40 bg-secondary'

export function CategoryPage() {
  const { categoryId } = useParams()
  const library = useLibraryState()

  const isAll = !categoryId || categoryId === 'all'
  const category = isAll ? null : contentCategories.find((item) => item.id === categoryId)
  const isInvalid = !isAll && !category

  const { data, error, isLoading, isSuccess, isEmpty, isError, retry } = useAsyncData(
    (signal) =>
      listNotes(category ? { category: category.name } : {}, { signal }),
    { key: categoryId ?? 'all' },
  )

  if (isInvalid) {
    return <NotFoundPage />
  }

  const notes = data ?? []
  const selectedCategory = category?.name ?? '全部'
  const tagCounts = new Map<string, number>()
  for (const post of notes) {
    for (const tag of post.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1)
    }
  }
  const tagStats = Array.from(tagCounts, ([tag, count]) => ({ tag, count })).sort(
    (a, b) => b.count - a.count || a.tag.localeCompare(b.tag),
  )
  const title = selectedCategory === '全部' ? '全部分类' : selectedCategory
  const description =
    selectedCategory === '全部'
      ? '浏览所有学习、文档、工具和写作内容，按长期积累的结构快速切换。'
      : (category?.summary ?? '深入浏览这一类主题下的文章与记录。')

  return (
    <>
      <PageHeader
        eyebrow="分类页"
        title={title}
        description={description}
        actions={
          <div className="grid min-w-[220px] grid-cols-2 gap-3" aria-label="分类统计">
            <div className="grid gap-1.5 rounded-[18px] border border-border bg-card p-[16px_14px]">
              <strong className="text-[1.4rem] text-foreground">
                {isLoading ? '—' : notes.length}
              </strong>
              <span className="text-[0.7rem] tracking-[0.08em] text-muted-foreground uppercase">
                篇文章
              </span>
            </div>
            <div className="grid gap-1.5 rounded-[18px] border border-border bg-card p-[16px_14px]">
              <strong className="text-[1.4rem] text-foreground">
                {isLoading ? '—' : tagStats.length}
              </strong>
              <span className="text-[0.7rem] tracking-[0.08em] text-muted-foreground uppercase">
                标签数
              </span>
            </div>
          </div>
        }
      />

      <section className="mt-[42px] grid gap-[22px]" aria-label={`${title}文章`}>
        <div className="grid gap-[22px] min-[980px]:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)]">
          <div className={`${surfaceSoft} grid gap-[18px] p-[18px]`}>
            <SectionHeader eyebrow="内容模块" />
            <div className="flex flex-wrap gap-2.5">
              <Link
                to="/categories/all"
                className={cn(
                  categoryLinkClassName,
                  isAll && categoryLinkActiveClassName,
                )}
                aria-current={isAll ? 'page' : undefined}
              >
                全部内容
              </Link>
              {contentCategories.map((item) => {
                const isCurrent = categoryId === item.id
                return (
                  <Link
                    key={item.id}
                    to={`/categories/${item.id}`}
                    className={cn(
                      categoryLinkClassName,
                      isCurrent && categoryLinkActiveClassName,
                    )}
                    aria-current={isCurrent ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>

            <SectionHeader eyebrow="标签统计" className="mt-5" />
            {tagStats.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {tagStats.map(({ tag, count }) => (
                  <Link
                    key={tag}
                    to={`/notes?tag=${encodeURIComponent(tag)}&mode=tag`}
                    className="inline-flex items-center rounded-full border border-border bg-card/75 px-3 py-2 text-sm text-foreground transition hover:-translate-y-px"
                    aria-label={`#${tag}，${count} 篇文章`}
                  >
                    #{tag} <span className="ml-1 text-xs text-muted-foreground">{count}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">暂无标签统计。</p>
            )}
          </div>

          <div className={`${surfaceSoft} grid gap-[18px] p-[18px]`}>
            <SectionHeader eyebrow="在此专栏中" />
            {isLoading && <LoadingSkeleton lines={4} label="正在加载分类文章" />}
            {isSuccess && (
              <ul className="m-0 grid list-none gap-2.5 p-0">
                {notes.slice(0, 4).map((post) => (
                  <li
                    key={post.id}
                    className="rounded-2xl border border-border bg-card"
                  >
                    <Link
                      to={`/notes/${post.id}`}
                      className="grid w-full gap-1 px-3.5 py-3 text-left text-foreground"
                    >
                      <strong className="text-[0.96rem]">{post.title}</strong>
                      <span className="text-xs text-muted-foreground">{post.readTime}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {isEmpty && (
              <p className="text-sm text-muted-foreground">这个分类下还没有文章。</p>
            )}
          </div>
        </div>

        {isLoading && (
          <div className="rounded-2xl border border-border bg-card p-6">
            <LoadingSkeleton lines={8} label="正在加载文章网格" />
          </div>
        )}

        {isError && error && (
          <ErrorState title="分类文章加载失败" error={error} onRetry={retry} />
        )}

        {isEmpty && (
          <EmptyState
            title="这个分类下还没有文章"
            description="可以切换到其他分类，或回到全部文章继续浏览。"
            action={
              <Button asChild variant="outline" size="sm">
                <Link to="/notes">浏览全部文章</Link>
              </Button>
            }
          />
        )}

        {isSuccess && (
          <div className="grid gap-[22px] min-[980px]:grid-cols-3">
            {notes.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                variant="category"
                progress={library.readingProgress[post.id] ?? 0}
                isFavorite={library.favoriteIds.includes(post.id)}
                isDraft={library.draftIds.includes(post.id)}
                onToggleFavorite={library.toggleFavorite}
              />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
