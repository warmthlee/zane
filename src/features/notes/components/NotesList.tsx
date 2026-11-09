import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import {
  miniBadge,
  miniBadgeDraft,
  miniBadgeFavorite,
  progressBar,
  progressFill,
} from '@/lib/styles'
import type { Post } from '../types'
import { highlightText } from '../utils'

type NotesListProps = {
  posts: Post[]
  selectedPostId?: string
  query: string
  favoriteIds: string[]
  draftIds: string[]
  readingProgress: Record<string, number>
  search: string
}

export function NotesList({
  posts,
  selectedPostId,
  query,
  favoriteIds,
  draftIds,
  readingProgress,
  search,
}: NotesListProps) {
  return (
    <div className="grid gap-3">
      {posts.map((post) => {
        const progress = readingProgress[post.id] ?? 0
        const isFavorite = favoriteIds.includes(post.id)
        const isDraft = draftIds.includes(post.id)

        return (
          <Link
            key={post.id}
            to={{ pathname: `/notes/${post.id}`, search }}
            className={cn(
              'block w-full rounded-[22px] border border-border bg-card/75 p-[16px_14px] text-left text-foreground no-underline transition hover:-translate-y-px hover:bg-secondary/60',
              post.id === selectedPostId &&
                'border-primary bg-secondary',
            )}
            aria-current={post.id === selectedPostId ? 'page' : undefined}
          >
            <div className="flex items-center justify-between gap-2.5 max-sm:flex-col max-sm:items-start">
              <span>{post.date}</span>
              <div className="flex flex-wrap gap-2">
                {isFavorite && (
                  <span className={cn(miniBadge, miniBadgeFavorite)}>收藏</span>
                )}
                {isDraft && <span className={cn(miniBadge, miniBadgeDraft)}>草稿</span>}
              </div>
            </div>
            <strong className="my-2 block leading-[1.5] text-foreground">
              {highlightText(post.title, query)}
            </strong>
            <small className="text-muted-foreground">{post.readTime}</small>
            <p className="mb-2 text-[0.82rem] leading-[1.6] text-muted-foreground">
              {highlightText(post.summary, query)}
            </p>
            <div className="flex items-center justify-between gap-2.5 text-[0.7rem] text-muted-foreground">
              <div className={progressBar}>
                <span className={progressFill} style={{ width: `${progress}%` }} />
              </div>
              <span className="shrink-0">{progress}%</span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
