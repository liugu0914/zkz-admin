<template>
  <iframe class="h-full w-full" :src="route.meta.url" />
</template>
<script lang="ts" setup>
  import { useRoute } from 'vue-router'
  const route = useRoute()
</script>
