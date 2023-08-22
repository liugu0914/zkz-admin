import { type RouteRecordRaw } from 'vue-router'

export const mainName = 'main'

// 登录才显示之后的单页面
const auth: Array<RouteRecordRaw> = [
  {
    path: `/${mainName}`,
    name: mainName,
    component: () => import('@/layout/skeleton.vue'),
    children: [
      // 在主体框架之内的路由
      {
        path: '/ds/:fileId',
        name: 'ds',
        meta: {
          name: '文件预览'
        },
        props: true,
        component: () => import('@/views/inner/ds.vue')
      },
      {
        path: '/tmp',
        name: 'tmp',
        meta: {
          name: '临时页面'
        },
        component: () => import('@/views/inner/index.vue')
      }
    ]
  }
]
export default auth
