import http, { Page } from '@/utils/http/axios'

const prefix = '/sys/online'

export interface Online {
  userId: Key
  userName: string
  account: string
  ip: string
  browser: string
  os: string
  loginTime: string
}
/**
 * 获取分页数据
 */
export const getPages = (params: RecordAble) => {
  return http.post<Page<Online>>(`${prefix}/getPages`, params)
}

/**
 * 下线操作
 */
export const logoff = (tokens: string[]) => {
  return http.post<Online>(`${prefix}/logoff`, tokens)
}
