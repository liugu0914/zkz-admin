import { defineMockData, pages, suc } from '#/mock/_util'
import { Request } from '@/enums/http'
import { mock } from 'mockjs'

const prefix = '/sys/organization'

export default defineMockData([
  /**
   * 分页数据
   */
  {
    url: `${prefix}/getListPage`,
    method: Request.post,
    response: ({ body }) => {
      const { current, pageSize } = body.page
      return pages(
        mock({
          'array|1-3': [
            {
              id: '@increment',
              alias: '@first',
              name: '@word(3,5)',
              des: '@csentence()'
            }
          ]
        }).array,
        current,
        pageSize
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
          alias: '@first',
          name: '@word(3,5)',
          des: '@csentence()'
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
