import { NUpload } from 'naive-ui'
import { defineComponent } from 'vue'
import { upProps } from './type'
import { getUploadProps } from './helper'

export default defineComponent({
  name: 'Upload',
  inheritAttrs: false,
  props: upProps,
  setup(props, { slots }) {
    const attrs = getUploadProps(props)

    return () => <NUpload {...attrs.value}>{slots}</NUpload>
  }
})
