import { useStoreWithOut } from '@/store/modules/accout'
import { setupRoutes } from '@/router/logic'
import { passwordLogin, logout as doLogout, getUserInfo, LoginInfo } from '@/api/common/auth'

const account = useStoreWithOut()

/**
 * 密码登录
 * @param form 账号密码
 */
const login = (form: { account: string; password: string }) => {
  return passwordLogin(form)
    .then((res) => {
      const tokenResult = res.data
      account.setToken(tokenResult.access_token, tokenResult.token_type, tokenResult.expires_in)
      return getUserInfo()
    })
    .then((res) => {
      afterLogin(res.data ?? {})
      return Promise.resolve(true)
    })
}

/**
 *  登陆之后数据处理
 */
const afterLogin = ({ user, organization, permissions, roles, menus }: LoginInfo) => {
  account.setUser(user)
  account.setOrganization(organization)
  account.setPermissions(permissions)
  account.setRoles(roles)
  setupRoutes(menus, (val) => {
    account.setMenus(val)
  })
}

/**
 * 登出
 */
const logout = () => {
  return doLogout().then(() => {
    account.clear()
    return Promise.resolve(true)
  })
}

export const useLogin = () => {
  return { login, afterLogin, logout }
}
