<template>
  <div ref="headerMenu" class="header-menu" :class="headerMenuClass">
    <NScrollbar class="h-full" content-class="h-full" :x-scrollable="true" @scroll="scroll">
      <div ref="menuRef" class="flex h-full items-center">
        <BaseMenu :menus="menus" mode="horizontal" />
      </div>
    </NScrollbar>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue'
  import BaseMenu from './BaseMenu'
  import { useStore } from '@/store/modules/accout'
  import { onMounted, computed, reactive } from 'vue'
  import { useResizeObserver } from '@vueuse/core'

  const { getMenus: menus } = useStore()
  const headerMenu = ref<HTMLElement>()
  const menuRef = ref<HTMLElement>()

  const scrollData = reactive({
    showBefore: false,
    showAfter: false,
    headerWidth: 0,
    menuWidth: 0,
    maxScroll: 0
  })

  onMounted(() => {
    const menuWidth = menuRef.value?.offsetWidth || 0
    scrollData.menuWidth = menuWidth
    useResizeObserver(headerMenu.value, (entries) => {
      const entry = entries[0]
      const { width } = entry.contentRect
      scrollData.headerWidth = width
      scrollData.maxScroll = menuWidth - width // 最大可滚动距离
      // console.log(width)
      // console.log(menuWidth)

      scrollData.showAfter = width < menuWidth
    })
  })

  const scroll = (e: Event) => {
    const scrollLeft = (e.target as HTMLElement).scrollLeft
    // console.log(scrollLeft)
    // console.log(scrollData.maxScroll)

    if (scrollLeft === 0) {
      scrollData.showBefore = false
      scrollData.showAfter = scrollData.headerWidth < scrollData.menuWidth
    } else if (scrollLeft > 0 && scrollLeft < scrollData.maxScroll) {
      scrollData.showBefore = true
      scrollData.showAfter = true
    } else {
      scrollData.showBefore = true
      scrollData.showAfter = false
    }
  }

  const headerMenuClass = computed(() => {
    return {
      'show-before-shadow': scrollData.showBefore,
      'show-after-shadow': scrollData.showAfter
    }
  })
</script>
<style lang="postcss" scoped>
  .header-menu {
    @apply h-full w-full relative;

    &::before {
      @apply absolute left-0 top-0 content-[''] w-[10px] h-full opacity-0 shadow-zinc-900 dark:shadow-zinc-50;

      box-shadow: inset 10px 0 8px -8px var(--tw-shadow-color);

      &.show-before-shadow {
        @apply opacity-20;
      }
    }

    &::after {
      @apply absolute right-0 top-0 content-[''] w-[10px] h-full opacity-0 shadow-zinc-900 dark:shadow-zinc-50;

      box-shadow: inset -10px 0 8px -8px var(--tw-shadow-color);

      &.show-after-shadow {
        @apply opacity-20;
      }
    }

    :deep(.n-menu-item-content-header) {
      overflow: inherit !important;
    }

    :deep(.n-menu-item-content) {
      margin-top: 2px;
    }
  }
</style>
