import { useI18n } from '@/hooks/locale/useI18n'
import { FormRules } from 'naive-ui'
import { computed } from 'vue'

const { t } = useI18n()

export const columns = computed(() => {
  const searchColumn: TableColumns = [
    {
      title: t('pages.sys.menu.name'),
      key: 'name'
    },
    {
      title: t('pages.sys.menu.icon'),
      key: 'icon'
    },
    {
      title: t('pages.sys.menu.router'),
      key: 'router',
      searchAble: true
    },
    {
      title: t('pages.sys.menu.orderNum'),
      key: 'orderNum'
    },
    {
      title: t('pages.sys.menu.enable'),
      key: 'enable'
    },
    {
      title: t('pages.sys.menu.options'),
      key: 'options'
    }
  ]
  return searchColumn
})

export const defaultForm: Partial<Menu> = {
  id: undefined,
  name: undefined,
  orderNum: undefined,
  router: undefined,
  parent: 0,
  superId: undefined,
  icon: undefined,
  appId: undefined,
  enable: undefined
}

export const defaultRules = computed<FormRules>(() => ({
  name: [
    {
      required: true,
      trigger: 'change',
      message: t('common.inputPlz', { name: t('pages.sys.menu.name') })
    }
  ],
  icon: {
    required: false,
    trigger: 'change',
    message: t('common.inputPlz', { name: t('pages.sys.menu.icon') })
  },
  router: [
    {
      required: true,
      trigger: 'change',
      message: t('common.inputPlz', { name: t('pages.sys.menu.router') })
    }
  ],
  parent: [
    {
      required: true,
      type: 'number',
      trigger: 'change',
      message: t('common.selectPlz', { name: t('pages.sys.menu.isParent') })
    }
  ],
  orderNum: [
    {
      required: true,
      type: 'number',
      trigger: 'change',
      message: t('common.inputPlz', { name: t('pages.sys.menu.orderNum') })
    }
  ],
  enable: [
    {
      required: true,
      type: 'number',
      trigger: 'change',
      message: t('common.selectPlz', { name: t('pages.sys.user.enable') })
    }
  ]
}))
