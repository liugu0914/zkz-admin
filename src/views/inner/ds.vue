<template>
  <NCard :bordered="false" class="h-full w-full">
    <NSpin :show="show">
      <DS :file-id="fileId" @ready="ready" />
    </NSpin>
  </NCard>
</template>

<script lang="ts" setup>
  import DS from '@/components/onlyoffice/ds'
  import { ref, toRefs } from 'vue'
  interface Props {
    fileId: Key
  }
  const props = defineProps<Props>()

  const { fileId } = toRefs(props)

  const show = ref(true)

  const ready = () => {
    show.value = false
  }
</script>
<style lang="postcss" scoped>
  :deep(.n-spin-container) {
    @apply h-full w-full;

    .n-spin-content {
      @apply h-full w-full;
    }
  }
</style>
