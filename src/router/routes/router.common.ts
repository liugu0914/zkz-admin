import { type RouteRecordRaw } from 'vue-router'

export const root = 'root'

export const login = 'login'

// 公共路由组件
const common: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: root,
    redirect: { name: login }
  },
  {
    path: `/${login}`,
    name: login,
    component: () => import('@/views/login/index.vue'),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    meta: {
      requiresAuth: false
    }
  }
]
export default common
