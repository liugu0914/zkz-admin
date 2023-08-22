import { defineMockData, suc } from '#/mock/_util'
import { Request } from '@/enums/http'
import { mock } from 'mockjs'
import { menus } from '#/mock/common/_data'
import { cloneDeep } from 'lodash-es'
import { doTree } from '@/utils/base'

const prefix = '/sys/role'

export default defineMockData([
  {
    url: `${prefix}/getList`,
    method: Request.post,
    response: () => {
      return suc(
        mock({
          'array|5-10': [
            {
              id: '@increment',
              name: '@ctitle(2,7)',
              des: '@csentence',
              'enable|0-1': 1,
              orderNum: '@increment'
            }
          ]
        }).array
      )
    }
  },
  {
    url: `${prefix}/getOneById`,
    method: Request.get,
    response: ({ query }) => {
      const { id } = query
      return suc(
        mock({
          id: id,
          name: '@ctitle(2,7)',
          des: '@csentence',
          'enable|0-1': 1,
          orderNum: '@increment'
        })
      )
    }
  },
  {
    url: `${prefix}/save`,
    method: Request.post,
    response: () => {
      return suc(true)
    }
  },
  {
    url: `${prefix}/del`,
    method: Request.get,
    response: () => {
      return suc(true)
    }
  },
  {
    url: `${prefix}/getConfigPermission`,
    method: Request.get,
    response: () => {
      const cmenus = cloneDeep(menus)

      const fucs = {}
      doTree(cmenus, (node) => {
        node.permissionId = mock('@increment')
        fucs[`${node.id}`] = mock({
          'array|5-10': [
            {
              id: '@increment',
              name: '@ctitle(2,7)',
              target: '/@word/@word',
              charm: '@word:@word',
              type: 'fuc',
              orderNum: '@increment'
            }
          ]
        }).array
      })

      return suc(
        mock({
          'sys|5-10': [
            {
              id: '@increment',
              name: '@ctitle(2,7)',
              target: '/@word/@word',
              charm: '@word:@word',
              type: 'sys',
              orderNum: '@increment'
            }
          ],
          menu: cmenus,
          fuc: fucs,
          'pes|5-10': ['@increment']
        })
      )
    }
  },
  {
    url: `${prefix}/savePermission`,
    method: Request.post,
    response: () => {
      return suc(true)
    }
  }
])
