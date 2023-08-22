import { NGlobalStyle, NWatermark, useThemeVars } from 'naive-ui'
import { computed, defineComponent, onMounted, useSlots, watchEffect } from 'vue'
import css from './index.module.css'
import { useSettings } from '@/hooks/setting/useSettings'

export default defineComponent({
  name: 'NaiveGlobalConfig',
  inheritAttrs: false,
  setup() {
    const slots = useSlots()
    const { vars, shadow, showWatermark, watermarkContent } = useSettings()

    const themeVars = useThemeVars()

    const theme = computed(() => {
      return {
        ...vars.value,
        '--zkz-layout-shadow': shadow.value ? themeVars.value.boxShadow1 : 'unset'
      }
    })

    onMounted(() => {
      const body = document.body
      watchEffect(() => {
        Object.entries(theme.value).forEach(([key, value]) => {
          body.style.setProperty(key, `${value}`)
        })
      })
    })

    return () => (
      <div class={css.zkzGlobalConfig}>
        {slots.default ? slots.default() : null}
        <NGlobalStyle />
        {showWatermark.value ? (
          <NWatermark
            content={watermarkContent.value}
            cross
            fullscreen
            fontSize={16}
            lineHeight={16}
            width={380}
            height={380}
            xOffset={12}
            yOffset={60}
            rotate={-15}
            zIndex={1000}
          />
        ) : null}
      </div>
    )
  }
})
