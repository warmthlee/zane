import { Provider } from 'react-redux'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
}

describe('accessibility semantics', () => {
  it('exposes landmarks, one h1 and a labelled main navigation', () => {
    renderRoute('/')

    // header 元素在 section 内应为分区标题；DOM 角色映射会把所有 header 都标为 banner，
    // 因此这里断言站点 banner 存在并包含主导航。
    expect(screen.getAllByRole('banner').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)

    const nav = screen.getByRole('navigation', { name: 'Main navigation' })
    expect(screen.getAllByRole('banner')[0]).toContainElement(nav)
    expect(within(nav).getAllByRole('link')).toHaveLength(7)
    expect(within(nav).getByRole('link', { name: '首页' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('labels theme control and quick summary', () => {
    renderRoute('/')

    expect(screen.getByRole('button', { name: 'Toggle theme' })).toHaveAttribute(
      'aria-label',
      'Toggle theme',
    )
    expect(screen.getByRole('list', { name: 'Quick summary' })).toBeInTheDocument()
  })

  it('moves keyboard focus from the brand to the theme button', async () => {
    const user = userEvent.setup()
    renderRoute('/')

    const toggle = screen.getByRole('button', { name: 'Toggle theme' })

    await user.tab()
    expect(document.activeElement).toHaveTextContent('zane blog')

    for (let index = 0; index < 12 && document.activeElement !== toggle; index += 1) {
      await user.tab()
    }

    expect(toggle).toHaveFocus()
  })

  it('labels the article navigation, table of contents and copy control', async () => {
    renderRoute('/notes/typescript-utility-types')

    await screen.findByRole('heading', {
      level: 2,
      name: /TypeScript Utility Types/,
    })

    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument()
    expect(
      screen.getByRole('navigation', { name: 'Article table of contents' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /复制第 \d+ 段代码/ }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '收藏' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })
})
