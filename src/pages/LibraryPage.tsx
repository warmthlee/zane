import { Link } from 'react-router-dom'
import {
  EmptyState,
  ErrorState,
  LoadingSkeleton,
  PageHeader,
  SectionHeader,
} from '@/components/common'
import { useLibraryState } from '@/features/notes/libraryContext'
import { listNotes } from '@/features/notes/repository'
import type { Post } from '@/features/notes/types'
import { useAsyncData } from '@/hooks/useAsyncData'
import { surfaceSoft } from '@/lib/styles'

type LibraryGroup = {
  key: 'favorites' | 'drafts' | 'reading'
  label: string
  description: string
  emptyTitle: string
  items: Post[]
}

export function LibraryPage() {
  const library = useLibraryState()
  const { data, error, isLoading, isSuccess, isEmpty, isError, retry } = useAsyncData(
    (signal) => listNotes({}, { signal }),
    { key: 'library' },
  )

  const notes = data ?? []
  const notesById = new Map(notes.map((post) => [post.id, post]))

  const groups: LibraryGroup[] = [
    {
      key: 'favorites',
      label: '收藏',
      description: '稍后重读的文章',
      emptyTitle: '暂无收藏',
      items: library.favoriteIds
        .map((id) => notesById.get(id))
        .filter((post): post is Post => Boolean(post)),
    },
    {
      key: 'drafts',
      label: '草稿',
      description: '还需要继续整理的内容',
      emptyTitle: '暂无草稿',
      items: library.draftIds
        .map((id) => notesById.get(id))
        .filter((post): post is Post => Boolean(post)),
    },
    {
      key: 'reading',
      label: '在读',
      description: '已经记录阅读进度的文章',
      emptyTitle: '暂无在读文章',
      items: notes.filter((post) => (library.readingProgress[post.id] ?? 0) > 0),
    },
  ]

  return (
    <section className="grid gap-5">
      <PageHeader
        eyebrow="我的文库"
        title="收藏、草稿和阅读进度的专门入口。"
        description="持续积累的内容，不只是文章清单，而是可继续回看的笔记状态。"
      />

      {isLoading && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <LoadingSkeleton lines={10} label="正在加载文库" />
        </div>
      )}

      {isError && error && (
        <ErrorState title="文库加载失败" error={error} onRetry={retry} />
      )}

      {(isSuccess || isEmpty) && (
        <div className="grid gap-[22px] min-[980px]:grid-cols-3">
          {groups.map((group) => (
            <div key={group.key} className={`${surfaceSoft} grid gap-3.5 p-[18px]`}>
              <div className="flex items-center justify-between gap-2.5">
                <div>
                  <SectionHeader eyebrow={group.label} />
                  <p className="text-xs text-muted-foreground">{group.description}</p>
                </div>
                <span
                  className="inline-grid size-[30px] place-items-center rounded-full bg-secondary font-bold text-foreground"
                  aria-label={`${group.items.length} 篇`}
                >
                  {group.items.length}
                </span>
              </div>

              {group.items.length > 0 ? (
                <ul className="m-0 grid list-none gap-3 p-0">
                  {group.items.map((post) => {
                    const progress = library.readingProgress[post.id] ?? 0
                    return (
                      <li key={post.id}>
                        <Link
                          to={`/notes/${post.id}`}
                          className="grid w-full gap-1.5 rounded-2xl border border-border bg-card px-2.5 py-3 text-left text-foreground transition hover:-translate-y-px"
                        >
                          <strong className="leading-[1.5]">{post.title}</strong>
                          <span className="text-muted-foreground">
                            {post.category}
                            {group.key === 'reading' ? ` · ${progress}%` : ''}
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <EmptyState
                  title={group.emptyTitle}
                  description="阅读文章时可以加入收藏、标记草稿或记录进度。"
                  className="border-0 bg-transparent px-2 py-6"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
