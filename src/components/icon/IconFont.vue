<template>
  <Component :is="componentId" v-if="props.value" :type="props.value" />
</template>
<script lang="ts" setup>
  import { type IconType } from '@/store/modules/common'
  import { ref } from 'vue'
  interface Props {
    type: IconType
    value?: string
  }

  const props = defineProps<Props>()
  const componentName = props.type.charAt(0).toUpperCase() + props.type.slice(1) + 'Icon'
  const componentId = ref(componentName)
</script>
