import { configureStore } from '@reduxjs/toolkit'
import uiReducer, { type UiState } from '@/features/ui/uiSlice'

export function createAppStore(preloadedState?: { ui: UiState }) {
  const store = configureStore({
    reducer: {
      ui: uiReducer,
    },
    preloadedState,
  })

  store.subscribe(() => {
    if (typeof window === 'undefined') {
      return
    }

    const { theme, libraryStatus } = store.getState().ui as UiState

    try {
      window.localStorage.setItem('blog-theme', JSON.stringify(theme))
      window.localStorage.setItem('blog-filter-status', JSON.stringify(libraryStatus))
    } catch {
      // localStorage 不可用时仅保留内存状态。
    }
  })

  return store
}

export const store = createAppStore()

export type AppStore = ReturnType<typeof createAppStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
