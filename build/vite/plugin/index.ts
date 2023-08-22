import type { PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import legacy from '@vitejs/plugin-legacy'
import viteCompression from 'vite-plugin-compression'
import { configEslintPlugin } from './eslint'
import { configI18nPlugin } from './i18n'
import { configCompressPlugin } from './compress'
// import { configAutoImportPlugin } from './autoImport'
import { configComponentsPlugin } from './components'
import { configMockPlugin } from './mock'
import { configSvgIconsPlugin } from './svgSprite'
import { showBanner } from '../banner'
import { configVisualizerConfig } from './visualizer'

export function createVitePlugins(viteEnv: ViteEnv, isBuild: boolean) {
  const { VITE_USE_MOCK, VITE_SHOW_VISUALIZER, VITE_USER_LEGACY } = viteEnv

  showBanner()

  const vitePlugins: (PluginOption | PluginOption[])[] = [
    // have to
    // https://vuejs.org/guide/extras/reactivity-transform.html
    vue(),
    // have to
    vueJsx(),
    // gzip
    viteCompression(),
    // i18n
    configI18nPlugin(),
    // support eslint
    configEslintPlugin()
  ]

  // unplugin-auto-import/vite
  // vitePlugins.push(configAutoImportPlugin())

  // vite-plugin-mock
  VITE_USE_MOCK && vitePlugins.push(configMockPlugin())

  // unplugin-vue-components/vite
  vitePlugins.push(configComponentsPlugin())

  // @vitejs/plugin-legacy
  VITE_USER_LEGACY && vitePlugins.push(legacy())

  // gzip
  isBuild && vitePlugins.push(configCompressPlugin({ compress: 'gzip' }))

  // analysis
  VITE_SHOW_VISUALIZER && vitePlugins.push(configVisualizerConfig())

  // vite-plugin-svg-icons
  vitePlugins.push(configSvgIconsPlugin())

  return vitePlugins
}
