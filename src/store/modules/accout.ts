import { defineStore } from 'pinia'
import Storage from '@/utils/Storage'
import { store } from '@/store'

const TOKEN_TYPE = 'token_type'

export const useStore = defineStore({
  id: 'accout',

  state: (): UserState => ({
    user: undefined,
    token: undefined,
    organization: undefined,
    permissions: undefined,
    roles: undefined,
    menus: undefined
  }),

  getters: {
    getUser(): UserState['user'] {
      if (!this.user) {
        this.user = Storage.get(import.meta.env.VITE_USER_KEY)
      }
      return this.user
    },
    getToken(): UserState['token'] {
      if (!this.token) {
        const token = Storage.get<string>(import.meta.env.VITE_ACCESS_TOKEN_KEY)
        const tokenType = Storage.get<string>(TOKEN_TYPE, 'Bearer')
        this.token = token ? `${tokenType} ${token}` : undefined
      }
      return this.token
    },
    getOrganization(): UserState['organization'] {
      if (!this.organization) {
        this.organization = Storage.get(import.meta.env.VITE_ORGANIZATION_KEY)
      }
      return this.organization
    },
    getPermissions(): UserState['permissions'] {
      if (!this.permissions) {
        this.permissions = Storage.get(import.meta.env.VITE_PERMISSIONS_KEY)
      }
      return this.permissions
    },
    getRoles(): UserState['roles'] {
      if (!this.roles) {
        this.roles = Storage.get(import.meta.env.VITE_ROLES_KEY)
      }
      return this.roles
    },
    getMenus(): UserState['menus'] {
      if (!this.menus) {
        this.menus = Storage.get(import.meta.env.VITE_MENUS_KEY)
      }
      return this.menus
    }
  },
  actions: {
    /**
     * 清空token及用户信息
     */
    clear() {
      this.user = undefined
      this.token = undefined
      this.organization = undefined
      this.permissions = undefined
      this.roles = undefined
      this.menus = undefined
      Storage.clear()
    },

    setUser(user: User) {
      this.user = user ?? {}
      Storage.set(import.meta.env.VITE_USER_KEY, this.user)
    },

    setToken(token: string, tokenType: string, expiresIn: number) {
      Storage.set(import.meta.env.VITE_ACCESS_TOKEN_KEY, token, expiresIn)
      Storage.set(TOKEN_TYPE, tokenType)
      this.token = `${tokenType} ${token}`
    },

    setOrganization(organization: Organization) {
      this.organization = organization ?? {}
      Storage.set(import.meta.env.VITE_ORGANIZATION_KEY, this.organization)
    },

    setPermissions(permissions: string[]) {
      this.permissions = permissions ?? []
      Storage.set(import.meta.env.VITE_PERMISSIONS_KEY, this.permissions)
    },

    setRoles(roles: Role[]) {
      this.roles = roles ?? {}
      Storage.set(import.meta.env.VITE_ROLES_KEY, this.roles)
    },

    setMenus(menus: Menu[]) {
      this.menus = menus ?? []
      Storage.set(import.meta.env.VITE_MENUS_KEY, this.menus)
    },
    /**
     * 设置缓存数据
     * @param menus 菜单
     */
    setCacheMenus(menus: Menu[]) {
      this.menus = menus ?? []
    }
  }
})

// 在组件setup函数外使用
export function useStoreWithOut() {
  return useStore(store)
}
