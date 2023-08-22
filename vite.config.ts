import type { UserConfig, ConfigEnv } from 'vite'
import { loadEnv } from 'vite'
import { wrapperEnv } from './build/utils'
import { createVitePlugins } from './build/vite/plugin/index'
import path from 'path'

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd()

  const env = loadEnv(mode, root)

  const viteEnv = wrapperEnv(env)

  const { VITE_PORT, VITE_BASE_URL, VITE_OUT_DIR_NAME, VITE_BASE_API, VITE_BASE_API_PREFIX } = viteEnv

  const isBuild = command === 'build'

  return {
    base: VITE_BASE_URL,

    plugins: createVitePlugins(viteEnv, isBuild),

    css: {
      modules: {
        localsConvention: 'camelCaseOnly'
      }
    },
    esbuild: {
      pure: isBuild ? ['console.log', 'debugger'] : []
    },
    resolve: {
      alias: [
        {
          find: 'vue-i18n',
          replacement: 'vue-i18n/dist/vue-i18n.cjs.js'
        },
        {
          find: '@',
          replacement: path.resolve(__dirname, './src')
        },
        {
          find: '#',
          replacement: path.resolve(__dirname)
        }
      ]
    },
    server: {
      // https: true,
      // Listening on all local IPs
      host: true,
      port: VITE_PORT,
      // Load proxy configuration from .env
      proxy: {
        [VITE_BASE_API_PREFIX]: {
          ws: true,
          target: VITE_BASE_API,
          changeOrigin: true,
          rewrite: (path) => {
            const regexp = new RegExp(`^\\${VITE_BASE_API_PREFIX}`)
            return path.replace(regexp, '')
          }
        }
      }
    },
    build: {
      rollupOptions: {
        output: {
          chunkFileNames: 'js/[name]-[hash].js', // 引入文件名的名称
          entryFileNames: 'js/[name]-[hash].js', // 包的入口文件名称
          assetFileNames: '[ext]/[name]-[hash].[ext]', // 资源文件像 字体，图片等
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor'
            }
          }
        }
      },
      reportCompressedSize: false,
      chunkSizeWarningLimit: 1500,
      outDir: VITE_OUT_DIR_NAME,
      sourcemap: false // 这个生产环境一定要关闭，不然打包的产物会很大
    },
    optimizeDeps: {
      // @iconify/iconify: The dependency is dynamically and virtually loaded by @purge-icons/generated, so it needs to be specified explicitly
      // include: ['dayjs/locale/zh-cn', 'dayjs/locale/en']
    }
  }
}
