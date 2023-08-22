<template>
  <NLayout class="zkz-layout">
    <div class="zkz-layout__header" :class="headerClass">
      <Header />
    </div>
    <NLayout class="zkz-layout--main" has-sider>
      <div class="zkz-layout--dynamic" :class="dynamicClass">
        <div v-if="showTabs" class="zkz-layout__tabs">
          <Tabs />
        </div>
        <div class="zkz-layout__content">
          <Content />
        </div>
        <div v-if="showFooter" class="zkz-layout__footer">
          <Footer />
        </div>
      </div>
      <div v-if="showSide" class="zkz-layout--sider" :class="siderClass">
        <Sider />
      </div>
    </NLayout>
  </NLayout>
</template>
<script lang="ts" setup>
  import Tabs from '@/layout/tabs/index'
  import Header from '@/layout/header/index.vue'
  import Sider from '@/layout/sider/index.vue'
  import Content from '@/layout/content/index.vue'
  import Footer from '@/layout/footer/index.vue'
  import { useSettings } from '@/hooks/setting/useSettings'
  import { computed } from 'vue'

  const { mode, showSide, showTabs, showFooter } = useSettings()

  const headerClass = computed(() => {
    switch (mode.value) {
      case 'outer':
        return ['outer—header']
      case 'mix':
        return ['outer—header']
      default:
        return []
    }
  })
  const siderClass = computed(() => {
    switch (mode.value) {
      case 'outer':
        return ['outer—header']
      case 'mix':
        return ['outer—header']
      default:
        return []
    }
  })
  const contentHeight = computed(() => {
    if (!showTabs.value && !showFooter.value) {
      return '100%'
    }
    return `calc(100% ${showTabs.value ? '- var(--zkz-tabs-height)' : ''}  ${showFooter.value ? '- var(--zkz-footer-height)' : ''})`
  })

  const dynamicClass = computed(() => {
    return mode.value !== 'top' ? ['has-sider'] : []
  })
</script>
<style lang="postcss">
  .zkz-layout {
    @apply w-full h-full;

    &--main {
      @apply w-full static;

      height: calc(100% - var(--zkz-header-height));
    }

    &--dynamic {
      @apply w-full h-full transition-all duration-300;

      &.has-sider {
        padding-left: calc(var(--zkz-sider-width) + var(--zkz-padding));
      }
    }

    &--sider {
      @apply absolute bottom-0 left-0 transition-all duration-300;

      z-index: var(--zkz-sider-z-index);
      width: calc(var(--zkz-sider-width) + var(--zkz-padding));
      height: calc(100% - var(--zkz-header-height));
      padding-bottom: var(--zkz-padding);
      padding-left: var(--zkz-padding);

      &.outer—header {
        height: 100%;
        padding-top: var(--zkz-padding);
      }
    }

    &__header {
      @apply w-full transition-all duration-300;

      height: var(--zkz-header-height);
      padding: var(--zkz-padding);

      &.outer—header {
        padding-left: calc(var(--zkz-sider-width) + var(--zkz-padding) + var(--zkz-padding));
      }
    }

    &__tabs {
      @apply transition-all duration-300;

      height: var(--zkz-tabs-height);
    }

    &__content {
      @apply transition-all duration-300 overflow-hidden;

      height: v-bind('contentHeight');
    }
  }
</style>
