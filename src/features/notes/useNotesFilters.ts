import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { setLibraryStatus } from '@/features/ui/uiSlice'
import { allTags, allYears, contentCategories } from './data'
import type { ListNotesParams } from './repository'
import type { FilterMode, StatusFilter } from './types'

export const ALL_FILTER = '全部'

export type NotesFilterState = {
  query: string
  category: string
  year: string
  tag: string
  status: StatusFilter
  mode: FilterMode
}

type LibrarySnapshot = {
  favoriteIds: string[]
  draftIds: string[]
  readingProgress: Record<string, number>
}

const STATUS_VALUES: StatusFilter[] = ['all', 'favorites', 'drafts', 'reading']
const MODE_VALUES: FilterMode[] = ['category', 'year', 'tag']
const FILTER_PARAM_KEYS = ['q', 'category', 'year', 'tag', 'status', 'mode'] as const

const isDefaultValue = (
  key: keyof NotesFilterState,
  value: string,
  defaultStatus: StatusFilter,
) => {
  if (key === 'query') {
    return value === ''
  }

  if (key === 'status') {
    return value === defaultStatus
  }

  if (key === 'mode') {
    return value === 'category'
  }

  return value === ALL_FILTER
}

const readFilter = (searchParams: URLSearchParams, defaultStatus: StatusFilter): NotesFilterState => {
  const status = searchParams.get('status') as StatusFilter | null
  const mode = searchParams.get('mode') as FilterMode | null

  return {
    query: searchParams.get('q') ?? '',
    category: searchParams.get('category') ?? ALL_FILTER,
    year: searchParams.get('year') ?? ALL_FILTER,
    tag: searchParams.get('tag') ?? ALL_FILTER,
    status: status && STATUS_VALUES.includes(status) ? status : defaultStatus,
    mode: mode && MODE_VALUES.includes(mode) ? mode : 'category',
  }
}

export function useNotesFilters(library: LibrarySnapshot) {
  const [searchParams, setSearchParams] = useSearchParams()
  const dispatch = useAppDispatch()
  const defaultStatus = useAppSelector((state) => state.ui.libraryStatus)
  const filters = useMemo(
    () => readFilter(searchParams, defaultStatus),
    [searchParams, defaultStatus],
  )

  const setFilters = (patch: Partial<NotesFilterState>) => {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current)
        const keys: Array<keyof NotesFilterState> = ['query', 'category', 'year', 'tag', 'status', 'mode']

        for (const key of keys) {
          const value = patch[key]
          if (value === undefined) {
            continue
          }

          const paramKey = key === 'query' ? 'q' : key
          if (isDefaultValue(key, value, defaultStatus)) {
            next.delete(paramKey)
          } else {
            next.set(paramKey, value)
          }
        }

        return next
      },
      { replace: true },
    )

    if (patch.status !== undefined) {
      dispatch(setLibraryStatus(patch.status))
    }
  }

  const resetFilters = () => {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current)
        for (const key of FILTER_PARAM_KEYS) {
          next.delete(key)
        }
        return next
      },
      { replace: true },
    )

    dispatch(setLibraryStatus('all'))
  }

  const selectFilterOption = (option: string) => {
    if (filters.mode === 'year') {
      setFilters({ year: option, category: ALL_FILTER, tag: ALL_FILTER })
      return
    }

    if (filters.mode === 'tag') {
      setFilters({ tag: option, category: ALL_FILTER, year: ALL_FILTER })
      return
    }

    setFilters({ category: option, year: ALL_FILTER, tag: ALL_FILTER })
  }

  const selectTag = (tag: string) => {
    setFilters({ tag, category: ALL_FILTER, year: ALL_FILTER, mode: 'tag' })
  }

  const filterOptions = useMemo(() => {
    if (filters.mode === 'year') {
      return [ALL_FILTER, ...allYears]
    }

    if (filters.mode === 'tag') {
      return [ALL_FILTER, ...allTags]
    }

    return [ALL_FILTER, ...contentCategories.map((category) => category.name)]
  }, [filters.mode])

  const listParams = useMemo<ListNotesParams>(
    () => ({
      q: filters.query || undefined,
      category: filters.category === ALL_FILTER ? undefined : filters.category,
      year: filters.year === ALL_FILTER ? undefined : filters.year,
      tag: filters.tag === ALL_FILTER ? undefined : filters.tag,
      status: filters.status === 'all' ? undefined : filters.status,
      favoriteIds: library.favoriteIds,
      draftIds: library.draftIds,
      readingProgress: library.readingProgress,
    }),
    [filters, library.draftIds, library.favoriteIds, library.readingProgress],
  )

  const listKey = useMemo(() => JSON.stringify(listParams), [listParams])

  const hasActiveFilters =
    filters.query !== '' ||
    filters.category !== ALL_FILTER ||
    filters.year !== ALL_FILTER ||
    filters.tag !== ALL_FILTER ||
    filters.status !== 'all'

  return {
    filters,
    filterOptions,
    normalizedQuery: filters.query.trim().toLowerCase(),
    hasActiveFilters,
    listParams,
    listKey,
    setFilters,
    resetFilters,
    selectFilterOption,
    selectTag,
  }
}
