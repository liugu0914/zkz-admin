<template>
  <div class="flex">
    <slot />
  </div>
</template>
<script lang="ts" setup>
  import { ColorKey } from '@/symbols/system'
  import { provide, ref, unref, watch, watchEffect } from 'vue'

  interface Props {
    color: string
  }
  const props = withDefaults(defineProps<Props>(), {
    color: ''
  })

  const value = ref(props.color)
  provide(ColorKey, value)
  watchEffect(() => {
    value.value = props.color
  })

  // 触发回调
  const emits = defineEmits<{ (e: 'update:color', value: string): void }>()
  watch(value, () => {
    emits('update:color', unref(value))
  })
</script>
