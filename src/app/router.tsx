import { createBrowserRouter } from 'react-router-dom'
import { normalizeLegacyUrl } from './legacyUrl'
import { appRoutes } from './routes'

const baseName = import.meta.env.BASE_URL === '/' ? undefined : import.meta.env.BASE_URL

normalizeLegacyUrl()

export const router = createBrowserRouter(appRoutes, { basename: baseName })
