import { type Route } from 'vue-router'

/**
 *  系统管理模块
 * @date 2022-06-17 11:18:28
 * @author lyc
 */
export default {
  fileShow: {
    path: '/fileShow',
    component: () => import(`@/views/pages/show/fileShow/index.vue`)
  }
} as Record<string, Route>
