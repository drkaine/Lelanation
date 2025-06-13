export interface RouteInfo {
  path: string
  isValid: boolean
  httpStatus: number
}

interface RouteLocation {
  path: string
  [key: string]: unknown
}

declare const global: typeof globalThis

const validRoutes = [
  '/',
  '/build',
  '/build/edit',
  '/builds',
  '/builds-publics',
  '/lelariva-builds',
  '/dictionnaire',
  '/dictionnaire/proposition',
  '/statistique',
  '/legal',
  '/videos',
]

const validPatterns = [/^\/connexion\/.+/, /^\/admin\/.+/, /^\/build\/.+/]

export function validateRoute(path: string): RouteInfo {
  const normalizedPath = path.toLowerCase().replace(/\/$/, '') || '/'

  if (validRoutes.includes(normalizedPath)) {
    return {
      path: normalizedPath,
      isValid: true,
      httpStatus: 200,
    }
  }

  const isPatternMatch = validPatterns.some(pattern =>
    pattern.test(normalizedPath),
  )
  if (isPatternMatch) {
    return {
      path: normalizedPath,
      isValid: true,
      httpStatus: 200,
    }
  }

  return {
    path: normalizedPath,
    isValid: false,
    httpStatus: 404,
  }
}

export function setHttpStatus(status: number) {
  if (typeof window === 'undefined' && typeof global !== 'undefined') {
    const globalWithResponse = global as typeof global & {
      __RESPONSE__?: { status: (code: number) => void }
    }
    const response = globalWithResponse.__RESPONSE__
    if (response && typeof response.status === 'function') {
      response.status(status)
    }
  }

  if (typeof window !== 'undefined') {
    if (window.history && window.history.replaceState) {
      window.history.replaceState(
        { ...window.history.state, httpStatus: status },
        document.title,
        window.location.href,
      )
    }

    let statusMeta = document.querySelector('meta[name="http-status"]')
    if (!statusMeta) {
      statusMeta = document.createElement('meta')
      statusMeta.setAttribute('name', 'http-status')
      document.head.appendChild(statusMeta)
    }
    statusMeta.setAttribute('content', status.toString())

    if (status === 404) {
      const windowWithGtag = window as typeof window & {
        gtag?: (...args: unknown[]) => void
      }
      if (typeof windowWithGtag.gtag !== 'undefined') {
        windowWithGtag.gtag('event', 'page_not_found', {
          page_path: window.location.pathname,
          page_title: document.title,
        })
      }

      console.warn(`404 - Page not found: ${window.location.pathname}`)
    }
  }
}

export function validateRouteMiddleware(
  to: RouteLocation,
  from: RouteLocation,
  next: (arg?: unknown) => void,
): void {
  const routeInfo = validateRoute(to.path)

  if (!routeInfo.isValid) {
    setHttpStatus(404)

    next()
  } else {
    setHttpStatus(200)
    next()
  }
}

export function checkCurrentRoute(): RouteInfo {
  if (typeof window !== 'undefined') {
    return validateRoute(window.location.pathname)
  }
  return { path: '/', isValid: true, httpStatus: 200 }
}
