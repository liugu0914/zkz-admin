<template>
  <NScrollbar class="h-full">
    <BaseMenu
      :accordion="false"
      :collapsed="collapsed"
      :collapsed-icon-size="vars['--zkz-sider-collapsed-icon-size']"
      :collapsed-width="vars['--zkz-sider-collapsed-width-number']"
      :inverted="sideDark"
      :menus="menus" />
  </NScrollbar>
</template>
<script lang="ts" setup>
  import { useSettings } from '@/hooks/setting/useSettings'
  import { toRefs } from 'vue'
  import BaseMenu from './BaseMenu'

  const { vars, sideDark, collapsed } = useSettings()

  interface Props {
    menus: Menu[]
  }
  const props = defineProps<Props>()
  const { menus } = toRefs(props)
</script>
<style lang="postcss" scoped>
  .default-menu {
    @apply overflow-hidden;
  }
</style>
