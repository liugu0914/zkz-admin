import http from '@/utils/http/axios'

const prefix = '/sys/permission'

export interface Permission extends Base {
  name: string
  appId: Key
  target: string
  charm: string
  menuId: Key
  type: 'sys' | 'menu' | 'menu-query' | 'fuc'
  enable: number
  orderNum: number
}

export interface PermissionDetail extends Partial<Base> {
  key?: Key
  target: string
  charm?: string
}

export interface PermissionForm extends Partial<Permission> {
  permissions: PermissionDetail[]
}

/**
 * appId获取系统配置权限
 */
export const getSys = (appId?: Key) => {
  return http.get<Array<Permission>>(`${prefix}/getSys`, { appId })
}

/**
 * appId获取菜单配置权限
 */
export const getMenu = (appId?: Key) => {
  return http.get<Array<Menu>>(`${prefix}/getMenu`, { appId })
}

/**
 * appId获取所有菜单配置权限
 */
export const getConfigMenu = (appId?: Key) => {
  return http.get<Array<Menu>>(`${prefix}/getConfigMenu`, { appId })
}

/**
 * menuId获取菜单配置权限
 */
export const getFuc = (menuId?: Key) => {
  return http.get<Array<Permission>>(`${prefix}/getFuc`, { menuId })
}

/**
 * 保存菜单配置
 */
export const saveMenu = (appId: Key, menuIds: Key[]) => {
  return http.post<boolean>(`${prefix}/saveMenu`, menuIds, { params: { appId } })
}

/**
 * 保存权限
 */
export const savePes = (form: PermissionForm) => {
  return http.post<boolean>(`${prefix}/savePes`, form)
}

/**
 * 保存权限s
 */
export const getPes = (id: Key) => {
  return http.get<PermissionForm>(`${prefix}/getPes`, { id })
}

/**
 * 删除数据
 */
export const del = (ids: string) => {
  return http.get<boolean>(`${prefix}/del`, { ids })
}

/**
 * 移动顺序
 */
export const moveOrder = (items: Permission[]) => {
  return http.post<boolean>(`${prefix}/moveOrder`, items)
}
