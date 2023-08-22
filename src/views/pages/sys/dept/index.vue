<template>
  <NCard :bordered="false" class="h-full zkz-layout-shadow">
    <BaseTable
      v-model:checked-row-keys="data.selectedRows"
      :cascade="false"
      :columns="columns"
      :data="data.dataSource"
      flex-height
      :loading="data.loading"
      :order-config="orderConfig"
      @search="searchChange">
      <template #btns>
        <NButton type="primary" @click="() => openAdd()">{{ t('common.addText') }}</NButton>
        <NButton :disabled="data.selectedRows?.length !== 1" type="primary" @click="openEdit(data.selectedRows || [])">
          {{ t('common.editText') }}
        </NButton>
        <NPopconfirm @confirm="delSelectedRows">
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
              <NA @click="openAdd(row.id)"> <PlusOutlined /> </NA>
            </template>
            {{ t('pages.sys.dept.addChilDept') }}
          </NTooltip>
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
    <Modal v-model:show="data.visible" :loading="data.sureLoading" :title="data.title" @close="close" @confirm="sure">
      <NForm ref="formRef" :model="data.dataForm" :rules="data.rules">
        <NFormItem :label="t('pages.sys.dept.name')" path="name">
          <NInput
            v-model:value="data.dataForm.name"
            clearable
            :maxlength="50"
            :placeholder="t('common.inputPlz', { name: t('pages.sys.dept.name') })" />
        </NFormItem>
        <NFormItem :label="t('pages.sys.dept.des')" path="des">
          <NInput
            v-model:value="data.dataForm.des"
            clearable
            :maxlength="500"
            :placeholder="t('common.inputPlz', { name: t('pages.sys.dept.des') })"
            type="textarea" />
        </NFormItem>
        <NFormItem :label="t('pages.sys.dept.orderNum')" path="orderNum">
          <NInputNumber
            v-model:value="data.dataForm.orderNum"
            class="w-full"
            clearable
            :min="0"
            :placeholder="t('common.inputPlz', { name: t('pages.sys.dept.orderNum') })" />
        </NFormItem>
        <NFormItem :label="t('pages.sys.dept.enable')" path="enable">
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
  import { getDeptTree, getOne, save, del, Dept } from '@/api/modules/sys/dept'
  import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
  import { useI18n } from 'vue-i18n'
  import { cloneDeep, isArray } from 'lodash-es'
  import to from '@/utils/await-to'
  import { useNaive } from '@/hooks/setting/useNaive'
  import { FormInst } from 'naive-ui'

  const { t } = useI18n()
  const { message } = useNaive()

  const orderConfig = reactive({ width: 100 })

  const formRef = ref<FormInst>()
  const data = reactive<PageData<Dept, true, false>>({
    dataSource: [],
    query: {},
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
  const pageLoad = () => {
    data.loading = true
    getDeptTree(data.query)
      .then((res) => {
        data.dataSource = res.data || []
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
    if ('enable' in searchs) {
      searchs.enable = searchs.enable ? 1 : 0
    }
    data.query = searchs
    pageLoad()
  }

  /**
   * 打开添加
   * @parmas pagination 分页数据
   */
  const openAdd = (superId?: Key) => {
    data.title = t('common.addText')
    data.visible = true
    data.dataForm.enable = 1
    data.dataForm.superId = superId ?? 0
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
