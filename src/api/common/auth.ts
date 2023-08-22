/* eslint-disable camelcase */
import http, { ContentType } from '@/utils/http/axios'

/**
 * ===================================================
 *
 *  构建ts类型时要求 类型字段与后端POJO/数据库字段相同
 *
 * ===================================================
 */

export type LoginInfo = {
  menus: Menu[]
  organization: Organization
  permissions: string[]
  roles: Role[]
  user: User
}

export type LoginForm = {
  grant_type: string
  clientId: string
  clientSecret: string
  account: string
  password: string
  scope: string
}

export type TokenResult = {
  // token令牌
  access_token: string
  refresh_token: string
  // 客户端ID
  clientId: string
  // 授权范围
  scope: Array<string>
  // token 前缀
  token_type: string
  // token 过期时间
  expires_in: number
}

const prefix = '/auth'

/**
 * 检查token
 */
export const check = () => http.get<boolean>(`${prefix}/actuator/check`)

/**
 *
 * 密码登录
 */
export const passwordLogin = (data: Pick<LoginForm, 'account' | 'password'>) => {
  const form = {
    clientId: 'admin',
    clientSecret: 'YWRtaW4=',
    grant_type: 'password',
    scope: 'server',
    ...data
  }
  return login(form)
}

/**
 *
 * oauth授权登录
 */
export const login = (form: LoginForm) => {
  const { clientId, clientSecret, ...loginData } = form
  const basic = window.btoa(`${clientId}:${clientSecret}`)
  return http.post<TokenResult>(`${prefix}/oauth2/token`, loginData, {
    headers: {
      'Content-Type': ContentType.FORM_URLENCODED,
      Authorization: `Basic ${basic}`
    }
  })
}

/**
 * 退出
 */
export const logout = () => http.get<boolean>(`${prefix}/logout`)

/**
 * 获取登录之后的用户信息
 */
export const getUserInfo = () => http.get<LoginInfo>('/sys/authUser/getUserInfo')
