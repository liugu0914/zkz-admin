<template>
  <NConfigProvider abstract :theme="sideTheme">
    <NLayoutSider
      v-model:collapsed="collapsed"
      class="zkz-layout-shadow zkz-sider zkz-sider-radius"
      :class="{ 'zkz-sider-dark': sideDark }"
      collapse-mode="width"
      :collapsed-trigger-style="triggerStyle"
      :collapsed-width="collapsedWidth"
      :inverted="sideDark"
      show-trigger="bar"
      :trigger-style="triggerStyle"
      :width="width">
      <div class="h-full overflow-hidden w-full zkz-sider-radius">
        <div v-if="showSideLog" class="zkz-sider--logo">
          <NIcon :color="color" size="30">
            <SvgIcon name="logo" />
          </NIcon>
          <template v-if="mode !== 'mix'">
            <span v-if="!collapsed" class="font-bold ml-2 text-2xl">{{ appName }}</span>
          </template>
          <template v-else>
            <span v-if="showExtra" class="font-bold ml-2 text-2xl">{{ appName }}</span>
          </template>
        </div>
        <div class="zkz-sider--scroll" :class="scrollbarClass">
          <Component :is="menuComponent" :menus="menus" />
        </div>
      </div>
    </NLayoutSider>
  </NConfigProvider>
</template>
<script lang="ts" setup>
  import { useSettings } from '@/hooks/setting/useSettings'
  import { useNaive } from '@/hooks/setting/useNaive'
  import { useStore } from '@/store/modules/accout'
  import MixMenu from '@/layout/menu/mixMenu'
  import DefaultMenu from '@/layout/menu/defaultMenu.vue'
  import { computed } from 'vue'
  import { isString } from 'lodash-es'
  import SvgIcon from '@/components/svgIcon'

  const appName = computed(() => import.meta.env.VITE_APP_NAME)

  const { vars, mode, collapsed, sideDark, showSideLog, color, showExtra } = useSettings()

  const { sideTheme } = useNaive()

  const { getMenus: menus = [] } = useStore()

  const collapsedWidth = computed(() => {
    let siderMixSubWidth = vars.value['--zkz-sider-mix-sub-width']
    if (isString(siderMixSubWidth)) {
      siderMixSubWidth = parseInt(siderMixSubWidth.replace('px', '') || 0)
    }
    switch (mode.value) {
      case 'mix':
        return vars.value['--zkz-sider-collapsed-width-number'] + siderMixSubWidth
      default:
        return vars.value['--zkz-sider-collapsed-width-number']
    }
  })

  const menuComponent = computed(() => {
    return mode.value === 'mix' ? MixMenu : DefaultMenu
  })

  const width = computed(() => {
    let siderWidth = vars.value['--zkz-sider-width']
    if (isString(siderWidth)) {
      siderWidth = parseInt(siderWidth.replace('px', '') || 0)
    }
    let siderMixSubWidth = vars.value['--zkz-sider-mix-sub-width']
    if (isString(siderMixSubWidth)) {
      siderMixSubWidth = parseInt(siderMixSubWidth.replace('px', '') || 0)
    }
    switch (mode.value) {
      case 'mix':
        return siderWidth + siderMixSubWidth
      default:
        return siderWidth
    }
  })

  const scrollbarClass = computed(() => {
    switch (mode.value) {
      case 'outer':
        return ['has-header']
      case 'mix':
        return ['has-header']
      default:
        return []
    }
  })
  const triggerStyle = computed(() => {
    return { right: '-22px' }
  })
</script>
<style lang="postcss" scoped>
  .zkz-sider {
    @apply h-full transition-all duration-300;

    &--logo {
      @apply w-full transition-all duration-300 flex items-center justify-center;

      height: calc(var(--zkz-header-height) - var(--zkz-padding) - var(--zkz-padding));
    }

    :deep(&--scroll) {
      height: 100%;

      &.has-header {
        height: calc(100% - var(--zkz-header-height) + var(--zkz-padding) + var(--zkz-padding));
      }
    }
  }

  .zkz-sider-radius {
    border-radius: var(--zkz-radius);
  }
</style>
