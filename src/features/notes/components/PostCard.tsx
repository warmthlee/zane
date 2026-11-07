import type { Post } from '@/features/notes/types'

type PostCardProps = {
  post: Post
  progress: number
  isFavorite: boolean
  isDraft: boolean
  variant: 'featured' | 'category'
  onToggleFavorite: (postId: string) => void
  onOpen: (postId: string) => void
}

export function PostCard({ post, progress, isFavorite, isDraft, variant, onToggleFavorite, onOpen }: PostCardProps) {
  const isFeatured = variant === 'featured'

  return (
    <article className={isFeatured ? 'post-card featured-post-card' : 'post-card category-post-card'}>
      <div className="card-meta-row">
        <p className="post-category">{post.category}</p>
        <div className="badge-row">
          {isFavorite && <span className="mini-badge favorite">收藏</span>}
          {isDraft && <span className="mini-badge draft">草稿</span>}
        </div>
      </div>
      <h3>{post.title}</h3>
      <p>{post.summary}</p>
      <div className={isFeatured ? 'progress-inline' : 'progress-inline compact'}>
        <div className="progress-bar">
          <span style={{ width: `${progress}%` }} />
        </div>
        <span>{progress}%</span>
      </div>
      <div className="post-footer">
        <span>{post.readTime}</span>
        <div className="mini-actions">
          <button type="button" className="card-action-button" onClick={() => onToggleFavorite(post.id)}>
            {isFavorite ? '已收藏' : '收藏'}
          </button>
          <button type="button" onClick={() => onOpen(post.id)}>
            {isFeatured ? '阅读文章' : '阅读'}
          </button>
        </div>
      </div>
    </article>
  )
}
