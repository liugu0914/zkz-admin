import { defineMockData, pages } from '#/mock/_util'
import { Request } from '@/enums/http'
import { mock } from 'mockjs'

const prefix = '/sys/sysLog'

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
          'array|100-200': [
            {
              id: '@increment',
              userName: '@cname',
              userAgent: '@cname',
              'type|1': [1, 2, 3, 4, 5, 6],
              title: '@ctitle',
              'time|1-1000': 1,
              'serviceId|1': ['sys', 'file', 'auth', 'ws', 'es', 'act'],
              requestUri: '@url',
              ip: '@ip',
              params: '{}',
              method: /GET|POST/,
              'result|0-1': 1,
              exception: '@paragraph',
              operateTime: '@datetime'
            }
          ]
        }).array,
        current,
        pageSize
      )
    }
  }
])
