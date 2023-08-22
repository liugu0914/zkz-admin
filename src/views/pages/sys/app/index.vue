<template>
  <NCard :bordered="false" class="h-full zkz-layout-shadow">
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
      <template #btns>
        <NButton type="primary" @click="() => openAdd()">{{ t('common.addText') }}</NButton>
        <NButton :disabled="data.selectedRows?.length !== 1" type="primary" @click="openEdit(data.selectedRows || [])">
          {{ t('common.editText') }}
        </NButton>
        <NPopconfirm @positive-click="delSelectedRows">
          <template #trigger>
            <NButton :disabled="data.selectedRows?.length === 0" type="error">
              {{ t('common.delText') }}
            </NButton>
          </template>
          {{ t('common.delConfirm') }}
        </NPopconfirm>
      </template>
      <template #enable="{ text }">
        <NSwitch :checked-value="1" disabled :unchecked-value="0" :value="text" />
      </template>
      <template #actions="{ row }">
        <NSpace size="small">
          <NTooltip trigger="hover">
            <template #trigger>
              <NA @click="openEdit(row.id)"> <EditOutlined /> </NA>
            </template>
            {{ t('common.editText') }}
          </NTooltip>
          <NPopconfirm @positive-click="deleteRecord(row.id)">
            <template #trigger>
              <NTooltip trigger="hover">
                <template #trigger>
                  <NA> <DeleteOutlined /> </NA>
                </template>
                {{ t('common.delText') }}
              </NTooltip>
            </template>
            {{ t('common.delConfirm') }}
          </NPopconfirm>
        </NSpace>
      </template>
    </BaseTable>
    <Modal v-model:show="data.visible" :title="data.title" @close="close" @confirm="sure">
      <NForm ref="formRef" :model="data.dataForm" :rules="data.rules">
        <NFormItem :label="t('pages.sys.app.name')" path="name">
          <NInput
            v-model:value="data.dataForm.name"
            clearable
            :maxlength="50"
            :placeholder="t('common.inputPlz', { name: t('pages.sys.app.name') })" />
        </NFormItem>
        <NFormItem :label="t('pages.sys.app.des')" path="des">
          <NInput
            v-model:value="data.dataForm.des"
            clearable
            :maxlength="500"
            :placeholder="t('common.inputPlz', { name: t('pages.sys.app.des') })"
            type="textarea" />
        </NFormItem>
        <NFormItem :label="t('pages.sys.app.enable')" path="enable">
          <NSwitch v-model:value="data.dataForm.enable" :checked-value="1" :unchecked-value="0" />
        </NFormItem>
      </NForm>
    </Modal>
  </NCard>
</template>
<script setup lang="ts">
  import { onBeforeMount, reactive, ref, unref } from 'vue'
  import { columns, defaultForm, defaultRules } from './constant'
  import BaseTable from '@/components/table'
  import Modal from '@/components/modal'
  import { getListPage, getOne, save, del } from '@/api/modules/sys/app'
  import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
  import { useI18n } from 'vue-i18n'
  import { FormInst } from 'naive-ui'
  import { cloneDeep, isArray } from 'lodash-es'
  import to from '@/utils/await-to'
  import { useNaive } from '@/hooks/setting/useNaive'

  const { message } = useNaive()
  const { t } = useI18n()
  const formRef = ref<FormInst>()
  const data = reactive<PageData<App, true>>({
    dataSource: [],
    params: {
      page: {},
      query: {}
    },
    pagination: {},
    selectedRows: [],
    loading: false,
    // 控制抽屉
    dataForm: cloneDeep(defaultForm),
    rules: defaultRules,
    title: '',
    visible: false,
    sureLoading: false
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
   * 打开添加
   * @parmas pagination 分页数据
   */
  const openAdd = () => {
    data.title = t('common.addText')
    data.visible = true
    data.dataForm.enable = 1
  }

  /**
   * 编辑
   * @parmas pagination 分页数据
   */
  const openEdit = async (id: Key | Key[]) => {
    data.title = t('common.editText')
    data.visible = true
    const tmpId = isArray(id) ? id[0] : id
    const [, res] = await to(getOne(tmpId))
    if (res) {
      data.dataForm = res.data
    }
  }

  /**
   * 确认保存
   */
  const sure = (done) => {
    unref(formRef)
      ?.validate()
      .then(() => {
        return save(data.dataForm)
      })
      .then(() => {
        message.success(t('system.suc'))
        close()
        pageLoad()
      })
      .finally(() => {
        done()
      })
  }

  /**
   * 关闭
   */
  const close = () => {
    data.visible = false
    data.dataForm = cloneDeep(defaultForm)
    unref(formRef)?.restoreValidation()
  }

  /**
   * 单项删除
   */
  const deleteRecord = async (id: Key) => {
    const [, res] = await to(del(id + ''))
    if (res) {
      message.success(t('system.suc'))
      pageLoad()
    }
  }

  /**
   * 选择删除
   */
  const delSelectedRows = () => {
    const id = data.selectedRows?.join(',')
    if (id) {
      deleteRecord(id)
    }
  }
</script>
