import { defineMockData, suc } from '#/mock/_util'
import { Request } from '@/enums/http'
import { menus } from '#/mock/common/_data'
// import { mock } from 'mockJs'

const prefix = '/sys/authUser'

export default defineMockData([
  {
    url: `${prefix}/getUserInfo`,
    method: Request.get,
    response: () =>
      suc({
        permissions: ['*#*#*'],
        organization: {
          id: '89157056795381760',
          name: '系统管理中心',
          alias: 'admin',
          des: '系统管理中心'
        },
        roles: [],
        menus: menus,
        user: {
          id: '5183581957787648',
          account: 'admin',
          userName: '系统管理员',
          email: 'liugu0914@sina.com',
          imgUrl: 'http://192.168.0.28/ice/adbae29b6f4547299e6693d8c7b1c770.png',
          phone: '123123213',
          idCard: '123123123',
          userType: 'admin'
        }
      })
  }
])
