import { Provider } from 'react-redux'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { appRoutes } from './routes'
import { createAppStore } from './store'

vi.mock('@/api-client/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api-client/client')>()
  return {
    ...actual,
    getHealth: vi.fn(() => new Promise(() => undefined)),
  }
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

  return router
}

describe('route rendering', () => {
  it('renders the home page', () => {
    renderRoute('/')
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: '把知识整理成可继续前进的东西。',
      }),
    ).toBeInTheDocument()
  })

  it('renders the notes list and the empty detail panel', () => {
    renderRoute('/notes')

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: '把学习、记录和复用沉淀成一条稳定的写作脉络。',
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('选择一篇笔记开始阅读。')).toBeInTheDocument()
  })

  it('renders a note detail after loading', async () => {
    renderRoute('/notes/typescript-utility-types')

    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: /TypeScript Utility Types/,
      }),
    ).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Article table of contents' })).toBeInTheDocument()
  })

  it('renders the category page', async () => {
    renderRoute('/categories/learning')

    expect(
      await screen.findByRole('heading', { level: 1, name: '技术学习分享' }),
    ).toBeInTheDocument()
    expect(await screen.findByRole('link', { name: /#TypeScript/ })).toBeInTheDocument()
  })

  it('renders the library page', async () => {
    renderRoute('/library')
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: '收藏、草稿和阅读进度的专门入口。',
      }),
    ).toBeInTheDocument()
  })

  it('renders the archive page', () => {
    renderRoute('/archive')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      '按时间线、分类和标签整理的内容集合。',
    )
  })

  it('renders the author page', () => {
    renderRoute('/author')
    expect(screen.getByRole('heading', { level: 1, name: 'Zane' })).toBeInTheDocument()
  })

  it('renders the about page', () => {
    renderRoute('/about')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('我希望博客像一本')
  })

  it('renders 404 for unknown routes', () => {
    renderRoute('/missing-page')
    expect(
      screen.getByRole('heading', { level: 1, name: '这个页面不存在。' }),
    ).toBeInTheDocument()
  })

  it('renders 404 for invalid categories', async () => {
    renderRoute('/categories/not-a-category')
    expect(
      await screen.findByRole('heading', { level: 1, name: '这个页面不存在。' }),
    ).toBeInTheDocument()
  })

  it('keeps the invalid category URL intact', async () => {
    const router = renderRoute('/categories/not-a-category')
    await screen.findByRole('heading', { level: 1, name: '这个页面不存在。' })
    expect(router.state.location.pathname).toBe('/categories/not-a-category')
  })
})
