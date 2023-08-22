import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { NButton, NDrawer, NDrawerContent } from 'naive-ui'
import { modalProps } from './props'
import { getModalProps } from './helper'
import { call } from '@/utils/base'
import { isFunction } from 'lodash-es'

/**
 * 模态框
 */
export default defineComponent({
  name: 'Modal',
  inheritAttrs: false,
  props: modalProps,
  setup(props, { slots }) {
    const { t } = useI18n()

    const loading = ref(false)

    const { data, contentData } = getModalProps(props, loading)
    const contentSlots = () => {
      return {
        header: slots.header ? slots.header() : null,
        default: slots.default ? slots.default() : null,
        footer: slots.footer ? (
          slots.footer()
        ) : (
          <>
            <div class='flex items-center justify-end'>
              <NButton onClick={doCancel}>{props.cancelText || t('component.modal.cancel')}</NButton>
              <NButton type='primary' class='!ml-2' onClick={doConfirm} loading={loading.value}>
                {props.confirmText || t('component.modal.confirm')}
              </NButton>
            </div>
          </>
        )
      }
    }
    /**
     * 确认
     */
    const doConfirm = () => {
      loading.value = true
      props.onConfirm &&
        isFunction(props.onConfirm) &&
        call(props.onConfirm, () => {
          loading.value = false
        })
    }
    /**
     * 取消
     */
    const doCancel = () => {
      if (props.onCancel) {
        call(props.onCancel)
      } else {
        if (props.onUpdateShow) {
          call(props.onUpdateShow, false)
        }
        if (props['onUpdate:show']) {
          call(props['onUpdate:show'], false)
        }
      }
    }

    return () => (
      <NDrawer {...data.value}>
        <NDrawerContent {...contentData.value}>{contentSlots()}</NDrawerContent>
      </NDrawer>
    )
  }
})
