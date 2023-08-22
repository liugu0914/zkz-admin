import { defineMockData, suc } from '#/mock/_util'
import { Request } from '@/enums/http'
import { mock } from 'mockjs'
import { menus } from '#/mock/common/_data'

const prefix = '/sys/permission'

export default defineMockData([
  {
    url: `${prefix}/getSys`,
    method: Request.get,
    response: ({ query }) => {
      const { appId } = query
      return suc(
        mock({
          'array|5-10': [
            {
              id: '@increment',
              name: '@ctitle(2,7)',
              appId: appId,
              target: '/@word/@word',
              charm: '@word:@word',
              type: 'sys',
              'enable|0-1': 1,
              orderNum: '@increment'
            }
          ]
        }).array
      )
    }
  },
  {
    url: `${prefix}/getMenu`,
    method: Request.get,
    response: () => {
      return suc(menus)
    }
  },
  {
    url: `${prefix}/getConfigMenu`,
    method: Request.get,
    response: () => {
      return suc(menus)
    }
  },
  {
    url: `${prefix}/getFuc`,
    method: Request.get,
    response: ({ query }) => {
      const { appId } = query
      return suc(
        mock({
          'array|5-10': [
            {
              id: '@increment',
              name: '@ctitle(2,7)',
              appId: appId,
              target: '/@word/@word',
              charm: '@word:@word',
              type: 'fuc',
              'enable|0-1': 1,
              orderNum: '@increment'
            }
          ]
        }).array
      )
    }
  },
  {
    url: `${prefix}/saveMenu`,
    method: Request.post,
    response: () => {
      return suc(true)
    }
  },
  {
    url: `${prefix}/savePes`,
    method: Request.post,
    response: () => {
      return suc(true)
    }
  },
  {
    url: `${prefix}/getPes`,
    method: Request.get,
    response: () => {
      return suc(
        mock({
          name: '@ctitle(2,7)',
          charm: '@word',
          'permissions|5-10': [
            {
              id: '@increment',
              name: '@ctitle(2,7)',
              target: '/@word/@word',
              charm: '@word:@word',
              type: 'fuc',
              'enable|0-1': 1,
              orderNum: '@increment'
            }
          ]
        })
      )
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
    url: `${prefix}/moveOrder`,
    method: Request.post,
    response: () => {
      return suc(true)
    }
  }
])
