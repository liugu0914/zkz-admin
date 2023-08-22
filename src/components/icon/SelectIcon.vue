<template>
  <NPopover v-model:show="visible" :content-style="cardStyle" placement="bottom-start" trigger="click">
    <NRow :gutter="[10, 10]">
      <NCol v-for="font in res" :span="6">
        <div :class="{ 'icon-item': true, active: activeIcon === font }" @click="select(font)">
          <IconFont class="leading-none text-[24px]" :type="type" :value="font" />
        </div>
      </NCol>
    </NRow>
    <template #header>
      <NSpace justify="end">
        <NButton class="float-right" size="small" @click="reset">{{ t('common.resetText') }}</NButton>
      </NSpace>
    </template>
    <template #trigger>
      <span class="float-left">
        <div cLass="icon-choose-box">
          <PlusOutlined v-if="!isExits" class="icon-choose-box--center plus" />
          <IconFont v-else-if="isExits && activeIcon" class="icon-choose-box--center" :type="type" :value="activeIcon" />
        </div>
      </span>
    </template>
  </NPopover>
</template>
<script lang="ts" setup>
  import { storeToRefs } from 'pinia'
  import { PlusOutlined } from '@ant-design/icons-vue'
  import IconFont from './IconFont.vue'
  import { IconType, useCommonStore } from '@/store/modules/common'
  import { ref, toRefs, watch, computed, unref, reactive, CSSProperties } from 'vue'
  import { useI18n } from 'vue-i18n'

  interface Props {
    type: IconType
    value?: string
  }

  defineOptions({
    inheritAttrs: false
  })

  const { icon } = storeToRefs(useCommonStore())
  const { t } = useI18n()

  const props = withDefaults(defineProps<Props>(), {
    value: ''
  })
  const { type, value } = toRefs(props)

  const emits = defineEmits<{ (e: 'update:value', value?: string): void; (e: 'select', value?: string): void }>()

  const visible = ref(false)
  const res = icon.value[unref(type)]
  const cardStyle = reactive<CSSProperties>({ width: '250px', maxHeight: '250px', overflowY: 'auto' })
  const activeIcon = ref(value.value)
  const isExits = computed(() => {
    return res.includes(unref(activeIcon))
  })
  const select = (icon?: string) => {
    emits('update:value', icon)
    emits('select', icon)
    visible.value = false
    activeIcon.value = icon ?? ''
  }
  const reset = () => {
    select(undefined)
  }
  watch(value, (val) => {
    activeIcon.value = val
  })
</script>
<style lang="postcss" scoped>
  .icon-choose-box {
    @apply inline-flex border-2 border-gray-200  h-[52px] w-[52px] items-center justify-center cursor-pointer;

    border-radius: var(--zkz-radius);

    .icon-choose-box--center {
      @apply text-[40px];

      &.plus {
        @apply text-gray-300;
      }
    }
  }

  .icon-item {
    @apply flex items-center  h-[48px] w-[48px] justify-center cursor-pointer  border-2  border-transparent;

    border-radius: var(--zkz-radius);

    &:hover {
      border-color: var(--zkz-color-4);
    }

    &.active {
      border-color: var(--zkz-color-4);
    }
  }
</style>
