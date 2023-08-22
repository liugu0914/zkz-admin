import { defineMockData, pages, suc } from '#/mock/_util'
import { Request } from '@/enums/http'
import { mock, Random } from 'mockjs'

const prefix = '/sys/user'

export default defineMockData([
  /**
   * 获取用户列表
   */
  {
    url: `${prefix}/getUsers`,
    method: Request.get,
    response: () =>
      suc(
        mock({
          'array|10-20': [
            {
              label: '@cname',
              value: '@increment'
            }
          ]
        }).array
      )
  },
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
          'array|45': [
            {
              id: '@increment',
              imgUrl: '@image(200x200)',
              userName: '@cname',
              account: '@word()',
              'age|1-100': 1,
              address: '@county(true)',
              deptName: '@csentence',
              email: '@email'
            }
          ]
        }).array,
        current,
        pageSize
      )
    }
  },
  /**
   * 获取单个数据
   */
  {
    url: `${prefix}/getInfoById`,
    method: Request.get,
    response: ({ query }) => {
      const { id } = query
      return suc(
        mock({
          id: id,
          imgUrl: '@image(200x200)',
          userName: '@cname',
          account: '@word()',
          'age|1-100': 1,
          phone: /1[3589]{2}[1-9]{9}/,
          idCard: Random.id(),
          address: '@county(true)',
          deptName: '@csentence',
          email: '@email'
        })
      )
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
   * 保存数据
   */
  {
    url: `${prefix}/save`,
    method: Request.post,
    response: () => {
      return suc(true)
    }
  },
  /**
   * 用户修改个人信息
   */
  {
    url: `${prefix}/editUserInfo`,
    method: Request.post,
    response: () => {
      return suc(true)
    }
  },
  /**
   * 更新密码
   */
  {
    url: `${prefix}/updatePassword`,
    method: Request.post,
    response: () => {
      return suc(true)
    }
  },
  /**
   * 获取用户权限
   */
  {
    url: `${prefix}/getConfigRoles`,
    method: Request.get,
    response: () => {
      return suc([])
    }
  },
  /**
   * 保存用户权限
   */
  {
    url: `${prefix}/getConfigRoles`,
    method: Request.post,
    response: () => {
      return suc(true)
    }
  }
])
