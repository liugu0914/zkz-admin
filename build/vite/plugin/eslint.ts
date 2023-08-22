/**
 * ESLint plugin for vite.
 * https://github.com/gxmari007/vite-plugin-eslint
 */
import eslintPlugin from 'vite-plugin-eslint'

/**
 * vite 支持eslint 错误检查
 */
export function configEslintPlugin() {
  return eslintPlugin({
    // include: [/\.(jsx?|tsx?|vue|svelte)$/, './build/**', './src/**'],
    // exclude: ['./node_modules/**'],
    failOnError: true,
    failOnWarning: false
  })
}
