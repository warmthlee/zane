import { useEffect, useState, type ReactNode } from 'react'
import { LibraryStateContext, type ReadingProgress } from './libraryContext'
import { readStoredValue } from './utils'

export function LibraryStateProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() =>
    readStoredValue<string[]>('blog-favorites', ['typescript-utility-types']),
  )
  const [draftIds, setDraftIds] = useState<string[]>(() =>
    readStoredValue<string[]>('blog-drafts', ['react-state-patterns']),
  )
  const [readingProgress, setReadingProgress] = useState<ReadingProgress>(() =>
    readStoredValue<ReadingProgress>('blog-progress', {
      'typescript-utility-types': 40,
      'react-state-patterns': 65,
      'vite-deploy-checklist': 25,
    }),
  )

  useEffect(() => {
    window.localStorage.setItem('blog-favorites', JSON.stringify(favoriteIds))
  }, [favoriteIds])

  useEffect(() => {
    window.localStorage.setItem('blog-drafts', JSON.stringify(draftIds))
  }, [draftIds])

  useEffect(() => {
    window.localStorage.setItem('blog-progress', JSON.stringify(readingProgress))
  }, [readingProgress])

  const toggleFavorite = (postId: string) => {
    setFavoriteIds((current) =>
      current.includes(postId) ? current.filter((id) => id !== postId) : [...current, postId],
    )
  }

  const toggleDraft = (postId: string) => {
    setDraftIds((current) =>
      current.includes(postId) ? current.filter((id) => id !== postId) : [...current, postId],
    )
  }

  const adjustProgress = (postId: string, delta: number) => {
    setReadingProgress((current) => {
      const previous = current[postId] ?? 0
      return { ...current, [postId]: Math.min(100, Math.max(0, previous + delta)) }
    })
  }

  return (
    <LibraryStateContext.Provider
      value={{ favoriteIds, draftIds, readingProgress, toggleFavorite, toggleDraft, adjustProgress }}
    >
      {children}
    </LibraryStateContext.Provider>
  )
}
