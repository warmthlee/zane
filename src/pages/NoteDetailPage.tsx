import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { EmptyState, ErrorState, LoadingSkeleton } from '@/components/common'
import { Button } from '@/components/ui/button'
import { NoteBody } from '@/features/notes/components/NoteBody'
import { NoteHeader } from '@/features/notes/components/NoteHeader'
import { NoteSidePanel } from '@/features/notes/components/NoteSidePanel'
import { useLibraryState } from '@/features/notes/libraryContext'
import { getNote, listNotes } from '@/features/notes/repository'
import { useNotesFilters } from '@/features/notes/useNotesFilters'
import { useAsyncData } from '@/hooks/useAsyncData'
import { surface } from '@/lib/styles'

export function NoteDetailPage() {
  const { noteId } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const library = useLibraryState()
  const { filters, listParams, listKey, selectTag } = useNotesFilters(library)

  const detail = useAsyncData(
    (signal) => getNote(noteId ?? '', { signal }),
    { key: noteId ?? '', isEmpty: (note) => note === null },
  )

  // 上下篇沿用列表筛选结果；失败或未加载时不阻塞正文，退回当前文章。
  const neighbors = useAsyncData(
    (signal) => listNotes(listParams, { signal }),
    { key: listKey },
  )

  const post = detail.data ?? null

  if (detail.isLoading) {
    return (
      <div className={`${surface} px-[26px] py-7`}>
        <LoadingSkeleton lines={10} label="正在加载笔记" />
      </div>
    )
  }

  if (detail.isError && detail.error) {
    return (
      <div className={`${surface} px-[26px] py-7`}>
        <ErrorState
          title="笔记加载失败"
          error={detail.error}
          onRetry={detail.retry}
        />
      </div>
    )
  }

  if (!post) {
    return (
      <div className={`${surface} px-[26px] py-7`}>
        <EmptyState
          title="这篇笔记不存在或已被移除。"
          description="请从左侧列表重新选择一篇文章，或返回文章列表。"
          action={
            <Button asChild variant="outline" size="sm">
              <Link to="/notes">返回文章列表</Link>
            </Button>
          }
        />
      </div>
    )
  }

  const navigationPosts = neighbors.data ?? []
  const currentIndex = navigationPosts.findIndex((candidate) => candidate.id === post.id)
  const previousPost =
    currentIndex > 0
      ? navigationPosts[currentIndex - 1]
      : (navigationPosts[navigationPosts.length - 1] ?? post)
  const nextPost =
    currentIndex >= 0 && currentIndex < navigationPosts.length - 1
      ? navigationPosts[currentIndex + 1]
      : (navigationPosts[0] ?? post)

  const progress = library.readingProgress[post.id] ?? 0

  const search = searchParams.toString()
  const openPost = (postId: string) => {
    navigate({ pathname: `/notes/${postId}`, search })
  }

  return (
    <article className={`${surface} px-[26px] py-7 max-sm:px-4`}>
      <NoteHeader
        post={post}
        progress={progress}
        isFavorite={library.favoriteIds.includes(post.id)}
        isDraft={library.draftIds.includes(post.id)}
        previousPost={previousPost}
        nextPost={nextPost}
        onToggleFavorite={() => library.toggleFavorite(post.id)}
        onToggleDraft={() => library.toggleDraft(post.id)}
        onAdjustProgress={(delta) => library.adjustProgress(post.id, delta)}
        onOpenPost={openPost}
        onSelectTag={selectTag}
        onNavigateHome={() => navigate('/')}
        onNavigateNotes={() => navigate({ pathname: '/notes', search })}
      />

      <div className="mt-[30px] grid gap-[26px] min-[980px]:grid-cols-[220px_minmax(0,1fr)_220px]">
        <NoteBody key={post.id} post={post} />
        <NoteSidePanel
          post={post}
          progress={progress}
          selectedTag={filters.tag}
          onSelectTag={selectTag}
          onNavigateArchive={() => navigate('/archive')}
          onNavigateNotes={() => navigate({ pathname: '/notes', search })}
        />
      </div>
    </article>
  )
}
