import { useI18n } from '@/hooks/locale/useI18n'
import { computed } from 'vue'

const { t } = useI18n()

export const columns = computed(() => {
  const searchColumn: TableColumns = [
    {
      title: t('pages.sys.sysLog.userName'),
      key: 'userName',
      width: 100
    },
    {
      title: t('pages.sys.sysLog.title'),
      key: 'title'
    },
    {
      title: t('pages.sys.sysLog.type'),
      key: 'type',
      width: 100
    },
    {
      title: t('pages.sys.sysLog.serviceId'),
      key: 'serviceId',
      width: 80
    },
    {
      title: t('pages.sys.sysLog.method'),
      key: 'method',
      width: 80
    },
    {
      title: t('pages.sys.sysLog.params'),
      key: 'params',
      width: 80
    },
    {
      title: t('pages.sys.sysLog.requestUri'),
      key: 'requestUri'
    },
    {
      title: t('pages.sys.sysLog.time'),
      key: 'time',
      width: 120
    },
    {
      title: t('pages.sys.sysLog.ip'),
      key: 'ip',
      width: 120
    },
    {
      title: t('pages.sys.sysLog.result'),
      key: 'result',
      width: 100
    },
    {
      title: t('pages.sys.sysLog.operateTime'),
      key: 'operateTime'
    }
  ]
  return searchColumn
})
