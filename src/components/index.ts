import { App, nextTick } from 'vue'
import { createFromIconfontCN } from '@ant-design/icons-vue'
import { useCommonStoreWithOut } from '@/store/modules/common'
import { NGrid, NRow } from 'naive-ui'
import { check } from '@/api/common/auth'
import { login } from '@/router/routes'
import { router } from '@/router'
import to from '@/utils/await-to'
import { useStoreWithOut } from '@/store/modules/accout'
import { useNaive } from '@/hooks/setting/useNaive'
import { useI18n } from '@/hooks/locale/useI18n'
import 'virtual:svg-icons-register'

// const isDev = import.meta.env.DEV

const prefix = import.meta.env.BASE_URL

export function registerGlobComp(app: App) {
  app.component('NGrid', NGrid)
  app.component('NRow', NRow)

  iconfontConfig(app)

  afterTailwind()

  checkAuth()
}

/**
 * 字体图标配置
 */
const iconfontConfig = (app: App) => {
  const modules = import.meta.glob('@/assets/icon/**/*.json', { eager: true }) as RecordAble<any>

  const common = useCommonStoreWithOut()
  const iconData: IconData = {}
  for (const key in modules) {
    const str = key.split('/')
    const name = str[str.length - 1].replace('.json', '')
    const Icon = createFromIconfontCN({
      scriptUrl: prefix + `/icon/${name}.js` // 在 iconfont.cn 上生成
    })
    const componentName = name.charAt(0).toUpperCase() + name.slice(1) + 'Icon'
    const icons: Array<string> = []
    modules[key].glyphs.forEach((icon) => {
      icons.push(modules[key].css_prefix_text + icon.font_class)
    })
    iconData[name] = icons
    app.component(componentName, Icon)
  }
  // console.log(icons)
  common.setIcon(iconData)
}

/**
 * 处理tailwindcss 样式冲突
 */
const afterTailwind = () => {
  if (document === undefined) {
    return
  }
  const meta = document.createElement('meta')
  meta.name = 'naive-ui-style'
  document.head.appendChild(meta)
}

/**
 * 检查token是否有效
 */
const checkAuth = async () => {
  const { message } = useNaive()
  const { t } = useI18n()
  const { getToken, clear } = useStoreWithOut()
  // 此处只存在于 login page
  if (!getToken) {
    return
  }

  const [, checkData] = await to(check())

  if (checkData && !checkData.data) {
    // 为false 表示token无效,重定向登录页面
    message.warning(t('system.ex401'))
    nextTick(() => {
      clear()
      router.push({ name: login })
    })
  }
}
