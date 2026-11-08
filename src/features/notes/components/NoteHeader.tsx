import { cn } from '@/lib/utils'
import { eyebrow, eyebrowCompact, pill, pillActive, progressBar, progressFill } from '@/lib/styles'
import { authorProfile } from '../data'
import type { Post } from '../types'

type NoteHeaderProps = {
  post: Post
  progress: number
  isFavorite: boolean
  isDraft: boolean
  previousPost: Post
  nextPost: Post
  onToggleFavorite: () => void
  onToggleDraft: () => void
  onAdjustProgress: (delta: number) => void
  onOpenPost: (postId: string) => void
  onSelectTag: (tag: string) => void
  onNavigateHome: () => void
  onNavigateNotes: () => void
}

const tagClassName =
  'inline-flex items-center rounded-full border border-border bg-secondary px-[0.8rem] py-[0.38rem] text-[0.72rem] tracking-[0.06em] uppercase text-foreground transition hover:-translate-y-px'

export function NoteHeader({
  post,
  progress,
  isFavorite,
  isDraft,
  previousPost,
  nextPost,
  onToggleFavorite,
  onToggleDraft,
  onAdjustProgress,
  onOpenPost,
  onSelectTag,
  onNavigateHome,
  onNavigateNotes,
}: NoteHeaderProps) {
  return (
    <header>
      <div className="flex items-start justify-between gap-2.5 max-sm:flex-col">
        <div>
          <nav
            className="mb-2.5 flex items-center gap-2 text-[0.76rem] tracking-[0.08em] text-muted-foreground uppercase"
            aria-label="Breadcrumb"
          >
            <button
              type="button"
              className="text-muted-foreground transition hover:text-foreground"
              onClick={onNavigateHome}
            >
              首页
            </button>
            <span>/</span>
            <button
              type="button"
              className="text-muted-foreground transition hover:text-foreground"
              onClick={onNavigateNotes}
            >
              文章
            </button>
            <span>/</span>
            <span className="text-foreground">{post.category}</span>
          </nav>
          <p className={eyebrow}>{post.category}</p>
          <h2 className="mt-1 text-[clamp(2rem,4vw,3rem)] leading-[1.08] font-semibold text-foreground">
            {post.title}
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={cn(pill, isFavorite && pillActive)}
            aria-pressed={isFavorite}
            onClick={onToggleFavorite}
          >
            {isFavorite ? '已收藏' : '收藏'}
          </button>
          <button
            type="button"
            className={cn(pill, isDraft && pillActive)}
            aria-pressed={isDraft}
            onClick={onToggleDraft}
          >
            {isDraft ? '草稿中' : '保存草稿'}
          </button>
        </div>
      </div>

      <div className="mt-[18px] flex items-center justify-between gap-2.5 max-sm:flex-col max-sm:items-start">
        <div className="flex flex-wrap gap-4 text-muted-foreground">
          <span>{post.date}</span>
          <span>{post.readTime}</span>
        </div>

        <div className="grid min-w-[170px] gap-2">
          <span className="text-muted-foreground">阅读进度</span>
          <div className={progressBar}>
            <span className={progressFill} style={{ width: `${progress}%` }} />
          </div>
          <strong className="text-[0.74rem] tracking-[0.08em] text-muted-foreground uppercase">
            {progress}%
          </strong>
        </div>
      </div>

      <div className="mt-[18px] grid gap-3 rounded-[22px] border border-border bg-linear-to-br from-primary/5 to-primary/[0.02] px-5 py-[18px]">
        <div>
          <p className={eyebrowCompact}>文章摘要</p>
          <p className="m-0 leading-[1.8] text-foreground">{post.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2.5 text-xs text-muted-foreground">
          <span>作者：{authorProfile.name}</span>
          <span>主题：{post.category}</span>
          <span>标签：{post.tags.join(' / ')}</span>
        </div>
      </div>

      <div className="mt-[18px] flex flex-wrap gap-2.5">
        {post.tags.map((tag) => (
          <button
            key={tag}
            type="button"
            className={tagClassName}
            onClick={() => onSelectTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="mt-[18px] flex flex-wrap justify-start gap-2.5 max-sm:flex-col max-sm:items-start">
        <button type="button" className={pill} onClick={() => onAdjustProgress(-10)}>
          -10%
        </button>
        <button type="button" className={pill} onClick={() => onAdjustProgress(10)}>
          +10%
        </button>
        <button type="button" className={pill} onClick={() => onOpenPost(previousPost.id)}>
          上一篇
        </button>
        <button type="button" className={pill} onClick={() => onOpenPost(nextPost.id)}>
          下一篇
        </button>
      </div>
    </header>
  )
}
