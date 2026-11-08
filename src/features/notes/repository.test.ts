import { beforeEach, describe, expect, it } from 'vitest'
import { posts } from './data'
import {
  countNotes,
  getNote,
  listNotes,
  listRecentNotes,
  setNotesRepositoryMode,
} from './repository'

const options = { delayMs: 0 }

beforeEach(() => {
  setNotesRepositoryMode('success')
})

describe('countNotes', () => {
  it('returns the total note count', async () => {
    await expect(countNotes(options)).resolves.toBe(posts.length)
  })

  it('returns zero in empty mode and rejects in error mode', async () => {
    setNotesRepositoryMode('empty')
    await expect(countNotes(options)).resolves.toBe(0)

    setNotesRepositoryMode('error')
    await expect(countNotes(options)).rejects.toThrow('笔记数据暂时无法加载')
  })
})

describe('listNotes', () => {
  it('returns every note without filters', async () => {
    await expect(listNotes({}, options)).resolves.toHaveLength(posts.length)
  })

  it('filters by category', async () => {
    const notes = await listNotes({ category: '技术学习分享' }, options)
    expect(notes).toHaveLength(3)
    expect(notes.every((note) => note.category === '技术学习分享')).toBe(true)
  })

  it('matches the query against title, summary, category and tags', async () => {
    const byTag = await listNotes({ q: 'react' }, options)
    expect(byTag.map((note) => note.id)).toContain('react-state-patterns')

    const byCategory = await listNotes({ q: '读书心得' }, options)
    expect(byCategory.map((note) => note.id)).toEqual(['reading-notes'])

    const byTitle = await listNotes({ q: 'UTILITY TYPES' }, options)
    expect(byTitle.map((note) => note.id)).toEqual(['typescript-utility-types'])
  })

  it('filters by year and tag', async () => {
    await expect(listNotes({ year: '2026' }, options)).resolves.toHaveLength(posts.length)
    await expect(listNotes({ year: '2025' }, options)).resolves.toEqual([])

    const tagged = await listNotes({ tag: 'React' }, options)
    expect(tagged.map((note) => note.id)).toEqual(['react-state-patterns'])
  })

  it('filters by library status using the provided snapshot', async () => {
    const favorites = await listNotes(
      { status: 'favorites', favoriteIds: ['typescript-utility-types'] },
      options,
    )
    expect(favorites.map((note) => note.id)).toEqual(['typescript-utility-types'])

    const drafts = await listNotes(
      { status: 'drafts', draftIds: ['react-state-patterns'] },
      options,
    )
    expect(drafts.map((note) => note.id)).toEqual(['react-state-patterns'])

    const reading = await listNotes(
      { status: 'reading', readingProgress: { 'vite-deploy-checklist': 25 } },
      options,
    )
    expect(reading.map((note) => note.id)).toEqual(['vite-deploy-checklist'])
  })

  it('returns an empty list in the empty test mode', async () => {
    setNotesRepositoryMode('empty')
    await expect(listNotes({}, options)).resolves.toEqual([])
  })

  it('rejects in the error test mode', async () => {
    setNotesRepositoryMode('error')
    await expect(listNotes({}, options)).rejects.toThrow('笔记数据暂时无法加载')
  })
})

describe('getNote', () => {
  it('returns a note by id', async () => {
    const note = await getNote('typescript-utility-types', options)
    expect(note?.title).toContain('TypeScript Utility Types')
  })

  it('returns null for unknown ids and in empty mode', async () => {
    await expect(getNote('missing', options)).resolves.toBeNull()

    setNotesRepositoryMode('empty')
    await expect(getNote('typescript-utility-types', options)).resolves.toBeNull()
  })

  it('rejects in the error test mode', async () => {
    setNotesRepositoryMode('error')
    await expect(getNote('typescript-utility-types', options)).rejects.toThrow(
      '笔记数据暂时无法加载',
    )
  })
})

describe('listRecentNotes', () => {
  it('limits the result', async () => {
    const recent = await listRecentNotes({ limit: 2, delayMs: 0 })
    expect(recent).toHaveLength(2)
    expect(recent[0].id).toBe(posts[0].id)
  })
})
