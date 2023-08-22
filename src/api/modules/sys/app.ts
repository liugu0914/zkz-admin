import http, { Page } from '@/utils/http/axios'

const prefix = '/sys/app'

/**
 * 获取分页数据
 */
export const getListPage = (params: RecordAble) => {
  return http.post<Page<App>>(`${prefix}/getListPage`, params)
}

/**
 * 查询所有数据
 */
export const getApps = () => {
  return http.get<Array<App>>(`${prefix}/getList`)
}

/**
 * 通过Id查询数据

 */
export const getOne = (id: Key) => {
  return http.get<App>(`${prefix}/getOneById`, { id })
}

/**
 * 保存数据

 */
export const save = (params: Partial<App>) => {
  return http.post<boolean>(`${prefix}/save`, params)
}

/**
 * 删除数据
 */
export const del = (ids: string) => {
  return http.get<boolean>(`${prefix}/del`, { ids })
}
