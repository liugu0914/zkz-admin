import http, { Page } from '@/utils/http/axios'

const prefix = '/sys/user'

/**
 * 分页数据
 * @returns
 */
export const getListPage = (params: RecordAble) => http.post<Page<User>>(`${prefix}/getListPage`, params)

/**
 * 获取单个数据
 * @returns
 */
export const getOne = (id: Key) => http.get<User>(`${prefix}/getInfoById`, { id })

/**
 * 保存数据
 */
export const save = (data) => http.post<boolean>(`${prefix}/save`, data)

/**
 * 用户修改个人信息
 */
export const editUserInfo = (data) => http.post<boolean>(`${prefix}/editUserInfo`, data)

/**
 * 删除
 * @returns
 */
export const del = (ids: Key) => http.get<boolean>(`${prefix}/del`, { ids })

/**
 * 获取用户列表
 */
export const getUsers = (deptIds: string) => http.get<User[]>(`${prefix}/getUsers`, { deptIds })

/**
 * 更新密码
 */
export const updatePassword = (params) => http.post<boolean>(`${prefix}/updPassword`, params)

/**
 * 获取用户权限
 */
export const getConfigRoles = (userId: Key) => http.get<Key[]>(`${prefix}/getConfigRoles`, { userId })

/**
 * 保存用户权限
 */
export const saveConfigRoles = (userId: Key, roleId: Key[]) =>
  http.post<boolean>(`${prefix}/saveConfigRoles`, roleId, { params: { userId } })
