import { useSettingsWithOut } from '@/store/modules/settings'
import { storeToRefs } from 'pinia'
import { computed, watch } from 'vue'

const sets = useSettingsWithOut()
const settings = storeToRefs(sets)

/**
 * 监听collapsed变化
 */
watch(settings.collapsed, (value) => sets.setCollapsed(value))
watch(settings.showExtra, (value) => sets.setShowExtra(value))
watch(settings.compact, (value) => sets.setCompact(value))
watch(settings.isRound, (value) => sets.setRound(value))
watch(settings.color, (value) => sets.setColor(value), { flush: 'sync' })
watch(settings.theme, (value) => sets.setTheme(value), { flush: 'sync' })
watch(settings.mode, (value) => sets.setMode(value))

// ============= side ====================
const showSide = computed(() => {
  return settings.mode.value === 'inner' || settings.mode.value === 'outer' || settings.mode.value === 'mix'
})

const showSideLog = computed(() => {
  return settings.mode.value === 'outer' || settings.mode.value === 'mix'
})

// ============= header ====================
const showHeaderLog = computed(() => {
  return settings.mode.value === 'inner' || settings.mode.value === 'top'
})

const showHeaderMenu = computed(() => {
  return settings.mode.value === 'top'
})

export function useSettings() {
  return {
    ...settings,
    showSide,
    showSideLog,
    showHeaderLog,
    showHeaderMenu
  }
}
