import { useParams, useSearchParams } from 'react-router-dom'
import { EmptyState, ErrorState, LoadingSkeleton, SectionHeader, TagPill } from '@/components/common'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAsyncData } from '@/hooks/useAsyncData'
import { surface } from '@/lib/styles'
import { allTags } from '../data'
import { useLibraryState } from '../libraryContext'
import { listNotes } from '../repository'
import { useNotesFilters } from '../useNotesFilters'
import { NotesFilterPanel } from './NotesFilterPanel'
import { NotesList } from './NotesList'

export function NotesSidebar() {
  const { noteId } = useParams()
  const [searchParams] = useSearchParams()
  const library = useLibraryState()
  const {
    filters,
    filterOptions,
    normalizedQuery,
    hasActiveFilters,
    listParams,
    listKey,
    setFilters,
    resetFilters,
    selectFilterOption,
    selectTag,
  } = useNotesFilters(library)

  const { data, error, isLoading, isSuccess, isEmpty, isError, retry } = useAsyncData(
    (signal) => listNotes(listParams, { signal }),
    { key: listKey },
  )

  const notes = data ?? []
  const search = searchParams.toString()
  const linkSearch = search ? `?${search}` : ''

  return (
    <aside className={`${surface} grid gap-[18px] p-[18px]`}>
      <SectionHeader eyebrow="文章筛选" className="mb-2" />

      <NotesFilterPanel
        filters={filters}
        filterOptions={filterOptions}
        posts={notes}
        hasActiveFilters={hasActiveFilters}
        setFilters={setFilters}
        selectFilterOption={selectFilterOption}
        resetFilters={resetFilters}
      />

      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => (
          <TagPill key={tag} active={filters.tag === tag} onClick={() => selectTag(tag)}>
            #{tag}
          </TagPill>
        ))}
      </div>

      {isLoading && (
        <Card className="p-4">
          <LoadingSkeleton lines={8} label="正在加载文章列表" />
        </Card>
      )}

      {isError && error && (
        <ErrorState title="文章列表加载失败" error={error} onRetry={retry} />
      )}

      {isEmpty && (
        <EmptyState
          title={hasActiveFilters ? '没有匹配的文章' : '暂时没有文章'}
          description={
            hasActiveFilters
              ? '换一个关键词或筛选条件再试一次。'
              : '笔记发布后会出现在这里。'
          }
          action={
            hasActiveFilters && (
              <Button type="button" variant="outline" size="sm" onClick={resetFilters}>
                清除筛选
              </Button>
            )
          }
        />
      )}

      {isSuccess && (
        <NotesList
          posts={notes}
          selectedPostId={noteId}
          query={normalizedQuery}
          favoriteIds={library.favoriteIds}
          draftIds={library.draftIds}
          readingProgress={library.readingProgress}
          search={linkSearch}
        />
      )}
    </aside>
  )
}
