import { updateDarkClass } from '@/utils/domUtils'
import { generate } from '@ant-design/colors'
import { ThemeType, darkColor, themeColor } from '@/enums/settings'
import { cloneDeep } from 'lodash-es'
/**
 * 默认的系统参数
 */
// 折叠后菜单的宽度
const collapsedWidth = 60
const mixCollapsedWidth = 60

export const zkzVars: ZkzVarsType = {
  '--zkz-color': themeColor.blue,
  '--zkz-padding': '12px',
  '--zkz-radius': '8px',
  '--zkz-header-height': '70px',
  '--zkz-header-z-index': 90,
  '--zkz-tabs-height': '50px',
  '--zkz-tabs-z-index': 90,
  '--zkz-footer-height': '40px',
  '--zkz-footer-z-index': 90,

  // sider,折叠相关
  '--zkz-sider-width': '230px',
  '--zkz-sider-collapsed-icon-size': 24,
  '--zkz-sider-collapsed-width-number': collapsedWidth,
  '--zkz-sider-collapsed-width': `${collapsedWidth}px`,
  '--zkz-sider-mix-width': '80px',
  '--zkz-sider-mix-sub-width': '200px', // 扩展菜单宽度
  '--zkz-sider-mix-collapsed-width-number': mixCollapsedWidth,
  '--zkz-sider-mix-collapsed-width': `${mixCollapsedWidth}px`,
  '--zkz-sider-z-index': 92
}

/**
 * 默认配置
 */
const defaultSettings: Settings = {
  collapsed: false, // 是否收缩菜单
  showExtra: false, // 是否显示mix中的子菜单
  theme: 'light', // 主题 light dark
  animate: 'fade-slide', // 路由切换效果
  color: themeColor.blue, // 主色
  mode: 'outer', // 界面布局 inner：内联 outer ：外联 top:顶部菜单 mix : 混合菜单
  shadow: true, // 是否启用布局阴影
  compact: false, // 是否开启紧凑模式
  isRound: true, // 是否为圆角
  vars: cloneDeep(zkzVars), // css 变量
  sideDark: false, // 菜单反色
  gray: false, // 灰色模式
  weak: false, // 色弱模式
  showTabs: true, // 是否显示标签页
  showFooter: false, // 是否显示底部
  showWatermark: true, // 水印
  watermarkContent: 'ZKZ ADMIN' // 水印内容
}

/**
 * 初始化
 */
export const initSetting = (): Settings => {
  const settings = cloneDeep(defaultSettings)
  const { isRound, compact, color, collapsed, showExtra, vars, theme, mode } = settings

  vars['--zkz-padding'] = !compact ? zkzVars['--zkz-padding'] : '0px'
  vars['--zkz-radius'] = isRound ? zkzVars['--zkz-radius'] : '0px'

  generatePrimaryColor(color, theme, vars)
  updateDarkClass(theme)
  changeVarsByCollapsed(collapsed, showExtra, mode, vars)
  changVarsByMode(mode, vars)
  changeMixSubWidth(showExtra, vars)

  return settings
}

export const changeMixSubWidth = (showExtra: Settings['showExtra'], vars: Settings['vars']) => {
  vars['--zkz-sider-mix-sub-width'] = showExtra ? zkzVars['--zkz-sider-mix-sub-width'] : '0px'
}

/**
 * @param color 主色
 * @param vars 变量
 */
export const generatePrimaryColor = (color: string, theme: ThemeType, vars: Settings['vars']) => {
  vars['--zkz-color'] = color
  const colors = generate(color, { backgroundColor: darkColor.generateColor, theme: theme === 'dark' ? 'dark' : 'default' })
  colors.map((item, index) => {
    vars[`--zkz-color-${index + 1}`] = item
  })
}

/**
 * 根据Collapsed变换
 * @param collapsed 是否收缩菜单
 * @param mode 模式
 * @param vars 变量
 */
export const changeVarsByCollapsed = (
  collapsed: Settings['collapsed'],
  show: Settings['showExtra'],
  mode: Settings['mode'],
  vars: Settings['vars']
) => {
  switch (mode) {
    case 'mix':
      vars['--zkz-sider-width'] = collapsed ? zkzVars['--zkz-sider-mix-collapsed-width'] : zkzVars['--zkz-sider-mix-width']
      break
    default:
      vars['--zkz-sider-width'] = collapsed ? zkzVars['--zkz-sider-collapsed-width'] : zkzVars['--zkz-sider-width']
      break
  }
}

/**
 * 根据mode变换
 * @param mode 模式
 * @param vars 变量
 */
export const changVarsByMode = (mode: Settings['mode'], vars: Settings['vars']) => {
  switch (mode) {
    case 'mix':
      vars['--zkz-sider-width'] = zkzVars['--zkz-sider-mix-width']
      vars['--zkz-sider-collapsed-width-number'] = zkzVars['--zkz-sider-mix-collapsed-width-number']
      vars['--zkz-sider-collapsed-width'] = zkzVars['--zkz-sider-mix-collapsed-width']
      break
    default:
      vars['--zkz-sider-width'] = zkzVars['--zkz-sider-width']
      vars['--zkz-sider-collapsed-width-number'] = zkzVars['--zkz-sider-collapsed-width-number']
      vars['--zkz-sider-collapsed-width'] = zkzVars['--zkz-sider-collapsed-width']
      break
  }
}
