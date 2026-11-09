import { posts } from './data'
import type { Post, StatusFilter } from './types'

/**
 * 页面阶段的 notes 数据入口。
 * 未来替换点：后端 NOTE-01～03 落地后，用 src/api-client 的生成客户端
 * 替换本文件的 listNotes / getNote / listRecentNotes，页面只依赖函数签名。
 * 页面不直接读取 data.ts；data.ts 只作为 mock 数据源。
 *
 * 可控失败测试缝：
 * sessionStorage.setItem('zane-notes-repository-mode', 'error' | 'empty')
 */
const MODE_STORAGE_KEY = 'zane-notes-repository-mode'
const DEFAULT_DELAY_MS = 250
const NO_FILTER = '全部'

export type NotesRepositoryMode = 'success' | 'error' | 'empty'

export function setNotesRepositoryMode(mode: NotesRepositoryMode) {
  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem(MODE_STORAGE_KEY, mode)
  }
}

function readMode(): NotesRepositoryMode {
  if (typeof window === 'undefined') {
    return 'success'
  }

  const value = window.sessionStorage.getItem(MODE_STORAGE_KEY)
  return value === 'error' || value === 'empty' ? value : 'success'
}

function wait(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('请求已取消', 'AbortError'))
      return
    }

    const timer = window.setTimeout(() => {
      signal?.removeEventListener('abort', onAbort)
      resolve()
    }, ms)

    const onAbort = () => {
      window.clearTimeout(timer)
      reject(signal?.reason ?? new DOMException('请求已取消', 'AbortError'))
    }

    signal?.addEventListener('abort', onAbort, { once: true })
  })
}

async function simulateRequest(delayMs: number, signal?: AbortSignal) {
  await wait(delayMs, signal)

  const mode = readMode()
  if (mode === 'error') {
    throw new Error('笔记数据暂时无法加载（mock）。')
  }

  return mode
}

export type NotesRequestOptions = {
  signal?: AbortSignal
  delayMs?: number
}

export type ListNotesParams = {
  q?: string
  category?: string
  year?: string
  tag?: string
  status?: StatusFilter
  favoriteIds?: readonly string[]
  draftIds?: readonly string[]
  readingProgress?: Readonly<Record<string, number>>
}

const matchesFilter = (value: string | undefined, candidate: string) =>
  !value || value === NO_FILTER || value === candidate

function filterNotes(params: ListNotesParams): Post[] {
  const query = params.q?.trim().toLowerCase() ?? ''
  const status = params.status ?? 'all'

  return posts.filter((post) => {
    if (!matchesFilter(params.category, post.category)) {
      return false
    }

    if (!matchesFilter(params.year, String(new Date(post.date).getFullYear()))) {
      return false
    }

    if (params.tag && params.tag !== NO_FILTER && !post.tags.includes(params.tag)) {
      return false
    }

    if (status === 'favorites' && !(params.favoriteIds ?? []).includes(post.id)) {
      return false
    }

    if (status === 'drafts' && !(params.draftIds ?? []).includes(post.id)) {
      return false
    }

    if (status === 'reading' && (params.readingProgress?.[post.id] ?? 0) <= 0) {
      return false
    }

    if (!query) {
      return true
    }

    const searchTarget =
      `${post.title} ${post.summary} ${post.category} ${post.tags.join(' ')}`.toLowerCase()
    return searchTarget.includes(query)
  })
}

export async function listNotes(
  params: ListNotesParams = {},
  { signal, delayMs = DEFAULT_DELAY_MS }: NotesRequestOptions = {},
): Promise<Post[]> {
  const mode = await simulateRequest(delayMs, signal)
  if (mode === 'empty') {
    return []
  }

  return filterNotes(params)
}

export async function getNote(
  id: string,
  { signal, delayMs = DEFAULT_DELAY_MS }: NotesRequestOptions = {},
): Promise<Post | null> {
  const mode = await simulateRequest(delayMs, signal)
  if (mode === 'empty') {
    return null
  }

  return posts.find((post) => post.id === id) ?? null
}

export type ListRecentNotesOptions = {
  limit?: number
  signal?: AbortSignal
  delayMs?: number
}

export async function listRecentNotes({
  limit = 3,
  signal,
  delayMs = DEFAULT_DELAY_MS,
}: ListRecentNotesOptions = {}): Promise<Post[]> {
  const notes = await listNotes({}, { signal, delayMs })
  return notes.slice(0, limit)
}

export async function countNotes({
  signal,
  delayMs = DEFAULT_DELAY_MS,
}: NotesRequestOptions = {}): Promise<number> {
  const mode = await simulateRequest(delayMs, signal)
  return mode === 'empty' ? 0 : posts.length
}
