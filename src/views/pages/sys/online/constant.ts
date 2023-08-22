import { useI18n } from '@/hooks/locale/useI18n'
import { computed } from 'vue'

const { t } = useI18n()

export const columns = computed(() => {
  const searchColumn: TableColumns = [
    {
      title: t('pages.sys.online.userName'),
      key: 'userName'
    },
    {
      title: t('pages.sys.online.account'),
      key: 'account'
    },
    {
      title: t('pages.sys.online.ip'),
      key: 'ip'
    },
    {
      title: t('pages.sys.online.browser'),
      key: 'browser'
    },
    {
      title: t('pages.sys.online.os'),
      key: 'os'
    },
    {
      title: t('pages.sys.online.loginTime'),
      key: 'loginTime'
    },
    {
      title: t('pages.sys.online.options'),
      width: 100,
      key: 'actions'
    }
  ]
  return searchColumn
})
