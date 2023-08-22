import { useI18n } from '@/hooks/locale/useI18n'
import { FormRules } from 'naive-ui'
import { computed } from 'vue'

const { t } = useI18n()

export const columns = computed(() => {
  const searchColumn: TableColumns = [
    {
      title: t('pages.sys.organization.name'),
      key: 'name'
    },
    {
      title: t('pages.sys.organization.alias'),
      key: 'alias'
    },
    {
      title: t('pages.sys.organization.des'),
      key: 'des'
    },
    {
      title: t('pages.sys.organization.options'),
      width: 100,
      key: 'actions'
    }
  ]
  return searchColumn
})

export const defaultForm: Partial<Organization> = {
  id: undefined,
  name: undefined,
  alias: undefined,
  des: undefined
}

export const defaultRules = computed<FormRules>(() => ({
  name: [
    {
      required: true,
      trigger: 'change',
      message: t('common.inputPlz', { name: t('pages.sys.organization.name') })
    }
  ],
  alias: [
    {
      required: true,
      trigger: 'change',
      message: t('common.inputPlz', { name: t('pages.sys.organization.alias') })
    }
  ],
  des: [
    {
      required: false,
      trigger: 'change',
      message: t('common.inputPlz', { name: t('pages.sys.organization.des') })
    }
  ]
}))
