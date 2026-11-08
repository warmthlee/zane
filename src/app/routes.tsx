import type { RouteObject } from 'react-router-dom'
import { AboutPage } from '@/pages/AboutPage'
import { ArchivePage } from '@/pages/ArchivePage'
import { AuthorPage } from '@/pages/AuthorPage'
import { CategoryPage } from '@/pages/CategoryPage'
import { HomePage } from '@/pages/HomePage'
import { LibraryPage } from '@/pages/LibraryPage'
import { NoteDetailPage } from '@/pages/NoteDetailPage'
import { NotesEmptyPage } from '@/pages/NotesEmptyPage'
import { NotesLayout } from '@/pages/NotesLayout'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { AppLayout } from './layouts/AppLayout'

/**
 * 路由表单独导出，便于测试用 createMemoryRouter 复用与生产一致的结构。
 */
export const appRoutes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'notes',
        element: <NotesLayout />,
        children: [
          { index: true, element: <NotesEmptyPage /> },
          { path: ':noteId', element: <NoteDetailPage /> },
        ],
      },
      { path: 'categories/:categoryId', element: <CategoryPage /> },
      { path: 'library', element: <LibraryPage /> },
      { path: 'archive', element: <ArchivePage /> },
      { path: 'author', element: <AuthorPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]
