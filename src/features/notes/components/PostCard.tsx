import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import type { Post } from '@/features/notes/types'
import {
  eyebrow,
  miniBadge,
  miniBadgeDraft,
  miniBadgeFavorite,
  progressBar,
  progressFill,
  surface,
} from '@/lib/styles'
import { cn } from '@/lib/utils'

type PostCardProps = {
  post: Post
  progress: number
  isFavorite: boolean
  isDraft: boolean
  variant: 'featured' | 'category'
  onToggleFavorite: (postId: string) => void
}

export function PostCard({
  post,
  progress,
  isFavorite,
  isDraft,
  onToggleFavorite,
}: PostCardProps) {
  return (
    <article className={cn(surface, 'flex h-full flex-col gap-3.5 px-5 py-[22px]')}>
      <div className="flex items-center justify-between gap-2.5 max-sm:flex-col max-sm:items-start">
        <p className={eyebrow}>{post.category}</p>
        <div className="flex flex-wrap gap-2">
          {isFavorite && (
            <span className={cn(miniBadge, miniBadgeFavorite)}>收藏</span>
          )}
          {isDraft && <span className={cn(miniBadge, miniBadgeDraft)}>草稿</span>}
        </div>
      </div>
      <h3 className="m-0 text-[clamp(1.3rem,2vw,1.8rem)] leading-[1.38] font-semibold text-foreground">
        {post.title}
      </h3>
      <p className="m-0 leading-[1.75] text-muted-foreground">{post.summary}</p>
      <div className="flex items-center justify-between gap-2.5 text-xs text-muted-foreground">
        <div className={progressBar}>
          <span className={progressFill} style={{ width: `${progress}%` }} />
        </div>
        <span className="shrink-0">{progress}%</span>
      </div>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2.5 text-sm text-brand-text max-sm:flex-col max-sm:items-start">
        <span className="whitespace-nowrap">{post.readTime}</span>
        <div className="ml-auto flex items-center gap-2 max-sm:ml-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-pressed={isFavorite}
            onClick={() => onToggleFavorite(post.id)}
          >
            {isFavorite ? '已收藏' : '收藏'}
          </Button>
          <Button asChild size="sm">
            <Link to={`/notes/${post.id}`}>阅读</Link>
          </Button>
        </div>
      </div>
    </article>
  )
}
