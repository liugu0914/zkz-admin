/* eslint-disable no-console */
import { RouteRecordRaw, Breadcrumb, Router } from 'vue-router'
import { getRouteMap, common, auth, mainName, login, root } from '../routes'
import { router } from '../index'
import Storage from '@/utils/Storage'
import { nextTick } from 'vue'

let routeMap: Record<string, RouteRecordRaw> = {}

/**
 * 设置动态路由
 */
export const setupRoutes = async (menus?: Menu[], callback?: (menus: Menu[]) => void) => {
  if (!menus || menus.length === 0) {
    menus = Storage.get(import.meta.env.VITE_MENUS_KEY) || []
    if (!menus || menus.length === 0) {
      router.currentRoute.value.name !== login &&
        nextTick(() => {
          router.push({ name: login })
        })
      return
    }
  }

  // 切换root 的重定向
  const rootRoute = common.find((item) => item.name === root)
  if (rootRoute && rootRoute.redirect !== `/${mainName}`) {
    rootRoute.redirect = `/${mainName}`
    router.addRoute(rootRoute)
  }

  routeMap = getRouteMap()
  const childrens = parseRoutes(menus)
  console.log(menus)
  const main = auth.find((item) => item.name === mainName)

  if (main) {
    if (!main.children || main.children?.length === 0) {
      main.children = []
    } else {
      parseOriginChildren(main.children)
    }
    main.children.push(...childrens)
  }
  addAuth(router)

  callback && callback(menus)

  console.log(router.getRoutes())
}

/**
 * 原始子路由
 * @param children 子路由
 */
const parseOriginChildren = (children: RouteRecordRaw[]) => {
  children.forEach((item) => {
    const meta = item.meta
    if (item.children && item.children.length > 0) {
      parseOriginChildren(item.children)
    } else if (meta && Object.keys(meta).length > 0) {
      if (!meta.name) {
        return
      }
      // name存在
      if (!meta.breadcrumb || meta.breadcrumb.length === 0) {
        meta.breadcrumb = [{ id: item.path, name: meta.name }]
      }
    }
  })
}

/**
 * 添加单独页面 需要登录
 * @param router
 */
function addAuth(router: Router) {
  auth.forEach((page) => {
    router.addRoute(page)
  })
}

/**
 * 根据 路由配置 和 路由组件注册 解析路由
 * @param menus 菜单数据
 * @param routes 路由组
 * @param breadcrumb 面包屑
 */
function parseRoutes(menus: Menu[], routes: RouteRecordRaw[] = [], breadcrumb: Breadcrumb[] = []) {
  if (!menus || menus.length === 0) {
    return []
  }
  menus.forEach((item) => {
    if (item.name) {
      breadcrumb.push({ id: item.id, name: item.name })
    }
    // 副菜单不存在router
    const route = routeMap[item.router ?? ''] || {}
    if (item.router && route) {
      // 菜单是否存在路由信息
      const meta = route.meta ?? {}
      meta.breadcrumb = [...breadcrumb]
      meta.icon = item.icon
      meta.key = item.id
      meta.name = item.name
      route.name = route.name || item.router
      route.meta = meta
      item.isLink = meta.isLink
      item.isInner = meta.isInner
      item.url = meta.url
      item.path = route.path = item.path ?? route.path
    }
    // 判断父级和子级菜单是否不可用
    item.disabled = item.parent ? !item.children || item.children.length === 0 : !item.path
    if (item.children && item.children.length > 0) {
      route.children = parseRoutes(item.children, routes, breadcrumb)
    }
    if (breadcrumb.length > 0) {
      breadcrumb.pop()
    }
    if (route.path) {
      routes.push(route)
    }
  })
  return routes
}
