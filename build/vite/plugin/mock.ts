/**
 * Mock plugin for development and production.
 * https://github.com/anncwb/vite-plugin-mock
 * v2.9.8
 */
import { viteMockServe } from 'vite-plugin-mock'

export function configMockPlugin() {
  return viteMockServe({
    ignore: /^\_/,
    mockPath: 'mock',
    prodEnabled: true,
    injectCode: `
    import { setupProdMockServer } from '../mock/_createProductionServer';

    setupProdMockServer();
    `
  })
}
