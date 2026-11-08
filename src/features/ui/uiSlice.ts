import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { StatusFilter, ThemeMode } from '@/features/notes/types'

const THEME_STORAGE_KEY = 'blog-theme'
const STATUS_STORAGE_KEY = 'blog-filter-status'

const STATUS_VALUES: StatusFilter[] = ['all', 'favorites', 'drafts', 'reading']

function readStoredValue<T>(key: string): T | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

export function resolveInitialTheme(): ThemeMode {
  const stored = readStoredValue<unknown>(THEME_STORAGE_KEY)

  if (stored === 'light' || stored === 'dark') {
    return stored
  }

  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }

  return 'light'
}

function resolveInitialStatus(): StatusFilter {
  const stored = readStoredValue<unknown>(STATUS_STORAGE_KEY)
  return STATUS_VALUES.includes(stored as StatusFilter) ? (stored as StatusFilter) : 'all'
}

export type UiState = {
  theme: ThemeMode
  libraryStatus: StatusFilter
}

export const initialState: UiState = {
  theme: resolveInitialTheme(),
  libraryStatus: resolveInitialStatus(),
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.theme = action.payload
    },
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
    },
    setLibraryStatus(state, action: PayloadAction<StatusFilter>) {
      state.libraryStatus = action.payload
    },
  },
})

export const { setTheme, toggleTheme, setLibraryStatus } = uiSlice.actions
export default uiSlice.reducer
