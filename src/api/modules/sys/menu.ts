import http from '@/utils/http/axios'

const prefix = '/sys/menu'

export interface MenuPermission extends Partial<Base> {
  key?: Key
  target: string
  charm?: string
}

/**
 * 列表查询
 * @returns
 */
export const getMenusTree = (params: RecordAble = {}) => http.post<Menu[]>(`${prefix}/getMenusTree`, params)

/**
 * 获取单个数据
 * @returns
 */
export const getOne = (id: Key) => http.get<Menu>(`${prefix}/getOneById`, { id })

/**
 * 保存数据
 */
export const save = (data: Partial<Menu>) => http.post<boolean>(`${prefix}/save`, data)

/**
 * 获取父级菜单

 */
export const getSuperMenus = (appId: Key) => http.get<Menu[]>(`${prefix}/getSuperMenus`, { appId })

/**
 * 删除
 */
export const del = (ids: Key) => http.get<boolean>(`${prefix}/del`, { ids })

/**
 * 根据菜单Id获取菜单权限信息
 */
export const getPermissionsByMenuId = (id: Key) => http.get<MenuPermission[]>(`${prefix}/getPermissionsByMenuId`, { id })

/**
 * 保存菜单权限
 */
export const savePermission = (id: Key, menuPermissions: MenuPermission[]) => {
  return http.post<boolean>(`${prefix}/savePermission`, menuPermissions, { params: { id } })
}
