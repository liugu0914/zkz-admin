import '@/style/index.css'

import { createApp } from 'vue'
import { setupStore } from '@/store'
import { setupI18n } from '@/i18n'
import { setupRouter } from '@/router'
import { registerGlobComp } from '@/components'
import { setupDirectives } from '@/directives'
import Plugins from '@/plugins'
import App from './App.vue'

const bootstrap = async () => {
  // create app
  const app = createApp(App)

  setupStore(app)

  setupDirectives(app)

  app.use(Plugins)

  await setupI18n(app)

  setupRouter(app)

  registerGlobComp(app)

  // https://next.router.vuejs.org/api/#isready
  // await router.isReady()

  app.mount('#app')
}

bootstrap()
