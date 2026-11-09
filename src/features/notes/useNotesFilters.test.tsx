import { Provider } from 'react-redux'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { createAppStore } from '@/app/store'
import { useNotesFilters } from './useNotesFilters'

const library = {
  favoriteIds: ['typescript-utility-types'],
  draftIds: ['react-state-patterns'],
  readingProgress: { 'vite-deploy-checklist': 25 },
}

function FiltersHarness() {
  const location = useLocation()
  const filters = useNotesFilters(library)

  return (
    <div>
      <output data-testid="state">{JSON.stringify(filters.filters)}</output>
      <output data-testid="params">{JSON.stringify(filters.listParams)}</output>
      <output data-testid="search">{location.search}</output>
      <button type="button" onClick={() => filters.setFilters({ query: 'vite' })}>
        set query
      </button>
      <button type="button" onClick={() => filters.setFilters({ query: '' })}>
        clear query
      </button>
      <button type="button" onClick={() => filters.selectTag('React')}>
        select tag
      </button>
      <button type="button" onClick={filters.resetFilters}>
        reset
      </button>
    </div>
  )
}

function renderHarness(initialEntry: string) {
  const store = createAppStore({ ui: { theme: 'light', libraryStatus: 'all' } })
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <FiltersHarness />
      </MemoryRouter>
    </Provider>,
  )
  return store
}

const readState = () => JSON.parse(screen.getByTestId('state').textContent ?? '{}')
const readParams = () => JSON.parse(screen.getByTestId('params').textContent ?? '{}')
const readSearch = () => screen.getByTestId('search').textContent ?? ''

describe('useNotesFilters', () => {
  it('reads filters from the URL and builds repository params', () => {
    renderHarness(
      '/notes?q=react&category=%E6%8A%80%E6%9C%AF%E5%AD%A6%E4%B9%A0%E5%88%86%E4%BA%AB&year=2026&tag=React&status=favorites&mode=tag',
    )

    expect(readState()).toEqual({
      query: 'react',
      category: '技术学习分享',
      year: '2026',
      tag: 'React',
      status: 'favorites',
      mode: 'tag',
    })
    expect(readParams()).toEqual({
      q: 'react',
      category: '技术学习分享',
      year: '2026',
      tag: 'React',
      status: 'favorites',
      favoriteIds: library.favoriteIds,
      draftIds: library.draftIds,
      readingProgress: library.readingProgress,
    })
  })

  it('writes filter changes to the URL and removes cleared values', async () => {
    const user = userEvent.setup()
    renderHarness('/notes?category=%E5%8F%82%E8%80%83%E6%96%87%E6%A1%A3&mode=category')

    await user.click(screen.getByRole('button', { name: 'set query' }))
    expect(new URLSearchParams(readSearch()).get('q')).toBe('vite')
    expect(new URLSearchParams(readSearch()).get('category')).toBe('参考文档')

    await user.click(screen.getByRole('button', { name: 'clear query' }))
    expect(new URLSearchParams(readSearch()).has('q')).toBe(false)
    expect(new URLSearchParams(readSearch()).get('category')).toBe('参考文档')
  })

  it('selecting a tag switches mode and clears other dimensions', async () => {
    const user = userEvent.setup()
    renderHarness('/notes?category=%E5%8F%82%E8%80%83%E6%96%87%E6%A1%A3&mode=category')

    await user.click(screen.getByRole('button', { name: 'select tag' }))
    const params = new URLSearchParams(readSearch())

    expect(params.get('tag')).toBe('React')
    expect(params.get('mode')).toBe('tag')
    expect(params.has('category')).toBe(false)
    expect(params.has('year')).toBe(false)
  })

  it('reset clears every filter and restores the default status', async () => {
    const user = userEvent.setup()
    const store = renderHarness(
      '/notes?q=react&tag=React&status=favorites&mode=tag',
    )

    await user.click(screen.getByRole('button', { name: 'reset' }))

    expect(readSearch()).toBe('')
    expect(store.getState().ui.libraryStatus).toBe('all')
    expect(readState().status).toBe('all')
  })
})
