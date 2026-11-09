import { createContext, useContext } from 'react'

export type ReadingProgress = Record<string, number>

export type LibraryStateValue = {
  favoriteIds: string[]
  draftIds: string[]
  readingProgress: ReadingProgress
  toggleFavorite: (postId: string) => void
  toggleDraft: (postId: string) => void
  adjustProgress: (postId: string, delta: number) => void
}

export const LibraryStateContext = createContext<LibraryStateValue | null>(null)

export function useLibraryState() {
  const context = useContext(LibraryStateContext)

  if (!context) {
    throw new Error('useLibraryState 必须在 LibraryStateProvider 内使用')
  }

  return context
}
