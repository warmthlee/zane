import { cn } from '@/lib/utils'
import {
  eyebrow,
  pill,
  pillActive,
  secondaryButton,
} from '@/lib/styles'
import { authorProfile } from '../data'
import type { Post } from '../types'

type NoteSidePanelProps = {
  post: Post
  progress: number
  selectedTag: string
  onSelectTag: (tag: string) => void
  onNavigateArchive: () => void
  onNavigateNotes: () => void
}

const sideCardClassName = 'grid gap-2.5 rounded-2xl border border-border bg-card p-[14px_12px]'

export function NoteSidePanel({
  post,
  progress,
  selectedTag,
  onSelectTag,
  onNavigateArchive,
  onNavigateNotes,
}: NoteSidePanelProps) {
  return (
    <aside className="sticky top-[100px] grid gap-3.5 self-start rounded-[20px] border border-border bg-card p-3.5 max-[980px]:static">
      <div className={sideCardClassName}>
        <p className={eyebrow}>作者</p>
        <h3 className="m-0 text-foreground">{authorProfile.name}</h3>
        <p className="m-0 leading-[1.7] text-muted-foreground">{authorProfile.role}</p>
        <div className="flex flex-wrap gap-2">
          {authorProfile.focus.slice(0, 4).map((focus) => (
            <span
              key={focus}
              className="inline-flex rounded-full border border-border bg-muted px-[0.72rem] py-[0.46rem] text-foreground"
            >
              {focus}
            </span>
          ))}
        </div>
      </div>

      <div className={sideCardClassName}>
        <p className={eyebrow}>阅读状态</p>
        <div className="grid gap-1.5">
          <strong className="text-[1.8rem] text-foreground">{progress}%</strong>
          <span className="text-xs text-muted-foreground">已完成</span>
        </div>
      </div>

      <div className={sideCardClassName}>
        <p className={eyebrow}>相关标签</p>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={cn(pill, selectedTag === tag && pillActive)}
              aria-pressed={selectedTag === tag}
              onClick={() => onSelectTag(tag)}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      <div className={sideCardClassName}>
        <p className={eyebrow}>快速入口</p>
        <div className="grid gap-2">
          <button type="button" className={secondaryButton} onClick={onNavigateArchive}>
            归档页
          </button>
          <button type="button" className={secondaryButton} onClick={onNavigateNotes}>
            文章列表
          </button>
        </div>
      </div>
    </aside>
  )
}
