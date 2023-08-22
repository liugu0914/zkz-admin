<template>
  <NCard :bordered="false" class="h-full zkz-layout-shadow">
    <BaseTable v-model:checked-row-keys="data.selectedRows" :columns="columns" :data="data.dataSource" flex-height :loading="data.loading">
      <template #headerTitle>
        <NTabs v-if="appData.apps.length > 1" type="line" :value="appData.appId" @update:value="changeApp">
          <NTab v-for="app in appData.apps" :name="app.id">{{ app.name }}</NTab>
        </NTabs>
      </template>
      <template #btns>
        <NButton type="primary" @click="openAdd">{{ t('common.addText') }}</NButton>
        <NButton :disabled="data.selectedRows?.length !== 1" type="primary" @click="selectOpenEdit">
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
      <template #icon="{ text }">
        <IconFont class="text-xl" type="menu" :value="text" />
      </template>
      <template #enable="{ text }">
        <NSwitch :checked-value="1" disabled :unchecked-value="0" :value="text" />
      </template>
      <template #options="{ row }">
        <NSpace size="small">
          <NTooltip trigger="hover">
            <template #trigger>
              <NA @click="openMenuPes(row.id)"> <DeploymentUnitOutlined /> </NA>
            </template>
            {{ t('pages.sys.menu.menuPermission') }}
          </NTooltip>
          <NTooltip v-if="row.parent === 1" trigger="hover">
            <template #trigger>
              <NA @click="openAddChild(row.id)"> <PlusOutlined /> </NA>
            </template>
            {{ t('pages.sys.menu.addChildMenu') }}
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

    <Modal v-model:show="data.visible" :title="data.title" @close="close" @confirm="sure">
      <NForm ref="formRef" :model="data.dataForm" :rules="data.rules">
        <NFormItem :label="t('pages.sys.menu.name')" path="name">
          <NInput v-model:value="data.dataForm.name" clearable :maxlength="100" />
        </NFormItem>
        <NFormItem :label="t('pages.sys.menu.icon')" path="icon">
          <SelectIcon v-model:value="data.dataForm.icon" type="menu" />
        </NFormItem>
        <NFormItem :label="t('pages.sys.menu.isParent')" path="parent">
          <NSwitch :checked-value="1" :unchecked-value="0" :value="data.dataForm.parent" @update:value="changeIsParent" />
        </NFormItem>
        <NFormItem v-if="data.dataForm.parent === 0" :label="t('pages.sys.menu.router')" path="router">
          <NInput v-model:value="data.dataForm.router" clearable :maxlength="100" />
        </NFormItem>
        <NFormItem :label="t('pages.sys.menu.parentMenu')" path="superId">
          <NTreeSelect
            v-model:value="data.dataForm.superId"
            clearable
            key-field="id"
            label-field="name"
            :options="data.parentMenus"
            :placeholder="t('common.selectPlz', { name: t('pages.sys.menu.parentMenu') })" />
        </NFormItem>
        <NFormItem :label="t('pages.sys.menu.orderNum')" path="orderNum">
          <NInputNumber v-model:value="data.dataForm.orderNum" class="w-full" clearable :max="999" :min="1" />
        </NFormItem>
        <NFormItem :label="t('pages.sys.user.enable')" path="enable">
          <NSwitch v-model:value="data.dataForm.enable" :checked-value="1" :unchecked-value="0" />
        </NFormItem>
      </NForm>
    </Modal>

    <Modal
      v-model:show="menuPesForm.menuPesVisible"
      :loading="menuPesForm.menuSureLoading"
      :title="t('pages.sys.menu.menuPermission')"
      @close="pesClose"
      @confirm="pesSure">
      <NForm ref="menuPesRef" :model="menuPesForm" :show-label="false">
        <NFormItem
          v-for="(item, index) in menuPesForm.menuPesData"
          :key="item.key"
          :path="`menuPesData[${index}].target`"
          :rule="{
            required: true,
            message: t('pages.sys.menu.targetContent'),
            trigger: 'change'
          }">
          <NInput
            v-model:value="item.target"
            autocomplete="off"
            class="w-11/12"
            clearable
            :placeholder="t('common.inputPlz', { name: t('pages.sys.menu.menuPermission') })" />
          <MinusCircleOutlined v-if="menuPesForm.menuPesData.length > 1" class="cursor-pointer ml-2" @click="removePes(item)" />
        </NFormItem>
        <NFormItem>
          <NButton class="!w-11/12" dashed @click="addPes">
            <PlusOutlined />
            {{ t('pages.sys.menu.addPermission') }}
          </NButton>
        </NFormItem>
      </NForm>
    </Modal>
  </NCard>
