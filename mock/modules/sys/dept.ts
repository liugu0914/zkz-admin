import { defineMockData, suc } from '#/mock/_util'
import { Request } from '@/enums/http'
import { mock } from 'mockjs'

const prefix = '/sys/dept'

export default defineMockData([
  {
    url: `${prefix}/getDeptTree`,
    method: Request.post,
    response: () =>
      suc(
        mock({
          'array|10-20': [
            {
              id: '@increment',
              name: '@ctitle(3,5)',
              orderNum: '@increment',
              superId: 0,
              'enable|0-1': 0,
              des: '@csentence'
            }
          ]
        }).array
      )
  },
  {
    url: `${prefix}/getOneById`,
    method: Request.get,
    response: ({ query }) => {
      const { id } = query
      return suc(
        mock({
          id: id,
          name: '@ctitle(3,5)',
          orderNum: '@increment',
          superId: '0',
          'enable|0-1': 0,
          des: '@csentence'
        })
      )
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
   * 删除
   */
  {
    url: `${prefix}/del`,
    method: Request.get,
    response: () => {
      return suc(true)
    }
  }
])
