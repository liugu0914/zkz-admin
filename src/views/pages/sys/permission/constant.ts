import { useI18n } from '@/hooks/locale/useI18n'
import { computed } from 'vue'
import { type PermissionForm } from '@/api/modules/sys/permission'
import { FormRules } from 'naive-ui'

const { t } = useI18n()

export const defaultForm: PermissionForm = {
  permissions: []
}

export const defaultRules = computed<FormRules>(() => ({
  name: [
    {
      required: true,
      message: t('common.inputPlz', { name: t('pages.sys.permission.name') })
    }
  ],
  charm: [
    {
      required: true,
      message: t('common.inputPlz', { name: t('pages.sys.permission.charm') })
    }
  ],
  enable: [
    {
      required: true,
      type: 'number',
      message: t('common.inputPlz', { name: t('pages.sys.permission.enable') })
    }
  ]
}))
