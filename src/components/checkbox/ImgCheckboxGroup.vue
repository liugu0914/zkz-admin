<template>
  <div class="flex">
    <slot />
  </div>
</template>
<script lang="ts" setup>
  import { ThemeKey } from '@/symbols/system'
  import { ThemeType } from '@/enums/settings'
  import { ref, provide, unref, watch } from 'vue'

  interface Props {
    defaultValue: ThemeType
  }
  const props = defineProps<Props>()

  const value = ref(props.defaultValue)

  provide(ThemeKey, value)

  // 触发回调
  const emits = defineEmits<{ (e: 'change', value: ThemeType): void }>()
  watch(value, () => {
    emits('change', unref(value))
  })
</script>
