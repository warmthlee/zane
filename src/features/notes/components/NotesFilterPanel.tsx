import { FilterTabs, SearchField, TagPill } from '@/components/common'
import { Button } from '@/components/ui/button'
import { surface } from '@/lib/styles'
import type { FilterMode, Post, StatusFilter } from '../types'
import type { NotesFilterState } from '../useNotesFilters'

type NotesFilterPanelProps = {
  filters: NotesFilterState
  filterOptions: string[]
  posts: Post[]
  hasActiveFilters: boolean
  setFilters: (patch: Partial<NotesFilterState>) => void
  selectFilterOption: (option: string) => void
  resetFilters: () => void
}

const FILTER_MODES: Array<{ mode: FilterMode; label: string }> = [
  { mode: 'category', label: '分类' },
  { mode: 'year', label: '年份' },
  { mode: 'tag', label: '标签' },
]

const STATUS_FILTERS: Array<{ key: StatusFilter; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'favorites', label: '收藏' },
  { key: 'drafts', label: '草稿' },
  { key: 'reading', label: '在读' },
]

const getSelectedOption = (filters: NotesFilterState) => {
  if (filters.mode === 'year') {
    return filters.year
  }

  if (filters.mode === 'tag') {
    return filters.tag
  }

  return filters.category
}

export function NotesFilterPanel({
  filters,
  filterOptions,
  posts,
  hasActiveFilters,
  setFilters,
  selectFilterOption,
  resetFilters,
}: NotesFilterPanelProps) {
  const selectedOption = getSelectedOption(filters)
  const totalReadMinutes = posts.reduce(
    (sum, post) => sum + Number(post.readTime.match(/(\d+)/)?.[1] ?? 0),
    0,
  )

  return (
    <div className={`${surface} grid gap-[18px] p-[18px]`}>
      <SearchField
        id="article-search"
        label="搜索"
        value={filters.query}
        onChange={(query) => setFilters({ query })}
        placeholder="标题、标签、关键词"
      />

      <FilterTabs
        options={FILTER_MODES.map((item) => ({ value: item.mode, label: item.label }))}
        value={filters.mode}
        onChange={(mode) => setFilters({ mode })}
        ariaLabel="筛选维度"
      />

      <div className="flex flex-wrap gap-2">
        {filterOptions.map((option) => (
          <TagPill
            key={option}
            active={selectedOption === option}
            onClick={() => selectFilterOption(option)}
          >
            {option}
          </TagPill>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="grid gap-1.5 rounded-2xl border border-border bg-card p-[12px_14px]">
          <strong className="text-[1.15rem] text-foreground">{posts.length}</strong>
          <span className="text-xs text-muted-foreground">篇文章</span>
        </div>
        <div className="grid gap-1.5 rounded-2xl border border-border bg-card p-[12px_14px]">
          <strong className="text-[1.15rem] text-foreground">{totalReadMinutes}</strong>
          <span className="text-xs text-muted-foreground">分钟总计</span>
        </div>
      </div>

      <FilterTabs
        options={STATUS_FILTERS.map((option) => ({
          value: option.key,
          label: option.label,
        }))}
        value={filters.status}
        onChange={(status) => setFilters({ status })}
        ariaLabel="文章状态筛选"
      />

      {hasActiveFilters && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={resetFilters}
          className="w-fit rounded-full"
        >
          清除筛选
        </Button>
      )}
    </div>
  )
}
