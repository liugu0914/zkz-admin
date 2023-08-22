<template>
  <div class="zkz-layout-content">
    <RouterView v-slot="{ Component, route }">
      <Transition appear mode="out-in" :name="animate" @after-enter="over" @after-leave="over" @before-enter="move" @before-leave="move">
        <div v-if="alive" :key="routeKey(route)" class="transition-content" :class="{ 'content-overflow-hidden': overflowHidden }">
          <Component :is="Component" />
        </div>
      </Transition>
    </RouterView>
  </div>
</template>
<script lang="ts" setup name="Content">
  import { RouterView } from 'vue-router'
  import { useRedo } from '@/hooks/system/useRedo'
  import { useSettings } from '@/hooks/setting/useSettings'
  import { ref } from 'vue'

  const { animate } = useSettings()

  const { alive } = useRedo()

  const overflowHidden = ref(false)

  const move = () => {
    overflowHidden.value = true
  }

  const over = () => {
    overflowHidden.value = false
  }
  const routeKey = (route) => {
    return route.path
  }
</script>
<style lang="postcss">
  .zkz-layout-content {
    @apply h-full w-full;

    .transition-content {
      @apply h-full w-full overflow-x-hidden overflow-y-auto;

      padding: var(--zkz-padding) var(--zkz-padding) var(--zkz-padding) var(--zkz-padding);

      &.content-overflow-hidden {
        @apply overflow-hidden;
      }
    }
  }
</style>
