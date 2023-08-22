import { type RouteRecordRaw } from 'vue-router'
import common from './router.common'
import auth from './router.auth'
import unAuth from './router.unAuth'
import { cloneDeep } from 'lodash-es'

export { root, login } from './router.common'
export { mainName } from './router.auth'

// 单独的内部链接组件
const link = () => import('@/views/inner/link.vue')

const pages = import.meta.glob('./modules/**/*.ts', { eager: true }) as RecordAble<any>

/**
 * 所有的页面集合
 * @date 2022-06-17
 * @author lyc
 */
const getRouteMap = () => {
  let routeMap: Record<string, RouteRecordRaw> = {}
  for (const key in pages) {
    const routes = cloneDeep(pages[key].default) as Record<string, RouteRecordRaw>
    const name = key.match(/(?<=\.\/modules).*?(?=\.ts)/) // 匹配中间段
    if (name?.length) {
      Object.keys(routes).forEach((item) => {
        const router = routes[item]
        const { meta = {} } = router
        const path = router.path

        // 是否为内部链接
        if (meta.isLink && meta.isInner) {
          // 单独的内部链接组件
          router.component = link
        }

        router.path = name[0] + (path.startsWith('/') ? path : '/' + path)
      })
    }
    routeMap = { ...routeMap, ...routes }
  }

  return routeMap
}

common.push(...unAuth)

export { getRouteMap, common, auth }
