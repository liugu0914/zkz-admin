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
      @search="search">
      <template #btns>
        <NButton type="primary" @click="openAdd">{{ t('common.addText') }}</NButton>
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
      <template #imgUrl="{ row }">
        <NAvatar class="flex items-center justify-center" round size="small" :src="row.imgUrl || 'empty'">
          <template #fallback>
            <NIcon> <UserOutlined /></NIcon>
          </template>
        </NAvatar>
      </template>
      <template #actions="{ row }">
        <NSpace size="small">
          <NTooltip trigger="hover">
            <template #trigger>
              <NA @click="roleConfigOpen(row.id)"> <ShareAltOutlined /> </NA>
            </template>
            {{ t('pages.sys.user.roleConfig') }}
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
  </NCard>
  <Modal v-model:show="data.visible" :title="data.title" @close="close" @confirm="sure">
    <NForm ref="formRef" :model="data.dataForm" :rules="data.rules">
      <NFormItem path="imgUrl" :show-feedback="false">
        <div class="mb-8 text-center w-full">
          <Upload file-type="all" :show-file-list="false" @finish="uploadChange">
            <NAvatar class="flex items-center justify-center" round :size="150" :src="data.dataForm.imgUrl || 'empty'">
              <template #fallback>
                <NIcon> <UserOutlined /></NIcon>
              </template>
            </NAvatar>
          </Upload>
        </div>
      </NFormItem>
      <NFormItem :label="t('pages.sys.user.userName')" path="userName">
        <NInput v-model:value="data.dataForm.userName" clearable />
      </NFormItem>
      <NFormItem :label="t('pages.sys.user.account')" path="account">
        <NInput v-model:value="data.dataForm.account" clearable />
      </NFormItem>
      <template v-if="!!!data.dataForm.id">
        <NFormItem :label="t('pages.sys.user.password')" path="password">
          <NInput v-model:value="data.dataForm.password" clearable type="password" />
        </NFormItem>
        <NFormItem :label="t('pages.sys.user.confirmPassword')" path="confirmPassword">
          <NInput v-model:value="data.dataForm.confirmPassword" clearable type="password" />
        </NFormItem>
      </template>
      <NFormItem :label="t('pages.sys.user.phone')" path="phone">
        <NInput v-model:value="data.dataForm.phone" clearable />
      </NFormItem>
      <NFormItem :label="t('pages.sys.user.idCard')" path="idCard">
        <NInput v-model:value="data.dataForm.idCard" clearable />
      </NFormItem>
      <NFormItem :label="t('pages.sys.user.deptName')" path="deptId">
        <NTreeSelect
          v-model:value="data.dataForm.deptId"
          clearable
          :options="data.depts"
          :placeholder="t('common.selectPlz', { name: t('pages.sys.user.deptName') })"
          show-search />
      </NFormItem>
      <NFormItem :label="t('pages.sys.user.email')" path="email">
        <NInput v-model:value="data.dataForm.email" clearable />
      </NFormItem>
      <NFormItem :label="t('pages.sys.user.enable')" path="enable">
        <NSwitch v-model:value="data.dataForm.enable" :checked-value="1" :unchecked-value="0" />
      </NFormItem>
    </NForm>
  </Modal>
  <Modal v-model:show="role.visible" :title="t('pages.sys.user.roleConfig')" @close="roleConfigClose" @confirm="roleConfigSure">
    <NTree
      v-if="role.tree.length > 0"
      v-model:checked-keys="role.roleIds"
      checkable
      :data="role.tree"
      default-expand-all
      key-field="id"
      label-field="name" />
  </Modal>
</template>
<script lang="ts" setup>
  import { downloadUrl } from '@/api/common/file'
  import { onBeforeMount, reactive, ref, unref } from 'vue'
  import { ShareAltOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons-vue'
  import BaseTable from '@/components/table'
  import Modal from '@/components/modal'
  import Upload, { UploadOptions, FileResData } from '@/components/upload/index'
  import { columns, defaultForm, defaultRules, getDepts } from './constant'
  import { getListPage, getOne, save, del, saveConfigRoles, getConfigRoles } from '@/api/modules/sys/user'
  import { getList as getRoles } from '@/api/modules/sys/role'
  import { cloneDeep, isArray } from 'lodash-es'
  import { useI18n } from 'vue-i18n'
  import { FormInst } from 'naive-ui'
  import { useNaive } from '@/hooks/setting/useNaive'
  import to from '@/utils/await-to'

  const { t } = useI18n()
  const { message } = useNaive()

  const formRef = ref<FormInst>()

  const data = reactive<PageData<User, true>>({
    dataSource: [],
    params: {
      page: {},
      query: {}
    },
    pagination: {},
    selectedRows: [],
    loading: false,
    visible: false,
    title: '',
    // 控制抽屉
    dataForm: cloneDeep(defaultForm),
    rules: cloneDeep(defaultRules),
    depts: []
  })

  onBeforeMount(async () => {
    pageLoad()
    data.depts = await getDepts()
  })

  /**
   * 分页数据加载
   * @parmas params 查询数据
   */
  const pageLoad = () => {
    data.loading = true
    getListPage(data.params)
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
  const search = (searchs: RecordAble) => {
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
      data.dataForm.password = undefined
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
    unref(formRef)?.restoreValidation()
    data.dataForm = cloneDeep(defaultForm)
  }

  /**
   * 单项删除
   */
  const deleteRecord = async (id: Key) => {
    const [, res] = await to(del(id))
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

  /**
   * 上传文件事件
   */
  const uploadChange = (options: UploadOptions, res: FileResData) => {
    if (res.data) {
      data.dataForm.imgUrl = downloadUrl + res.data.url
    }
  }

  /**
   * 添加角色
   * ====================
   */
  const role = reactive({
    visible: false,
    tree: [] as Role[],
    roleIds: [] as Key[],
    userId: undefined as Key | undefined
  })

  /**
   * 角色配置打开
   */
  const roleConfigOpen = async (id: Key) => {
    role.visible = true
    role.userId = id
    const [, res] = await to(getRoles({}))
    if (res) {
      const resData = res.data ?? []
      role.tree = resData
    }
    const [, resKeys] = await to(getConfigRoles(id))
    if (resKeys) {
      const resData = resKeys.data ?? []
      role.roleIds = resData
    }
  }

  /**
   * 角色配置保存
   */
  const roleConfigSure = (done) => {
    if (!role.userId) {
      return
    }
    data.sureLoading = true
    saveConfigRoles(role.userId, role.roleIds)
      .then(() => {
        message.success(t('system.suc'))
      })
      .finally(() => {
        done()
        roleConfigClose()
      })
  }

  /**
   * 角色配置关闭
   */
  const roleConfigClose = () => {
    role.visible = false
    role.userId = undefined
    role.roleIds = []
  }
</script>
