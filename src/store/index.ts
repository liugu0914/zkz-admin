import { createPinia } from 'pinia'
import type { App } from 'vue'

const store = createPinia()

/**
 * pinia like vuex
 * @param app
 */
export function setupStore(app: App<Element>) {
  app.use(store)
}

export { store }
