const LEGACY_VIEW_PATHS: Record<string, string> = {
  home: '/',
  articles: '/notes',
  category: '/categories/learning',
  library: '/library',
  archive: '/archive',
  author: '/author',
  about: '/about',
}

export function normalizeLegacyUrl() {
  if (typeof window === 'undefined') {
    return
  }

  const { pathname, search, hash } = window.location

  if (pathname !== '/' && pathname !== '') {
    return
  }

  const params = new URLSearchParams(search)
  const postId = params.get('post')
  const view = params.get('view') ?? hash.replace(/^#/, '')

  let nextPath: string | undefined

  if (postId) {
    nextPath = `/notes/${encodeURIComponent(postId)}`
  } else if (view && LEGACY_VIEW_PATHS[view]) {
    nextPath = LEGACY_VIEW_PATHS[view]
  }

  if (!nextPath) {
    return
  }

  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  window.history.replaceState({}, '', `${base}${nextPath}`)
}
