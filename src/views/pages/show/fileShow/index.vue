<template>
  <NSpace size="small">
    <NButton type="primary" @click="excel"> excel文件 </NButton>
    <NButton type="primary" @click="word"> word文件 </NButton>
    <NButton type="primary" @click="ppt"> ppt文件 </NButton>

    <NButton type="primary" @click="pdf"> pdf文件 </NButton>
  </NSpace>
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const excel = () => router.push({ name: 'ds', params: { fileId: '83182553440261' } })

  const word = () => router.push({ name: 'ds', params: { fileId: '84248531136517' } })

  const ppt = () => router.push({ name: 'ds', params: { fileId: '84249862430725' } })

  const pdf = () => router.push({ name: 'ds', params: { fileId: '84248969609221' } })
</script>
