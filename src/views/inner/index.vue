<template>
  <div>
    <NButton @click="add"> test </NButton>
  </div>
  <div>C1:{{ c1 }}</div>
  <div>C2:{{ c2 }}</div>
</template>

<script lang="ts" setup>
  import { watch } from 'vue'
  import { computed, ref } from 'vue'

  const a = ref(false)

  const b = ref(false)

  const c1 = computed(() => {
    return a.value && b.value ? 'a' : 'b'
  })

  const c2 = computed(() => {
    return c1.value === 'a' ? 'a2' : 'b2'
  })

  const add = () => {
    a.value = !a.value
  }

  const addb = () => {
    b.value = !b.value
  }

  watch(a, () => {
    addb()
  })
</script>
