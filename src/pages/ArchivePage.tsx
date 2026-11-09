import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  EmptyState,
  ErrorState,
  FilterTabs,
  LoadingSkeleton,
  PageHeader,
  type FilterTabOption,
} from '@/components/common'
import { Button } from '@/components/ui/button'
import { contentCategories } from '@/features/notes/data'
import { listNotes } from '@/features/notes/repository'
import type { ArchiveDisplayGroup, FilterMode, Post } from '@/features/notes/types'
import { useAsyncData } from '@/hooks/useAsyncData'
import { surfaceSoft } from '@/lib/styles'

const ARCHIVE_MODES: ReadonlyArray<FilterTabOption<FilterMode>> = [
  { value: 'year', label: '按年份' },
  { value: 'category', label: '按分类' },
  { value: 'tag', label: '按标签' },
]

const isArchiveMode = (value: string | null): value is FilterMode =>
  value === 'year' || value === 'category' || value === 'tag'

const yearOf = (post: Post) => String(new Date(post.date).getFullYear())

const sortByDateDesc = (posts: Post[]) =>
  [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

function groupNotes(notes: Post[], mode: FilterMode): ArchiveDisplayGroup[] {
  if (mode === 'category') {
    return contentCategories
      .map((category) => ({
        name: category.name,
        posts: sortByDateDesc(notes.filter((post) => post.category === category.name)),
      }))
      .filter((group) => group.posts.length > 0)
  }

  if (mode === 'tag') {
    const tags = Array.from(new Set(notes.flatMap((post) => post.tags))).sort((a, b) =>
      a.localeCompare(b),
    )

    return tags
      .map((tag) => ({
        name: tag,
        posts: sortByDateDesc(notes.filter((post) => post.tags.includes(tag))),
      }))
      .filter((group) => group.posts.length > 0)
  }

  const years = Array.from(new Set(notes.map(yearOf))).sort((a, b) => Number(b) - Number(a))

  return years.map((year) => ({
    year,
    posts: sortByDateDesc(notes.filter((post) => yearOf(post) === year)),
  }))
}

export function ArchivePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const groupParam = searchParams.get('group')
  const archiveMode: FilterMode = isArchiveMode(groupParam) ? groupParam : 'year'

  const setArchiveMode = (mode: FilterMode) => {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current)
        if (mode === 'year') {
          next.delete('group')
        } else {
          next.set('group', mode)
        }
        return next
      },
      { replace: true },
    )
  }

  const { data, error, isLoading, isSuccess, isEmpty, isError, retry } = useAsyncData(
    (signal) => listNotes({}, { signal }),
    { key: 'archive' },
  )

  const archiveDisplayGroups = useMemo(
    () => groupNotes(data ?? [], archiveMode),
    [data, archiveMode],
  )

  return (
    <section className="grid gap-5">
      <PageHeader
        eyebrow="归档"
        title="按时间线、分类和标签整理的内容集合。"
        description="这里的内容会持续积累，便于回顾学习过程、检查思路演进，并在未来重新使用这些知识时减少重复探索。"
      />

      <FilterTabs
        options={ARCHIVE_MODES}
        value={archiveMode}
        onChange={setArchiveMode}
        ariaLabel="归档分组方式"
      />

      {isLoading && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <LoadingSkeleton lines={10} label="正在加载归档" />
        </div>
      )}

      {isError && error && (
        <ErrorState title="归档加载失败" error={error} onRetry={retry} />
      )}

      {isEmpty && (
        <EmptyState
          title="暂时没有可归档的文章"
          description="文章发布后会按年份、分类和标签出现在这里。"
          action={
            <Button asChild variant="outline" size="sm">
              <Link to="/notes">浏览文章列表</Link>
            </Button>
          }
        />
      )}

      {isSuccess && (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[18px]">
          {archiveDisplayGroups.map((group) => {
            const groupKey = group.name ?? group.year ?? '未分组'
            return (
              <div key={groupKey} className={`${surfaceSoft} px-4 py-[18px]`}>
                <h3 className="mb-3 text-foreground">
                  {group.name ?? group.year}
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    {group.posts.length}
                  </span>
                </h3>
                <ul className="m-0 grid list-none gap-2.5 p-0">
                  {group.posts.map((post) => (
                    <li key={post.id}>
                      <Link
                        to={`/notes/${post.id}`}
                        className="block w-full rounded-[14px] border border-border bg-card px-2.5 py-3 text-left transition hover:-translate-y-px"
                      >
                        <span className="text-muted-foreground">{post.date}</span>
                        <strong className="mt-1.5 block leading-[1.5] text-foreground">
                          {post.title}
                        </strong>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
