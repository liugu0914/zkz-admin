/* eslint-disable no-console */
import { type App } from 'vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { setupGuards } from './guard/load'
import guards from './guard'
import { common as routes } from './routes'
import { setupRoutes } from './logic/index'
import { useStoreWithOut } from '@/store/modules/accout'

// 白名单 基本静态路由的name属性
const WHITE_NAME_LIST: Array<RouteRecordRaw['name']> = []

const getRouteNames = (array: Array<RouteRecordRaw>) =>
  array.forEach((item) => {
    if (item.name) {
      WHITE_NAME_LIST.push(item.name)
    }
    if (item.children && item.children.length > 0) {
      getRouteNames(item.children)
    }
  })

getRouteNames(routes)

// 创建路由
export const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
  routes
})

// reset router
export function resetRouter() {
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !WHITE_NAME_LIST.includes(name)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

/**
 *
 * 初始化router
 * @param app vue实例
 */
export function setupRouter(app: App) {
  const { setCacheMenus } = useStoreWithOut()
  // 加载路由页面
  setupRoutes(undefined, (menus) => setCacheMenus(menus))
  // 设置路由守卫
  setupGuards(guards, router, WHITE_NAME_LIST)

  app.use(router)
}
