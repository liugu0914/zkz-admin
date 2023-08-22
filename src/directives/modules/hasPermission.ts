import { useStoreWithOut } from '@/store/modules/accout'
import { storeToRefs } from 'pinia'
import { App, DirectiveBinding, ObjectDirective, watchEffect } from 'vue'

const { getPermissions: permissions } = storeToRefs(useStoreWithOut())

type ArrStrMethod = 'every' | 'some'

/**
 * 检查权限是否存在
 * @param check 每个权限
 * @param method every or some
 * @returns boolean
 */
export const hasp = (check: string | string[], method: ArrStrMethod = 'every'): boolean => {
  const value = permissions.value
  if (value === null || value === undefined) {
    return false
  }
  const isRight = Array.isArray(check) ? check[method]((rights: string) => value.includes(rights)) : value.includes(check)
  return value.includes('*#*#*') || isRight
}

/**
 * 自定义指令
 */
const permissionDirective: ObjectDirective<HTMLElement, string | string[]> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
    const value = binding.value
    const arg = binding.arg as ArrStrMethod | undefined

    // 不存在 则不处理
    if (value === null || value === undefined || (typeof value !== 'string' && !Array.isArray(value))) {
      return
    }
    // const display = el.style.display
    watchEffect(() => {
      if (!hasp(value, arg)) {
        el.parentNode && el.parentNode.removeChild(el)
      }
      // el.style.display = !hasp(value, arg) ? 'none' : display
    })
  }
}

export type HaspType = typeof hasp

const install = (app: App) => {
  // 直接注入
  app.provide<HaspType>('hasp', hasp)
  // app.config.globalProperties.$hasp = hasp
  app.directive('hasp', permissionDirective)
}

export default install
