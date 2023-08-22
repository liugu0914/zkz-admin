import { type Route } from 'vue-router'

/**
 *  系统管理模块
 * @date 2022-06-17 11:18:28
 * @author lyc
 */
const sys: Record<string, Route> = {
  user: {
    path: '/user',
    component: () => import(`@/views/pages/sys/user/index.vue`)
  },
  dept: {
    path: '/dept',
    component: () => import(`@/views/pages/sys/dept/index.vue`)
  },
  menu: {
    path: '/menu',
    component: () => import(`@/views/pages/sys/menu/index.vue`)
  },
  permission: {
    path: '/permission',
    component: () => import(`@/views/pages/sys/permission/index.vue`)
  },
  role: {
    path: '/role',
    component: () => import(`@/views/pages/sys/role/index.vue`)
  },
  app: {
    path: '/app',
    component: () => import(`@/views/pages/sys/app/index.vue`)
  },
  organization: {
    path: '/organization',
    component: () => import(`@/views/pages/sys/organization/index.vue`)
  },
  sysLog: {
    path: '/sysLog',
    component: () => import(`@/views/pages/sys/sysLog/index.vue`)
  },
  online: {
    path: '/online',
    component: () => import(`@/views/pages/sys/online/index.vue`)
  }
}

export default sys
