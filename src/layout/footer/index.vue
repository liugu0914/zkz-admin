<template>
  <div class="zkz-footer">
    <NLayoutFooter class="zkz-footer-main"> ©2023 Created by ZKZ ADMIN </NLayoutFooter>
  </div>
</template>
<style lang="postcss" scoped>
  .zkz-footer {
    @apply p-[10px];

    height: var(--zkz-footer-height);

    .zkz-footer-main {
      @apply flex justify-center items-end;

      border-radius: var(--zkz-radius);
    }
  }
</style>
