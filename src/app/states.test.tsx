import { Provider } from 'react-redux'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { setNotesRepositoryMode } from '@/features/notes/repository'
import { appRoutes } from './routes'
import { createAppStore } from './store'

vi.mock('@/api-client/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api-client/client')>()
  return {
    ...actual,
    getHealth: vi.fn(() => new Promise(() => undefined)),
  }
})

beforeEach(() => {
  setNotesRepositoryMode('success')
})

function renderRoute(path: string) {
  const store = createAppStore({
    ui: { theme: 'light', libraryStatus: 'all' },
  })
  const router = createMemoryRouter(appRoutes, { initialEntries: [path] })

  render(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>,
  )
}

describe('empty and error states', () => {
  it('shows the notes empty state', async () => {
    setNotesRepositoryMode('empty')
    renderRoute('/notes')

    expect(await screen.findByText('暂时没有文章')).toBeInTheDocument()
  })

  it('shows the repository error with a retry action', async () => {
    setNotesRepositoryMode('error')
    renderRoute('/notes')

    expect(await screen.findByText('文章列表加载失败')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '重试' })).toBeInTheDocument()
  })

  it('shows three empty library groups when nothing is stored', async () => {
    localStorage.setItem('blog-favorites', '[]')
    localStorage.setItem('blog-drafts', '[]')
    localStorage.setItem('blog-progress', '{}')
    renderRoute('/library')

    expect(await screen.findByText('暂无收藏')).toBeInTheDocument()
    expect(screen.getByText('暂无草稿')).toBeInTheDocument()
    expect(screen.getByText('暂无在读文章')).toBeInTheDocument()
    expect(screen.getAllByLabelText('0 篇')).toHaveLength(3)
  })

  it('shows the home empty state for recent notes', async () => {
    setNotesRepositoryMode('empty')
    renderRoute('/')

    expect(await screen.findByText('还没有可展示的文章')).toBeInTheDocument()
  })

  it('shows the archive empty state', async () => {
    setNotesRepositoryMode('empty')
    renderRoute('/archive')

    expect(await screen.findByText('暂时没有可归档的文章')).toBeInTheDocument()
  })
})
