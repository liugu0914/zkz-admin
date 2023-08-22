/**
 * https://vue-i18n.intlify.dev/guide/advanced/optimization.html#improve-performance-and-reduce-bundle-size-with-runtime-build-only
 * i18n for vite.
 */
import path from 'path'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

/**
 * vite i18n 支持
 */
export function configI18nPlugin() {
  return VueI18nPlugin({
    include: path.resolve(__dirname, './src/i18n/lang/**')
  })
}
