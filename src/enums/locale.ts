/**
 * 国际化语言
 */
export enum LOCALE {
  ZH_CN = 'zh-CN',
  EN_US = 'en-US'
}

/**
 * i18n key
 */
export const LOCALE_KEY = 'LOCALE_'

/**
 * 可选语言
 */
export const Locales = [
  {
    lang: LOCALE.ZH_CN,
    label: '简体中文',
    icon: '🇨🇳',
    title: '语言'
  },
  {
    lang: LOCALE.EN_US,
    label: 'English',
    icon: '🇺🇸',
    title: 'Language'
  }
] as const
