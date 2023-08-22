import http, { Page } from '@/utils/http/axios'

const prefix = '/sys/sysLog'

export interface SysLog extends Base {
  userName: string
  userAgent: string
  type: number
  title: string
  time: number
  serviceId: string
  requestUri: string
  ip: string
  params: string
  method: string
  result: number
  exception: string
  operateTime: string
}
/**
 * 获取分页数据
 */
export const getListPage = (params: RecordAble) => {
  return http.post<Page<SysLog>>(`${prefix}/getListPage`, params)
}

/**
 * 通过Id查询数据

 */
export const getOne = (id: Key) => {
  return http.get<SysLog>(`${prefix}/getOneById`, { id })
}
