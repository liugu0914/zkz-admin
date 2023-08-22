import http, { Page } from '@/utils/http/axios'

const prefix = '/sys/organization'

/**
 * 列表查询
 * @returns
 */
export const getListPage = (params: RecordAble = {}) => http.post<Page<Organization>>(`${prefix}/getListPage`, params)

/**
 * 获取单个数据
 * @returns
 */
export const getOne = (id: Key) => http.get<Organization>(`${prefix}/getOneById`, { id })

/**
 * 保存数据
 */
export const save = (data: Partial<Organization>) => http.post<boolean>(`${prefix}/save`, data)

/**
 * 删除
 * @returns
 */
export const del = (ids: string) => http.get<boolean>(`${prefix}/del`, { ids })
