<template>
  <ATooltip :title="title">
    <div class="img-check-box" @click="toggle">
      <img :height="height" :src="imgSrc" :width="width" />
      <div v-if="checked" class="check-item">
        <CheckOutlined />
      </div>
    </div>
  </ATooltip>
</template>
<script lang="ts" setup>
  import { CheckOutlined } from '@ant-design/icons-vue'

  import { ThemeKey } from '@/symbols/system'
  import { inject, ref, toRefs, unref, watchEffect } from 'vue'
  interface Props {
    title?: string
    imgSrc: string
    height?: number
    width?: number
    value: string
  }
  const props = defineProps<Props>()
  const { value } = toRefs(props)
  const defaultValue = inject(ThemeKey, ref('sideDark'))
  const checked = ref(false)

  watchEffect(() => {
    checked.value = unref(defaultValue) === unref(value)
  })
  /**
   * 赋值点击的选项
   */
  const toggle = () => {
    defaultValue.value = unref(value)
  }
</script>

<style lang="postcss" scoped>
  .img-check-box {
    position: relative;
    margin-right: 16px;
    cursor: pointer;
    border-radius: 4px;

    .check-item {
      position: absolute;
      top: 0;
      right: 0;
      width: 100%;
      height: 100%;
      padding-top: 15px;
      padding-left: 24px;
      font-size: 14px;
      font-weight: bold;
      color: var(--zkz-color);
    }
  }
</style>
