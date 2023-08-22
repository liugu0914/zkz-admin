import { RouteLocationNormalized, Router } from 'vue-router'
import { guardOrder } from './index'

/**
 * 加载导航守卫
 * @param guards
 * @param router
 * @param WHITE_NAME_LIST 白名单
 */
export function setupGuards(guards: guardOrder, router: Router, WHITE_NAME_LIST: Array<RouteLocationNormalized['name']>) {
  const { beforeEach, afterEach } = guards
  beforeEach.forEach((guard) => {
    router.beforeEach((to, from, next) => guard(to, from, next, WHITE_NAME_LIST))
  })
  afterEach.forEach((guard) => {
    router.afterEach((to, from) => guard(to, from))
  })
}
