import type { App } from 'vue'
import type { Router } from 'vue-router'

export interface Router404PluginOptions {
  router: Router
}

export function router404Plugin(app: App, options: Router404PluginOptions) {
  const { router } = options

  router.afterEach(to => {
    if (to.name === 'not-found') {
      document.title = '404 - Page non trouvée | Lelanation'

      if (typeof window !== 'undefined') {
        let statusMeta = document.querySelector('meta[name="http-status"]')
        if (!statusMeta) {
          statusMeta = document.createElement('meta')
          statusMeta.setAttribute('name', 'http-status')
          document.head.appendChild(statusMeta)
        }
        statusMeta.setAttribute('content', '404')

        if (window.history && window.history.replaceState) {
          window.history.replaceState(
            { ...window.history.state, status: 404 },
            document.title,
            window.location.href,
          )
        }

        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: 'http-status', status: 404 }, '*')
        }
      }
    }
  })
}
