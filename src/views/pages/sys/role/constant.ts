import { useI18n } from '@/hooks/locale/useI18n'
import { FormRules } from 'naive-ui'
import { computed } from 'vue'

const { t } = useI18n()

export const columns = computed(() => {
  const searchColumn: TableColumns = [
    {
      title: t('pages.sys.role.name'),
      key: 'name',
      searchAble: true
    },

    {
      title: t('pages.sys.role.des'),
      key: 'des'
    },
    {
      title: t('pages.sys.role.enable'),
      key: 'enable'
    },
    {
      title: t('pages.sys.role.options'),
      width: 120,
      key: 'actions'
    }
  ]
  return searchColumn
})

export const defaultForm: Partial<Role> = {
  id: undefined,
  name: undefined,
  enable: undefined,
  des: undefined
}

export const defaultRules = computed<FormRules>(() => ({
  name: [
    {
      required: true,
      message: t('common.inputPlz', { name: t('pages.sys.role.name') })
    }
  ],
  des: [
    {
      required: false,
      message: t('common.inputPlz', { name: t('pages.sys.role.des') })
    }
  ]
}))