</template>
<script lang="ts" setup>
  import { onBeforeMount, ref, unref, reactive } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { PlusOutlined, EditOutlined, DeleteOutlined, MinusCircleOutlined, DeploymentUnitOutlined } from '@ant-design/icons-vue'
  import BaseTable from '@/components/table'
  import Modal from '@/components/modal'
  import SelectIcon from '@/components/icon/SelectIcon.vue'
  import IconFont from '@/components/icon/IconFont.vue'
  import { columns, defaultRules, defaultForm } from './constant'
  import {
    getMenusTree,
    getOne,
    getSuperMenus,
    save,
    del,
    getPermissionsByMenuId,
    savePermission,
    type MenuPermission
  } from '@/api/modules/sys/menu'
  import { getApps } from '@/api/modules/sys/app'
  import { toTree, findFormRule } from '@/utils/base'
  import { cloneDeep } from 'lodash-es'
  import to from '@/utils/await-to'
  import { useNaive } from '@/hooks/setting/useNaive'
  import { FormInst } from 'naive-ui'

  const { t } = useI18n()

  const { message } = useNaive()

  const formRef = ref<FormInst>()
  const menuPesRef = ref<FormInst>()

  const data = reactive<PageData<Menu, true>>({
    params: {
      query: {
        appId: undefined
      }
    },
    dataSource: [],
    selectedRows: [],
    loading: false,
    // 控制抽屉
    dataForm: cloneDeep(defaultForm),
    rules: defaultRules.value,
    title: undefined,
    visible: false,
    parentMenus: []
  })

  interface MenuPesForm {
    menuId: Key
    menuPesVisible: boolean
    menuSureLoading: boolean
    menuPesData: MenuPermission[]
  }

  const menuPesForm = reactive<MenuPesForm>({
    menuId: '',
    menuPesVisible: false,
    menuSureLoading: false,
    menuPesData: []
  })

  onBeforeMount(() => {
    appLoad().then(() => {
      pageLoad()
    })
  })

  /**
   * 获取app应用
   */
  const appData = reactive<{
    appId?: Key
    apps: App[]
  }>({
    appId: undefined,
    apps: []
  })
  const appLoad = () => {
    return getApps().then((res) => {
      const resData = res.data || []
      appData.apps = resData
      if (resData.length > 0) {
        appData.appId = resData[0].id
      }
    })
  }

  /**
   * 切换应用
   */
  const changeApp = (activeKey: Key) => {
    appData.appId = activeKey
    pageLoad()
  }

  /**
   * 页面加载
   */
  const pageLoad = () => {
    data.loading = true
    if (data.params.query) {
      data.params.query.appId = appData.appId
    }
    getMenusTree(data.params)
      .then((res) => {
        data.dataSource = res.data || []
      })
      .finally(() => {
        data.loading = false
      })
  }

  /**
   * 打开添加
   */
  const openAdd = () => {
    data.title = t('common.addText')
    data.visible = true
    data.dataForm.enable = 1
    getParentMenu()
  }

  /**
   * 打开添加子菜单
   */
  const openAddChild = (id: Key) => {
    data.title = t('common.addText')
    data.visible = true
    data.dataForm.enable = 1
    data.dataForm.superId = id
    data.dataForm.parent = 0
    getParentMenu()
  }

  /**
   * 获取父级菜单
   */
  const getParentMenu = async () => {
    const [, res] = await to(getSuperMenus(appData.appId || ''))
    let parentMenu = res?.data || []
    const id = data.dataForm.id
    parentMenu = parentMenu.filter((item) => item.id !== id)

    data.parentMenus = toTree(parentMenu, { label: 'name', value: 'id' }, ['parent'])
  }

  /**
   * 打开编辑
   */
  const openEdit = async (id: Key) => {
    data.title = t('common.editText')
    data.visible = true
    const [, res] = await to(getOne(id))
    if (res) {
      data.dataForm = res.data
      if (data.dataForm.superId === '0') {
        data.dataForm.superId = undefined
      }
      changeIsParent(data.dataForm.parent)
    }
    getParentMenu()
  }

  /**
   * 打开编辑
   */
  const selectOpenEdit = () => {
    if (data.selectedRows?.length === 1) {
      openEdit(data.selectedRows[0])
    }
  }

  /**
   * 关闭弹窗
   */
  const close = () => {
    data.visible = false
    unref(formRef)?.restoreValidation()
    data.dataForm = cloneDeep(defaultForm)
    findFormRule(data.rules, 'icon').required = false
  }

  /**
   * 切换是否为父级
   */
  const changeIsParent = (checked) => {
    data.dataForm.parent = checked

    const iconRule = findFormRule(data.rules, 'icon')
    // 为父级菜单
    if (checked === 1) {
      iconRule.required = true
    } else {
      iconRule.required = false
    }
  }

  /**
   * 确认操作
   */
  const sure = (done) => {
    unref(formRef)
      ?.validate()
      .then(() => {
        data.dataForm.appId = appData.appId
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
   * 打开菜单权限
   * @param id 菜单ID
   */
  const openMenuPes = (id: Key) => {
    menuPesForm.menuPesVisible = true
    menuPesForm.menuId = id

    getPermissionsByMenuId(id).then((res) => {
      const permissions = res.data ?? []
      if (permissions.length === 0) {
        addPes()
      } else {
        permissions.forEach((item) => (item.key = item.id))
        menuPesForm.menuPesData = permissions
      }
    })
  }

  /**
   * 添加菜单权限行
   */
  const addPes = () => {
    const item: MenuPermission = {
      key: Date.now(),
      target: ''
    }
    menuPesForm.menuPesData.push(item)
  }

  /**
   * 移除菜单权限行
   */
  const removePes = (pes: MenuPermission) => {
    const index = menuPesForm.menuPesData.findIndex((item) => pes.key === item.key)

    if (index !== -1) {
      menuPesForm.menuPesData.splice(index, 1)
    }
  }

  /**
   * 添加菜单权限关闭
   */
  const pesClose = () => {
    menuPesForm.menuId = ''
    menuPesForm.menuPesVisible = false
    unref(menuPesRef)?.restoreValidation()
    menuPesForm.menuPesData = []
  }

  /**
   * 权限确认
   */
  const pesSure = (done) => {
    menuPesForm.menuSureLoading = true
    unref(menuPesRef)
      ?.validate()
      .then(() => {
        return savePermission(menuPesForm.menuId, menuPesForm.menuPesData)
      })
      .then(() => {
        message.success(t('system.suc'))
        pesClose()
      })
      .finally(() => {
        done()
        menuPesForm.menuSureLoading = false
      })
  }
</script>
