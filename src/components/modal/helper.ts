import { DrawerProps, DrawerContentProps, drawerProps, drawerContentProps } from 'naive-ui'
import { ModalProps } from './props'
import { Ref, computed } from 'vue'
import { isFunction } from 'lodash-es'
import { call } from '@/utils/base'

export const getModalProps = (props: ModalProps, loading: Ref<boolean>) => {
  const data = computed(() => {
    const dProps = {} as DrawerProps
    Object.keys(drawerProps).map((key) => {
      if (props[key]) {
        dProps[key] = props[key]
      }
    })
    dProps.onAfterLeave = props.onClose || props.onAfterLeave
    const onAfterLeave = () => {
      if (dProps.onAfterLeave && isFunction(dProps.onAfterLeave)) {
        call(dProps.onAfterLeave)
      }
      loading.value = false
    }
    return { ...dProps, nativeScrollbar: true, scrollbarProps: undefined, onAfterLeave, width: dProps.width ? dProps.width : 400 }
  })

  const contentData = computed(() => {
    const contentProps = {} as DrawerContentProps
    Object.keys(drawerContentProps).map((key) => {
      if (props[key]) {
        contentProps[key] = props[key]
      }
    })
    return { ...contentProps, closable: true }
  })
  return { data, contentData }
}
