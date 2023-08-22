import { createDiscreteApi, ConfigProviderProps, darkTheme, lightTheme } from 'naive-ui'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useSettingsWithOut } from '@/store/modules/settings'
import { themeConfig } from './helper'

const { theme, color, sideDark } = storeToRefs(useSettingsWithOut())

/**
 * 主题配置
 */
const configProvider = computed<ConfigProviderProps>(() => {
  return {
    abstract: true,
    theme: theme.value === 'light' ? lightTheme : darkTheme,
    themeOverrides: themeConfig(color.value)
  }
})

console.log(configProvider.value)

const naiveApi = createDiscreteApi(['message', 'dialog', 'notification', 'loadingBar'], {
  configProviderProps: configProvider,
  messageProviderProps: {
    max: 3
  }
})
const sideTheme = computed(() => {
  if (theme.value === 'dark') {
    return darkTheme
  }
  return sideDark.value ? darkTheme : lightTheme
})

/**
 *
 * 全局配置导出
 */
export const useNaive = () => {
  return { configProvider, sideTheme, ...naiveApi }
}
