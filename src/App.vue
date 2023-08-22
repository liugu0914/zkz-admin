<template>
  <NConfigProvider v-bind="configProviderProps">
    <NaiveGlobalConfig>
      <RouterView />
    </NaiveGlobalConfig>
  </NConfigProvider>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { RouterView } from 'vue-router'
  import { ConfigProviderProps } from 'naive-ui'
  import { useNaive } from '@/hooks/setting/useNaive'
  import { useLocale } from '@/i18n/useLocale'
  import NaiveGlobalConfig from '@/components/NaiveGlobalConfig'

  import hljs from 'highlight.js/lib/core'
  import json from 'highlight.js/lib/languages/json'

  const { configProvider } = useNaive()
  const { nLocale } = useLocale()

  hljs.registerLanguage('json', json)

  const configProviderProps = computed<ConfigProviderProps>(() => {
    return {
      hljs,
      ...configProvider.value,
      ...nLocale.value
    }
  })
</script>
