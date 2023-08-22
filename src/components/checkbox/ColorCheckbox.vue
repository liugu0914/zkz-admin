<template>
  <div class="theme-color" :style="{ backgroundColor: color }" @click="toggle">
    <CheckOutlined v-if="checked" />
  </div>
</template>
<script lang="ts" setup>
  import { CheckOutlined } from '@ant-design/icons-vue'
  import { ColorKey } from '@/symbols/system'
  import { inject, ref, toRefs, unref, watchEffect } from 'vue'
  interface Props {
    color: string
  }
  const props = defineProps<Props>()
  const { color } = toRefs(props)
  const defaultColor = inject(ColorKey, ref(''))
  const checked = ref(false)
  watchEffect(() => {
    checked.value = unref(defaultColor) === unref(color)
  })
  const toggle = () => {
    defaultColor.value = unref(color)
  }
</script>

<style lang="postcss" scoped>
  .theme-color {
    @apply w-[20px] h-[20px] mr-[6px] font-bold text-white cursor-pointer rounded-[2px] flex  justify-center items-center;
  }
</style>
