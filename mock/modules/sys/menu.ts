import { defineMockData, suc } from '#/mock/_util'
import { Request } from '@/enums/http'
import { mock } from 'mockjs'
import { menus } from '#/mock/common/_data'
import { cloneDeep } from 'lodash-es'
import { getFirstAbleMenu } from '@/utils/base'

const prefix = '/sys/menu'

export default defineMockData([
  {
    url: `${prefix}/getMenusTree`,
    method: Request.post,
    response: () => suc(menus)
  },
  {
    url: `${prefix}/getOneById`,
    method: Request.get,
    response: ({ query }) => {
      const { id } = query

      const menu = getFirstAbleMenu(menus, (item) => {
        return item.id === id
      })

      return suc(menu)
    }
  },
  /**
   * 保存数据
   */
  {
    url: `${prefix}/save`,
    method: Request.get,
    response: () => {
      return suc(true)
    }
  },
  /**
   * 获取父级菜单
   */
  {
    url: `${prefix}/getSuperMenus`,
    method: Request.get,
    response: () => {
      const cmenus = cloneDeep(menus)
      cmenus.forEach((item) => (item.children = undefined))
      return suc(cmenus)
    }
  },
  /**
   * 删除
   */
  {
    url: `${prefix}/del`,
    method: Request.get,
    response: () => {
      return suc(true)
    }
  },
  /**
   * 根据菜单Id获取菜单权限信息
   */
  {
    url: `${prefix}/getPermissionsByMenuId`,
    method: Request.get,
    response: () => {
      const permissions = mock({
        'array|1-5': [
          {
            id: '@increment',
            key: '@increment',
            target: '/@word/@word',
            charm: '@word:@word'
          }
        ]
      }).array
      return suc(permissions)
    }
  },
  /**
   * 保存菜单权限
   */
  {
    url: `${prefix}/savePermission`,
    method: Request.post,
    response: () => {
      return suc(true)
    }
  }
])
