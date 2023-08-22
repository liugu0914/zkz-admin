/* eslint-disable no-console */
import { NavigationGuardNext, NavigationHookAfter, RouteLocationNormalized } from 'vue-router'
import { useNaive } from '@/hooks/setting/useNaive'
import { useI18n } from '@/hooks/locale/useI18n'
import { useStoreWithOut } from '@/store/modules/accout'
import { storeToRefs } from 'pinia'
import { getFirstAbleMenu } from '@/utils/base'
import { router } from '../index'
import { ref } from 'vue'

const accout = useStoreWithOut()

const { getToken, getMenus } = storeToRefs(accout)

const { message, loadingBar } = useNaive()

const isLoading = ref(false)

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

/**
 * 扩展导航守卫
 */
interface OverNavigationGuard {
  (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext,
    whiteNameList: Array<RouteLocationNormalized['name']>
  ): void
}

/**
 * 动态导航
 */
export interface guardOrder {
  beforeEach: Array<OverNavigationGuard>
  afterEach: Array<NavigationHookAfter>
}

/**
 * 进度条开始
 * @param to
 * @param form
 * @param next
 */
const progressStart: OverNavigationGuard = (to, from, next) => {
  // start progress bar
  if (!isLoading.value) {
    loadingBar.start()
    isLoading.value = true
  }

  console.log('from: ', from)
  console.log('to  : ', to)
  next()
}

/**
 * 登录守卫
 * @param to
 * @param from
 * @param next
 * @param WHITE_NAME_LIST
 */
const loginGuard: OverNavigationGuard = (to, from, next, WHITE_NAME_LIST) => {
  // 放行不需要认证的路由
  if (to.matched.some((record) => record.meta.requiresAuth === false)) {
    return next()
  }
  if (!WHITE_NAME_LIST.includes(to.name) && !getToken.value) {
    const { t } = useI18n()
    message.warning(t('system.ex401'))
    loadingBar.error()
    isLoading.value = false
    accout.clear()
    next({ name: 'login' })
  } else {
    next()
  }
}

/**
 * 检查main路由
 * @param to
 * @param form
 * @param next
 */
const getFirstRouter: OverNavigationGuard = (to, from, next) => {
  if (router.hasRoute('main') && to.name === 'main' && getMenus.value) {
    // 获取第一个路由name
    const firstRouterName = getFirstAbleMenu(getMenus.value)?.router
    if (firstRouterName && router.hasRoute(firstRouterName)) {
      return next({ name: firstRouterName })
    }
  }
  next()
}

/**
 * 进度条结束
 */
const progressEnd: NavigationHookAfter = () => {
  // end progress bar
  if (isLoading.value) {
    loadingBar.finish()
    isLoading.value = false
  }
}

/**
 * 默认导航列表
 */
export default {
  beforeEach: [progressStart, loginGuard, getFirstRouter],
  afterEach: [progressEnd]
} as guardOrder
