import { type RouteRecordRaw } from 'vue-router'

// 不需要登录即可显示的单页面
const unAuth: Array<RouteRecordRaw> = [
  {
    path: '/tmps',
    name: 'tmps',
    component: () => import('@/views/inner/index.vue')
  }
]
export default unAuth
