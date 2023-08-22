import http from '@/utils/http/axios'

import type { Permission } from './permission'

export interface ConfigRole {
  // 系统权限
  sys: Permission[]
  // 菜单权限
  menu: Menu[]
  // 菜单下权限
  fuc: {
    [key: Key]: Permission[]
  }
  // 已配置的权限
  pes: Key[]
}

const prefix = '/sys/role'

/**
 * 获取列表数据
 */
export const getList = (params: RecordAble) => {
  return http.post<Array<Role>>(`${prefix}/getList`, params)
}

/**
 * 通过Id查询数据

 */
export const getOne = (id: Key) => {
  return http.get<Role>(`${prefix}/getOneById`, { id })
}

/**
 * 保存数据

 */
export const save = (params: Partial<Role>) => {
  return http.post<boolean>(`${prefix}/save`, params)
}

/**
 * 删除数据
 */
export const del = (ids: string) => {
  return http.get<boolean>(`${prefix}/del`, { ids })
}

/**
 * 查询角色配置的数据
 */
export const getConfigPermission = (appId: Key, roleId: Key) => {
  return http.get<ConfigRole>(`${prefix}/getConfigPermission`, { appId, roleId })
}

export type SaveRoleConfig = {
  appId: Key
  roleId: Key
  sysPes: Key[]
  menuPes: Key[]
}

/**
 * 查询角色配置的数据
 */
export const savePermission = (params: SaveRoleConfig) => {
  return http.post<boolean>(`${prefix}/savePermission`, params)
}
