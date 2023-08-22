import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'SvgIcon',
  inheritAttrs: false,
  props: {
    prefix: {
      type: String,
      default: 'svg'
    },
    name: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const symbolId = computed(() => `#${props.prefix}-${props.name}`)

    return () => (
      <svg {...props} aria-hidden='true'>
        <use href={symbolId.value} />
      </svg>
    )
  }
})
