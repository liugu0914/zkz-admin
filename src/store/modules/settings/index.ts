import { defineStore } from 'pinia'
import { store } from '@/store'
import { zkzVars, initSetting, changVarsByMode, changeVarsByCollapsed, generatePrimaryColor, changeMixSubWidth } from './helper'
import { updateDarkClass } from '@/utils/domUtils'

export const useSettingsStore = defineStore({
  id: 'settings',

  state: () => initSetting(),

  getters: {},
  actions: {
    setCollapsed(collapsed: Settings['collapsed']) {
      // this.collapsed = collapsed
      changeVarsByCollapsed(collapsed, this.showExtra, this.mode, this.vars)
    },
    setRound(isRound: Settings['isRound']) {
      // this.isRound = isRound
      this.vars['--zkz-radius'] = isRound ? zkzVars['--zkz-radius'] : '0px'
    },
    setCompact(compact: Settings['compact']) {
      // this.compact = compact
      this.vars['--zkz-padding'] = !compact ? zkzVars['--zkz-padding'] : '0px'
    },
    setTheme(theme: Settings['theme']) {
      // this.theme = theme
      updateDarkClass(theme)
      generatePrimaryColor(this.color, theme, this.vars)
    },
    setColor(color: Settings['color']) {
      // this.color = color
      generatePrimaryColor(color, this.theme, this.vars)
    },
    setVars(vars: Settings['vars']) {
      this.vars = vars
    },
    setMode(mode: Settings['mode']) {
      // this.mode = mode
      this.collapsed = false
      changVarsByMode(mode, this.vars)
    },
    setShowExtra(showExtra: boolean) {
      changeMixSubWidth(showExtra, this.vars)
    }
  }
})

// 在组件setup函数外使用
export function useSettingsWithOut() {
  return useSettingsStore(store)
}
