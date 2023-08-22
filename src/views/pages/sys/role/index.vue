<template>
  <NCard :bordered="false" class="h-full">
    <BaseTable
      v-model:checked-row-keys="data.selectedRows"
      :columns="columns"
      :data="data.dataSource"
      :loading="data.loading"
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
              <NA @click="openConfig(row.id)"> <ShareAltOutlined /> </NA>
            </template>
            {{ t('pages.sys.role.configRole') }}
          </NTooltip>
          <NTooltip trigger="hover">
            <template #trigger>
              <NA @click="openAdd(row.id)"> <PlusOutlined /> </NA>
            </template>
            {{ t('pages.sys.role.addChildRole') }}
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
        <NFormItem :label="t('pages.sys.role.name')" path="name">
          <NInput
            v-model:value="data.dataForm.name"
            clearable
            :maxlength="50"
            :placeholder="t('common.inputPlz', { name: t('pages.sys.role.name') })" />
        </NFormItem>
        <NFormItem :label="t('pages.sys.role.des')" path="des">
          <NInput
            v-model:value="data.dataForm.des"
            clearable
            :maxlength="500"
            :placeholder="t('common.inputPlz', { name: t('pages.sys.role.des') })"
            type="textarea" />
        </NFormItem>
        <NFormItem :label="t('pages.sys.role.orderNum')" path="orderNum">
          <NInputNumber
            v-model:value="data.dataForm.orderNum"
            class="w-full"
            clearable
            :max="999"
            :min="0"
            :placeholder="t('common.inputPlz', { name: t('pages.sys.role.orderNum') })" />
        </NFormItem>
        <NFormItem :label="t('pages.sys.role.enable')" path="enable">
          <NSwitch v-model:value="data.dataForm.enable" :checked-value="1" :unchecked-value="0" />
        </NFormItem>
      </NForm>
    </Modal>
  </NCard>

  <Modal v-model:show="role.visible" :title="t('pages.sys.role.configRole')" width="80%" @close="closeConfig" @confirm="saveConfig">
    <NRow v-if="appData.apps.length > 1" class="mb-2">
      <NCol :span="24">
        <NTabs v-model:activeKey="appData.appId" @change="changeNpp">
          <NTab v-for="app in appData.apps" :key="app.id" :name="app.id">{{ app.name }}</NTab>
        </NTabs>
      </NCol>
    </NRow>

    <NRow :gutter="16">
      <NCol :span="20">
        <NCard id="role_sys" class="mb-2">
          <template #header>
            <span class="font-bold"> {{ t('pages.sys.permission.sysPermission') }} </span>
          </template>
          <template #header-extra>
            <NA @click="sysCheckAll">
              {{ isSysAllChecked ? t('pages.sys.role.cancelCheckAll') : t('pages.sys.role.checkAll') }}
            </NA>
          </template>
          <NCheckboxGroup v-model:value="role.sysPes" :options="sysOptions">
            <NCheckbox v-for="item in sysOptions" :label="item.label" :value="item.value" />
          </NCheckboxGroup>
        </NCard>
        <NCard id="role_menu">
          <template #header>
            <span class="font-bold"> {{ t('pages.sys.permission.menuPermission') }} </span>
          </template>
          <template #header-extra>
            <NA @click="menuCheckAll">
              {{ isAllChecked ? t('pages.sys.role.cancelCheckAll') : t('pages.sys.role.checkAll') }}
            </NA>
          </template>
          <MenuPes v-if="role.menu.length > 0" v-model:pes="role.menuPes" :fuc="role.fuc" :menu="role.menu" />
        </NCard>
      </NCol>
      <NCol :span="4"> <MenuAnchor :menus="role.menu" /> </NCol>
    </NRow>
  </Modal>
