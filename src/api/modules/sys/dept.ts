import http from '@/utils/http/axios'

const prefix = '/sys/dept'

export interface Dept extends Base {
  name: string
  orderNum: number
  superId: Key
  enable: number
  des: string
  children: Dept[]
}
/**
 * 列表查询
 * @returns
 */
export const getDeptTree = (params: RecordAble = {}) => http.post<Dept[]>(`${prefix}/getDeptTree`, params)

/**
 * 获取单个数据
 * @returns
 */
export const getOne = (id: Key) => http.get<Dept>(`${prefix}/getOneById`, { id })

/**
 * 保存数据
 */
export const save = (data: Partial<Dept>) => http.post<boolean>(`${prefix}/save`, data)

/**
 * 删除
 * @returns
 */
export const del = (ids: string) => http.get<boolean>(`${prefix}/del`, { ids })
