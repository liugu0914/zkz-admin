import { defineMockData, pages, suc } from '#/mock/_util'
import { Request } from '@/enums/http'
import { mock } from 'mockjs'

const prefix = '/sys/online'

export default defineMockData([
  /**
   * 分页数据
   */
  {
    url: `${prefix}/getPages`,
    method: Request.post,
    response: ({ body }) => {
      const { current, pageSize } = body.page
      return pages(
        mock({
          'array|100-200': [
            {
              id: '@increment',
              userName: '@cname',
              userId: '@increment',
              account: '@word(5,7)',
              ip: '@ip',
              browser: /chrome|edge|firefox/,
              os: /Windows|Mac OS|linux/,
              loginTime: '@datetime'
            }
          ]
        }).array,
        current,
        pageSize
      )
    }
  },
  /**
   * 下线操作
   */
  {
    url: `${prefix}/logoff`,
    method: Request.post,
    response: () => {
      return suc(true)
    }
  }
])
