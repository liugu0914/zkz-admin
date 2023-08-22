import { GlobalThemeOverrides } from 'naive-ui'
import { generate } from '@ant-design/colors'
import { getThemeConfig, isDark } from './default'
import { darkColor } from '@/enums/settings'
import { cloneDeep } from 'lodash-es'

type ColorType = 'primary' | 'info' | 'success' | 'warning' | 'error'
type ColorScene = '' | 'Suppl' | 'Hover' | 'Pressed' | 'Active'
type ColorKey = `${ColorType}Color${ColorScene}`
type ThemeColor = Partial<Record<ColorKey, string>>

type ColorAction = {
  scene: ColorScene
  index: number
}

/**
 * 全局主色系
 */
const colors: Record<ColorType, string> = {
  primary: '#1890ff',
  info: '#1890ff',
  success: '#52c41a',
  warning: '#faad14',
  error: '#f5222d'
}

/**
 * 获取主题配置
 */
export const themeConfig = (color: string) => {
  const tmpColors = cloneDeep(colors)
  tmpColors.primary = color
  const config = initNaiveThemeOverrides(tmpColors)

  return config
}

/** 获取主题颜色的各种场景对应的颜色 */
function getThemeColors(colors: [ColorType, string][]) {
  const colorActions: ColorAction[] = [
    { scene: '', index: 5 },
    { scene: 'Suppl', index: 5 },
    { scene: 'Hover', index: 4 },
    { scene: 'Pressed', index: 7 },
    { scene: 'Active', index: 1 }
  ]

  const themeColor: ThemeColor = {}

  colors.forEach((color) => {
    const [colorType, colorValue] = color
    const colorPalette = generate(colorValue, { backgroundColor: darkColor.generateColor, theme: isDark.value ? 'dark' : 'default' })
    colorActions.forEach((action) => {
      const colorKey: ColorKey = `${colorType}Color${action.scene}`
      themeColor[colorKey] = colorPalette[action.index]
    })
  })

  return themeColor
}

/** 获取naive的主题颜色 */
export function initNaiveThemeOverrides(colors: Record<ColorType, string>): GlobalThemeOverrides {
  const { primary, info, success, warning, error } = colors

  const themeColors = getThemeColors([
    ['primary', primary],
    ['info', info],
    ['success', success],
    ['warning', warning],
    ['error', error]
  ])

  const { commonConfig, compentConfig } = getThemeConfig()

  return {
    common: {
      ...commonConfig,
      ...themeColors
    },
    ...compentConfig
  }
}
