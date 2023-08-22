import type { Plugin, ResolvedConfig } from 'vite'
/**
 * 开发环境全部引入 ant-design-vue
 * @returns
 */
export function configDevImportPlugin() {
  let config: ResolvedConfig
  return <Plugin>{
    name: 'AntDesignVueDevImportPlugin',
    async configResolved(conf) {
      config = conf
    },
    transform(code, id) {
      // 判断当前处理的是否是 _src/main.ts_
      if (config.root + '/src/main.ts' === id) {
        const name = 'AntDesignVue'

        // 引入 AntDesignVue 和 样式
        const prepend = `import ${name} from 'ant-design-vue';\nimport 'ant-design-vue/dist/antd.less';\n`

        // 通过匹配字符串来使用 AntDesignVue （此处替换规则根据 main.ts 的情况而定）
        // 相当于将字符串 `app.use(router).mount('#app')` 替换成 `app.use(router).use(AntDesignVue).mount('#app')`
        code = code.replace('.mount(', ($1) => `.use(${name})` + $1)
        return prepend + code
      }
      return code
    }
  }
}
