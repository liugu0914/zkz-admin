<template>
  <div class="setting-item">
    <h3 v-if="title" class="item__title">
      {{ title }}
    </h3>
    <slot />
  </div>
</template>
<script lang="ts" setup>
  interface Props {
    title?: string
  }
  defineProps<Props>()
</script>

<style lang="postcss">
  .setting-item {
    margin-bottom: 24px;

    .item__title {
      margin-bottom: 12px;
      font-size: 16px;
      line-height: 22px;
    }
  }
</style>
