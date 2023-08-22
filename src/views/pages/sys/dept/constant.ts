// import { SearchColumn } from '@/components/table/TableProps'
import { Dept } from '@/api/modules/sys/dept'
import { useI18n } from '@/hooks/locale/useI18n'
import { FormRules } from 'naive-ui'
import { computed } from 'vue'

const { t } = useI18n()

export const columns = computed(() => {
  const searchColumn: TableColumns = [
    {
      title: t('pages.sys.dept.name'),
      key: 'name',
      searchAble: true,
      search: {
        name: 'search'
      }
    },
    {
      title: t('pages.sys.dept.des'),
      key: 'des'
    },
    {
      title: t('pages.sys.dept.orderNum'),
      key: 'orderNum'
    },
    {
      title: t('pages.sys.dept.enable'),
      key: 'enable'
    },
    {
      title: t('pages.sys.dept.options'),
      width: 100,
      key: 'actions'
    }
  ]
  return searchColumn
})

export const defaultForm: Partial<Dept> = {
  id: undefined,
  name: undefined,
  orderNum: undefined,
  enable: undefined,
  des: undefined
}

export const defaultRules = computed<FormRules>(() => ({
  name: [
    {
      required: true,
      trigger: 'change',
      message: t('common.inputPlz', { name: t('pages.sys.dept.name') })
    }
  ],
  des: [
    {
      required: false,
      trigger: 'change',
      message: t('common.inputPlz', { name: t('pages.sys.dept.des') })
    }
  ]
}))
