<template>
  <div class="login-box">
    <div class="login-logo">
      <NIcon :color="color" size="40">
        <SvgIcon name="logo" />
      </NIcon>
      <h1 class="font-bold mb-0 ml-2 text-3xl">{{ appName }}</h1>
    </div>
    <NForm ref="formRef" class="w-[300px]" :model="state.from" :show-label="false" size="small" @finish="doLogin">
      <NFormItem path="account" :rule="[{ required: true, trigger: 'input', message: t('system.accountRequired') }]">
        <NInput v-model:value="state.from.account" allow-clear :placeholder="t('system.account')" size="large">
          <template #prefix><UserOutlined /></template>
        </NInput>
      </NFormItem>
      <NFormItem path="password" :rule="[{ required: true, trigger: 'input', message: t('system.passwordRequired') }]">
        <NInput
          v-model:value="state.from.password"
          allow-clear
          autocomplete="off"
          :placeholder="t('system.password')"
          show-password-on="mousedown"
          size="large"
          type="password">
          <template #prefix><LockOutlined /></template>
        </NInput>
      </NFormItem>
      <NFormItem>
        <NButton block :loading="state.loading" size="large" strong type="primary" @click="submit">
          {{ t('system.login') }}
        </NButton>
      </NFormItem>
    </NForm>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { FormInst } from 'naive-ui'
  import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
  import { onKeyStroke } from '@vueuse/core'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import { useNaive } from '@/hooks/setting/useNaive'
  import { useLogin } from '@/hooks/accout/useLogin'
  import to from '@/utils/await-to'
  import SvgIcon from '@/components/svgIcon'
  import { useSettings } from '@/hooks/setting/useSettings'
  import { computed } from 'vue'

  const appName = computed(() => import.meta.env.VITE_APP_NAME)

  const { t } = useI18n()
  const { message } = useNaive()
  const { login } = useLogin()
  const { color } = useSettings()

  const state = reactive({
    loading: false,
    from: {
      account: '',
      password: ''
    }
  })
  const formRef = ref<FormInst>()
  const router = useRouter()

  const submit = () => {
    if (state.loading) {
      return
    }
    formRef.value?.validate((errors) => {
      if (errors) {
        return
      }

      doLogin()
    })
  }

  onKeyStroke('Enter', submit, { dedupe: true })

  const doLogin = async () => {
    state.loading = true
    const loadMessage = message.loading(t('system.logining'), { duration: 0 })

    const [, res] = await to(
      login(state.from).finally(() => {
        state.loading = false
        loadMessage.destroy()
      })
    )
    if (res) {
      message.success(t('system.loginSuccess'))

      router.replace({ name: 'root' })
    }
  }
</script>

<style lang="postcss" scoped>
  .login-box {
    @apply flex flex-col items-center pt-[240px];

    .login-logo {
      @apply flex items-center mb-[30px];
    }
  }
</style>
