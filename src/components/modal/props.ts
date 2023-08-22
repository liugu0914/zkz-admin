import { drawerProps, drawerContentProps } from 'naive-ui'
import { ExtractPublicPropTypes, PropType } from 'vue'

export const modalProps = {
  ...drawerContentProps,
  ...drawerProps,
  // 显示底部 控制底部按钮
  showFooter: {
    type: Boolean
  },
  // 确认
  onConfirm: {
    type: Function as PropType<(done: () => void) => void>
  },
  // 取消
  onCancel: {
    type: Function
  },
  // 关闭
  onClose: {
    type: Function as PropType<() => void>
  },
  // 确认 文本
  confirmText: {
    type: String
  },
  // 取消 文本
  cancelText: {
    type: String
  }
}

export type ModalProps = ExtractPublicPropTypes<typeof modalProps>
