import { type Route } from 'vue-router'

/**
 *  系统管理模块
 * @date 2022-06-17 11:18:28
 * @author lyc
 */
export default {
  show: {
    path: '/show',
    name: 'show',
    component: () => import(`@/views/pages/show/index.vue`)
  }
} as Record<string, Route>
