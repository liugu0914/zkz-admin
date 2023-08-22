import { defineMockData, suc, pages } from '#/mock/_util'
import { Request } from '@/enums/http'

const prefix = '/sys/app'

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
        [
          {
            id: 1,
            name: '系统管理中心',
            des: '啧啧啧啧啧啧啧啧啧啧啧啧',
            enable: 1
          }
        ],
        current,
        pageSize
      )
    }
  },
  {
    url: `${prefix}/getList`,
    method: Request.get,
    response: () =>
      suc([
        {
          id: 1,
          name: '系统管理中心',
          des: '啧啧啧啧啧啧啧啧啧啧啧啧',
          enable: 1
        }
      ])
  },
  {
    url: `${prefix}/getOneById`,
    method: Request.get,
    response: () =>
      suc({
        id: 1,
        name: '系统管理中心',
        des: '啧啧啧啧啧啧啧啧啧啧啧啧',
        enable: 1
      })
  },
  {
    url: `${prefix}/save`,
    method: Request.post,
    response: () => suc(true)
  },
  {
    url: `${prefix}/del`,
    method: Request.get,
    response: () => suc(true)
  }
])
