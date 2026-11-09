import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { LibraryStateProvider } from '@/features/notes/LibraryState'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { toggleTheme } from '@/features/ui/uiSlice'

export function AppLayout() {
  const theme = useAppSelector((state) => state.ui.theme)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.style.colorScheme = theme
  }, [theme])

  return (
    <LibraryStateProvider>
      <div
        className="mx-auto w-full max-w-[1180px] px-6 pt-7 pb-12 max-sm:px-3 max-sm:pt-4"
        data-theme={theme}
      >
        <SiteHeader theme={theme} onToggleTheme={() => dispatch(toggleTheme())} />

        <main className="pt-7">
          <Outlet />
        </main>

        <SiteFooter />
      </div>
    </LibraryStateProvider>
  )
}
