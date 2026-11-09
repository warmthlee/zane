import { Provider } from 'react-redux'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { resolveInitialTheme } from '@/features/ui/uiSlice'
import { appRoutes } from './routes'
import { createAppStore } from './store'

vi.mock('@/api-client/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api-client/client')>()
  return {
    ...actual,
    getHealth: vi.fn(() => new Promise(() => undefined)),
  }
})

const createMediaQueryList = (matches: boolean) => ({
  matches,
  media: '(prefers-color-scheme: dark)',
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}) as unknown as MediaQueryList

beforeEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove('dark')
  vi.mocked(window.matchMedia).mockReturnValue(createMediaQueryList(false))
})

function renderApp(theme: 'light' | 'dark') {
  const store = createAppStore({ ui: { theme, libraryStatus: 'all' } })
  const router = createMemoryRouter(appRoutes, { initialEntries: ['/'] })

  render(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>,
  )

  return store
}

describe('theme persistence', () => {
  it('toggles the theme, applies the dark class and writes localStorage', async () => {
    const user = userEvent.setup()
    const store = renderApp('light')

    expect(screen.getByRole('button', { name: 'Toggle theme' })).toHaveTextContent('深色')

    await user.click(screen.getByRole('button', { name: 'Toggle theme' }))

    expect(store.getState().ui.theme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('blog-theme')).toBe(JSON.stringify('dark'))
    expect(screen.getByRole('button', { name: 'Toggle theme' })).toHaveTextContent('浅色')
  })

  it('restores a stored theme before system preference', () => {
    localStorage.setItem('blog-theme', JSON.stringify('dark'))
    expect(resolveInitialTheme()).toBe('dark')

    localStorage.setItem('blog-theme', JSON.stringify('light'))
    expect(resolveInitialTheme()).toBe('light')
  })

  it('falls back to prefers-color-scheme when nothing is stored', () => {
    vi.mocked(window.matchMedia).mockReturnValue(createMediaQueryList(true))

    expect(resolveInitialTheme()).toBe('dark')
  })

  it('keeps the dark class in sync when the stored theme is dark', async () => {
    renderApp('dark')

    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })
  })
})
