/**
 * Auto import APIs on-demand for Vite, Webpack, Rollup and esbuild. With TypeScript support. Powered by unplugin.
 * https://github.com/antfu/unplugin-auto-import
 */
import AutoImport from 'unplugin-auto-import/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
/**
 * vite 支持eslint 错误检查
 */
export function configAutoImportPlugin() {
  return AutoImport({
    imports: ['vue', 'vue/macros'],
    eslintrc: {
      // 生产eslint文件
      enabled: false, // Default `false`
      filepath: './.eslintrc-auto-import.json' // Default `./.eslintrc-auto-import.json`
    },
    dts: './types/auto-imports.d.ts',
    resolvers: [AntDesignVueResolver()]
  })
}
