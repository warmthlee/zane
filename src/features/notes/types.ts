export type ThemeMode = 'light' | 'dark'

export type ViewMode = 'home' | 'articles' | 'category' | 'archive' | 'about' | 'author' | 'library'

export type FilterMode = 'category' | 'year' | 'tag'

export type StatusFilter = 'all' | 'favorites' | 'drafts' | 'reading'

export type Section = {
  heading: string
  body: string[]
  checklist?: string[]
  code?: string
}

export type Post = {
  id: string
  category: string
  title: string
  summary: string
  readTime: string
  date: string
  tags: string[]
  sections: Section[]
}

export type ContentCategory = {
  id: string
  name: string
  summary: string
}

export type ArchiveGroup = {
  year: string
  posts: Post[]
}

export type ArchiveDisplayGroup = {
  name?: string
  year?: string
  posts: Post[]
}
