import { GlobalThemeOverrides } from 'naive-ui'
import { useSettingsWithOut } from '@/store/modules/settings'
import { darkColor, lightColor } from '@/enums/settings'
import { storeToRefs } from 'pinia'
import { lightOrDark } from '@/utils/base'
import { computed } from 'vue'

const { theme, color, vars } = storeToRefs(useSettingsWithOut())

type CommonConfig = GlobalThemeOverrides['common']

type ComponentConfig = Omit<GlobalThemeOverrides, 'common'>

export const isDark = computed(() => {
  return theme.value === 'dark'
})

/**
 *  common配置
 * @param theme 主题色
 * @param primary 主色
 */
const getCommonConfig = (): CommonConfig => {
  const light: CommonConfig = {
    bodyColor: lightColor
  }
  const dark: CommonConfig = {
    bodyColor: darkColor.bodyColor,
    cardColor: darkColor.componentColor
  }

  const common: CommonConfig = {
    ...(isDark.value ? dark : light),

    borderRadius: vars.value['--zkz-radius'] as string
  }
  return common
}

/**
 *
 *  组件配置
 * @param theme 主题色
 * @param primary 主色
 */
const getCompentConfig = (): ComponentConfig => {
  console.log('primary color is  ', color.value)
  const textColor = lightOrDark(color.value) === 'dark' ? '#ffffffd1' : '#000'

  const light: ComponentConfig = {
    Layout: {
      footerColor: lightColor
    }
  }
  const dark: ComponentConfig = {
    Layout: {
      footerColor: darkColor.componentColor
    },
    Button: {
      textColorPrimary: textColor,
      textColorHoverPrimary: textColor,
      textColorPressedPrimary: textColor,
      textColorFocusPrimary: textColor,
      textColorDisabledPrimary: textColor,
      textColorError: textColor,
      textColorHoverError: textColor,
      textColorPressedError: textColor,
      textColorFocusError: textColor,
      textColorDisabledError: textColor
    },
    Radio: {
      buttonTextColorActive: textColor
    },
    Checkbox: {
      checkMarkColor: textColor
    }
  }

  const common: ComponentConfig = {
    ...(isDark.value ? dark : light),

    Menu: {
      itemColorActive: vars.value['--zkz-color-1'],
      itemColorActiveHover: vars.value['--zkz-color-1'],
      itemColorActiveCollapsed: vars.value['--zkz-color-1']
    },
    Tree: {
      nodeColorActive: vars.value['--zkz-color-1']
    },
    LoadingBar: {
      colorLoading: color.value
    }
  }
  return common
}

/**
 *
 *  组件配置.
 * @param theme 主题色
 * @param primary 主色
 */
export const getThemeConfig = () => {
  const commonConfig = getCommonConfig()
  const compentConfig = getCompentConfig()
  return { commonConfig, compentConfig }
}
