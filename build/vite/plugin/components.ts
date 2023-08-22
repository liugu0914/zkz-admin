/**
 * On-demand components auto importing for Vue.
 * https://github.com/antfu/unplugin-vue-components
 */
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
/**
 * vite 组件按需引用
 */
export function configComponentsPlugin() {
  return Components({
    dts: './types/components.d.ts',
    resolvers: [NaiveUiResolver()]
  })
}
