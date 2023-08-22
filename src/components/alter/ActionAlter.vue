<template>
  <div :class="['permission-item', color]">
    <slot v-if="$slots.header" name="header" />
    <DragOutlined v-else class="cursor-move mr-1 permission-drag-able" />
    <span>{{ message }}</span>
    <div class="permission-item-action">
      <slot v-if="hasSlot" name="default" />
      <template v-else>
        <NSpace size="small">
          <NTooltip>
            <template #trigger>
              <NA @click="edit">
                <EditOutlined />
              </NA>
            </template>
            {{ t('common.editText') }}
          </NTooltip>
          <NPopconfirm :title="t('common.delConfirm')" @positive-click="del">
            <template #trigger>
              <NTooltip>
                <template #trigger>
                  <NA>
                    <DeleteOutlined />
                  </NA>
                </template>
                {{ t('common.delText') }}
              </NTooltip>
            </template>
            {{ t('common.delConfirm') }}
          </NPopconfirm>
        </NSpace>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { toRefs, computed, useSlots } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useThemeVars } from 'naive-ui'
  import { EditOutlined, DeleteOutlined, DragOutlined } from '@ant-design/icons-vue'
  interface Props {
    message: string
    disabled?: boolean
  }
  interface Emits {
    (e: 'edit'): void
    (e: 'delete'): void
  }

  const { t } = useI18n()
  const props = withDefaults(defineProps<Props>(), {
    disabled: false
  })
  const emits = defineEmits<Emits>()

  const slots = useSlots()

  const { message, disabled } = toRefs(props)

  const color = computed(() => {
    return disabled.value ? 'gray' : 'normal'
  })

  const hasSlot = computed(() => {
    return !!slots.default
  })

  const edit = () => {
    emits('edit')
  }

  const del = () => {
    emits('delete')
  }

  const themeVars = useThemeVars()
</script>

<style lang="postcss">
  .permission-item {
    position: relative;
    padding: 8px 16px;
    margin: 0;
    overflow: auto;
    line-height: 1.5;
    list-style: none;
    border-radius: var(--zkz-radius);

    &.normal {
      background-color: var(--zkz-color-1);
    }

    &.gray {
      background-color: v-bind('themeVars.iconColor');
    }

    .permission-item-action {
      float: right;
    }
  }
</style>
