import type { App } from 'vue'
import hasPermission from './modules/hasPermission'

const setupDirectives = (app: App) => {
  app.use(hasPermission)
}
export { setupDirectives }
