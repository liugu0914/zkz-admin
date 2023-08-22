import 'vue-router'

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue-router' {
  type Route = {
    /** 路由重定向 */
    redirect?: import('vue-router').RouteRecordRaw['redirect']
    /** 子路由 */
    children?: Route[]
    /** 路由描述 */
    meta?: RouteMeta
  } & Omit<import('vue-router').RouteRecordRaw, 'redirect' | 'children' | 'meta'>

  interface RouteMeta extends Record<string | number | symbol, unknown> {
    // 标题
    name?: string
    // 唯一标识 与menu id同步
    key?: Key
    // 是否允许多个
    multi?: boolean // 是否允许多个
    // 面包屑
    breadcrumb?: Breadcrumb[]
    // 是否为外部链接
    isLink?: boolean
    // 是否为内部链接
    isInner?: boolean
    // 外部链接地址
    url?: string
    // 图标
    icon?: string
    // 是否可关闭
    closeAble?: boolean
    // 是否需要权限
    requiresAuth?: boolean
  }

  interface Breadcrumb {
    // 唯一标识 与menu id同步
    id: Key
    // 标题
    name: string
  }
}
