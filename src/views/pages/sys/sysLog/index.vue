<template>
  <NCard :bordered="false" class="h-full">
    <BaseTable
      v-model:checked-row-keys="data.selectedRows"
      :columns="columns"
      :data="data.dataSource"
      flex-height
      :loading="data.loading"
      :pagination="data.pagination"
      show-order
      @page-change="pageChange"
      @search="searchChange">
      <template #type="{ row }">
        <NTag :bordered="false" :type="row.color">{{ row.tag }}</NTag>
      </template>
      <template #result="{ text, row }">
        <template v-if="text === 1">
          <NTag :bordered="false" type="success">{{ t('system.success') }}</NTag>
        </template>
        <template v-else>
          <NTag :bordered="false" type="error">{{ t('system.error') }}</NTag>
          <NTooltip v-if="row.exception" trigger="hover" :width="250">
            <template #trigger>
              <QuestionCircleOutlined class="ml-1" />
            </template>
            {{ row.exception }}
          </NTooltip>
        </template>
      </template>
      <template #params="{ text }">
        <NPopover trigger="click">
          <template #trigger>
            <NButton dashed size="small" type="primary">{{ t('common.viewText') }}</NButton>
          </template>
          <NCode :code="text" language="json" />
        </NPopover>
      </template>
    </BaseTable>
  </NCard>
</template>
<script setup lang="ts">
  import { onBeforeMount, reactive } from 'vue'
  import { columns } from './constant'
  import BaseTable from '@/components/table'
  import { getListPage, SysLog } from '@/api/modules/sys/sysLog'
  import { useI18n } from 'vue-i18n'
  import { QuestionCircleOutlined } from '@ant-design/icons-vue'

  const { t } = useI18n()

  const data = reactive<PageData<SysLog>>({
    dataSource: [],
    params: {
      page: {},
      query: {}
    },
    pagination: {},
    loading: false
  })

  onBeforeMount(() => {
    pageLoad()
  })

  /**
   * 分页数据加载
   * @parmas params 查询数据
   */
  const pageLoad = (params = data.params) => {
    data.loading = true
    getListPage(params)
      .then((res) => {
        const { records, ...pageParams } = res.data
        records.forEach((item) => {
          if (item.params) {
            item.params = JSON.stringify(JSON.parse(item.params), null, 2)
          }
          const { tag, color } = getLogTypeStyle(item.type)
          item.tag = tag
          item.color = color
        })
        data.dataSource = records || []
        data.pagination = pageParams
      })
      .finally(() => {
        data.loading = false
      })
  }

  /**
   * 搜索查询
   * @parmas searchs 查询数据
   */
  const searchChange = (searchs: RecordAble) => {
    data.params.query = searchs
    pageLoad()
  }

  /**
   * 分页查询
   * @parmas current 当前页
   * @parmas pageSize 每页大小
   */
  const pageChange = (current?: number, pageSize?: number) => {
    data.params.page = {
      current,
      pageSize
    }
    pageLoad()
  }

  /**
   * 获取日志类型
   */
  const getLogTypeStyle = (type: number) => {
    let tag: string, color: string
    switch (type) {
      case 1:
        tag = t('pages.sys.sysLog.queryTag')
        color = 'primary'
        break
      case 2:
        tag = t('pages.sys.sysLog.saveTag')
        color = 'success'
        break
      case 3:
        tag = t('pages.sys.sysLog.addTag')
        color = 'success'
        break
      case 4:
        tag = t('pages.sys.sysLog.updateTag')
        color = 'info'
        break
      case 5:
        tag = t('pages.sys.sysLog.deleteTag')
        color = 'error'
        break
      case 6:
        tag = t('pages.sys.sysLog.uploadTag')
        color = 'warning'
        break
      case 7:
        tag = t('pages.sys.sysLog.downloadTag')
        color = 'warning'
        break
      default:
        tag = t('pages.sys.sysLog.normalTag')
        color = 'default'
        break
    }
    return { tag, color }
  }
</script>
