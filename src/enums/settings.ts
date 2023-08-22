import { presetPrimaryColors } from '@ant-design/colors'
import { omit } from 'lodash-es'

/**
 * 颜色主题
 */
export const themeColor = omit(presetPrimaryColors as Record<ThemeColor, string>, 'grey')

/**
 * 系统主题
 */
export const Theme = {
  light: 'light',
  dark: 'dark'
}

/**
 * 动画效果
 */
export const animateLabels: Record<AnimateType, string> = {
  'zoom-fade': '渐变',
  'zoom-out': '闪现',
  'fade-slide': '滑动',
  fade: '消退',
  'fade-bottom': '底部消退',
  'fade-scale': '缩放消退'
}

/**
 * 黑暗主题颜色 '#101014' #2c2c32 #18181c
 */
export const darkColor = {
  bodyColor: '#1a1a1a',
  componentColor: '#242424',
  generateColor: '#2f2f2f'
}

/**
 * 亮色主题颜色
 */
export const lightColor = '#f6f9f8'

/**
 * 系统主题
 */
export type ThemeType = keyof typeof Theme
