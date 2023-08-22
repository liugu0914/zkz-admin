import { useI18n } from '@/hooks/locale/useI18n'
import { FormRules } from 'naive-ui'
import { computed } from 'vue'

const { t } = useI18n()

export const columns = computed(() => {
  const searchColumn: TableColumns = [
    {
      title: t('pages.sys.app.name'),
      key: 'name',
      searchAble: true
    },

    {
      title: t('pages.sys.app.des'),
      key: 'des'
    },
    {
      title: t('pages.sys.app.enable'),
      key: 'enable'
    },
    {
      title: t('pages.sys.app.options'),
      width: 100,
      key: 'actions'
    }
  ]
  return searchColumn
})

export const defaultForm: Partial<App> = {
  id: undefined,
  name: undefined,
  enable: undefined,
  des: undefined
}

export const defaultRules = computed<FormRules>(() => ({
  name: [
    {
      required: true,
      trigger: 'change',
      message: t('common.inputPlz', { name: t('pages.sys.app.name') })
    }
  ],
  des: [
    {
      required: false,
      trigger: 'change',
      message: t('common.inputPlz', { name: t('pages.sys.app.des') })
    }
  ]
}))
