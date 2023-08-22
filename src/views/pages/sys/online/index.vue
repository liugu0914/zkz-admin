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
      <template #userName="{ row, text }">
        <span>{{ text }}</span>
        <NTag v-if="row.current" :bordered="false" class="ml-1" type="primary">{{ t('pages.sys.online.current') }}</NTag>
      </template>
      <template #actions="{ row }">
        <NSpace size="small">
          <NPopconfirm @positive-click="offline([row.uuid])">
            <template #trigger>
              <NTooltip trigger="hover">
                <template #trigger>
                  <NA> <DeleteOutlined /> </NA>
                </template>
                {{ t('pages.sys.online.offline') }}
              </NTooltip>
            </template>
            {{ t('pages.sys.online.offlineConfirm') }}
          </NPopconfirm>
        </NSpace>
      </template>
    </BaseTable>
  </NCard>
</template>
<script setup lang="ts">
  import { onBeforeMount, reactive } from 'vue'
  import { columns } from './constant'
  import BaseTable from '@/components/table'
  import { getPages, Online, logoff } from '@/api/modules/sys/online'
  import { useI18n } from 'vue-i18n'
  import { useNaive } from '@/hooks/setting/useNaive'
  import { DeleteOutlined } from '@ant-design/icons-vue'

  const { message } = useNaive()

  const { t } = useI18n()

  const data = reactive<PageData<Online>>({
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
    getPages(params)
      .then((res) => {
        const { records, ...pageParams } = res.data
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
   * 下线操作
   */
  const offline = (uuids: string[]) => {
    logoff(uuids).then(() => {
      message.success(t('system.suc'))

      pageLoad()
    })
  }
</script>