</template>
<script setup lang="ts">
  import { computed, onBeforeMount, reactive, ref, unref } from 'vue'
  import { columns, defaultForm, defaultRules } from './constant'
  import BaseTable from '@/components/table'
  import Modal from '@/components/modal'
  import MenuPes from './menuPes'
  import MenuAnchor from './menuAnchor'
  import { getList, getOne, save, del, getConfigPermission, savePermission, ConfigRole, SaveRoleConfig } from '@/api/modules/sys/role'
  import { getApps } from '@/api/modules/sys/app'
  import { ShareAltOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
  import { useI18n } from 'vue-i18n'
  import { cloneDeep, isArray } from 'lodash-es'
  import to from '@/utils/await-to'
  import { FormInst } from 'naive-ui'
  import { useNaive } from '@/hooks/setting/useNaive'

  const { message } = useNaive()

  const { t } = useI18n()
  const formRef = ref<FormInst>()
  const data = reactive<PageData<Role, true, false>>({
    dataSource: [],
    query: {},
    selectedRows: [],
    loading: false,
    // 控制抽屉
    dataForm: cloneDeep(defaultForm),
    rules: defaultRules,
    title: '',
    visible: false
  })

  onBeforeMount(() => {
    pageLoad()
    appLoad()
  })

  /**
   * 分页数据加载
   * @parmas params 查询数据
   */
  const pageLoad = (params = data.query) => {
    data.loading = true
    getList(params)
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
    data.query = searchs
    pageLoad()
  }

  /**
   * 打开添加
   * @parmas pagination 分页数据
   */
  const openAdd = (id?: Key) => {
    data.title = t('common.addText')
    data.visible = true
    data.dataForm.enable = 1
    data.dataForm.superId = id
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

  /**
   * 获取app应用
   */
  const appData = reactive<{
    appId: Key
    apps: App[]
  }>({
    appId: '',
    apps: []
  })
  const appLoad = async () => {
    const res = await getApps()
    const resData = res.data || []
    appData.apps = resData
    if (resData.length > 0) {
      appData.appId = resData[0].id ?? ''
    }
  }

  /**
   * 切换应用
   */
  const changeNpp = (activeKey: Key) => {
    appData.appId = activeKey
  }

  const defaultRole = {
    visible: false,
    sureLoading: false,
    roleId: '' as Key,
    appId: '' as Key,
    sys: [] as ConfigRole['sys'],
    menu: [] as ConfigRole['menu'],
    allMenuPes: [] as ConfigRole['pes'],
    fuc: {} as ConfigRole['fuc'],
    pes: [] as ConfigRole['pes'],
    sysPes: [] as ConfigRole['pes'],
    menuPes: [] as ConfigRole['pes']
  }

  const role = reactive(defaultRole)

  /**
   * 打开配置权限
   */
  const openConfig = (id: Key) => {
    role.roleId = id
    role.appId = appData.appId
    loadConfig()
    role.visible = true
  }

  /**
   * load api data
   */
  const loadConfig = async () => {
    const [, res] = await to(getConfigPermission(role.appId, role.roleId))
    if (!res) {
      return
    }
    const { sys = [], menu = [], fuc = {}, pes = [] } = res.data
    role.sys = sys
    role.menu = menu
    role.fuc = fuc
    role.pes = pes
    role.sysPes = sys.filter((item) => item.id && pes.includes(item.id)).map((item) => item.id)
    getMenuPes(menu)
    for (const key in fuc) {
      role.allMenuPes.push(...(fuc[key] ?? []).map((item) => item.id))
    }
    role.menuPes = pes.filter((item) => !role.sysPes.includes(item))
  }

  /**
   *  获取菜单权限
   * @param menus 菜单
   */
  const getMenuPes = (menus: Menu[]) => {
    menus.forEach((item) => {
      const isParent = item.parent === 1
      const children = item.children || []
      const permissionId = item.permissionId
      if (!role.allMenuPes.includes(permissionId)) {
        role.allMenuPes.push(permissionId)
      }
      if (isParent) {
        getMenuPes(children)
      }
    })
  }

  /**
   * 系统权的配置
   */
  const sysOptions = computed(() => {
    return role.sys.map((item) => {
      return { label: item.name, value: item.id ?? '' }
    })
  })

  /**
   * 菜单权限全选
   */
  const sysCheckAll = () => {
    role.sysPes = isSysAllChecked.value ? [] : role.sys.map((item) => item.id)
  }

  /**
   * 判断系统是否全选
   */
  const isSysAllChecked = computed(() => {
    return role.sysPes.length === role.sys.length
  })

  /**
   * 菜单权限全选
   */
  const menuCheckAll = () => {
    role.menuPes = isAllChecked.value ? [] : cloneDeep(role.allMenuPes)
  }

  /**
   * 判断菜单是否全选
   */
  const isAllChecked = computed(() => {
    return role.menuPes.length === role.allMenuPes.length
  })

  /**
   * 关闭配置权限
   */
  const closeConfig = () => {
    role.visible = false
    role.appId = ''
    role.sys = []
    role.menu = []
    role.fuc = {}
    role.pes = []
    role.sysPes = []
    role.menuPes = []
    role.allMenuPes = []
  }

  /**
   * 保存 配置权限
   */
  const saveConfig = () => {
    const config: SaveRoleConfig = {
      roleId: role.roleId,
      appId: role.appId,
      sysPes: role.sysPes,
      menuPes: role.menuPes
    }
    savePermission(config)
      .then(() => {
        message.success(t('system.suc'))
        pageLoad()
      })
      .finally(() => {
        closeConfig()
      })
  }
</script>
