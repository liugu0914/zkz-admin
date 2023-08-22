<template>
  <NRow v-if="appData.apps.length > 1" class="mb-4">
    <NCol :span="24">
      <NTabs type="line" :value="appData.appId" @update:value="changeApp">
        <NTab v-for="app in appData.apps" :name="app.id">{{ app.name }}</NTab>
      </NTabs>
    </NCol>
  </NRow>

  <NCard :bordered="false" class="mb-4">
    <template #header>
      <b>{{ t('pages.sys.permission.sysPermission') }}</b>
    </template>
    <template #header-extra>
      <NButton type="primary" @click="openNddPes(t('pages.sys.permission.sysPermission'), 'sys')">
        <PlusOutlined />{{ t('pages.sys.permission.addPermission') }}
      </NButton>
    </template>
    <Draggable
      :animation="300"
      component="NGrid"
      :component-data="componentData"
      group="sys"
      handle=".permission-drag-able"
      item-key="id"
      :list="data.sys"
      @update="drag('sys')">
      <NGi v-for="item in data.sys" :key="item.id">
        <ActionAlter :disabled="item.enable === 0" :message="item.name" @delete="delPes(item.id, 'sys')" @edit="openEditPes(item.id)" />
      </NGi>
    </Draggable>
  </NCard>

  <NCard :bordered="false">
    <template #header>
      <b> {{ t('pages.sys.permission.menuPermission') }}</b>
    </template>
    <template #header-extra>
      <NButton type="primary" @click="openNddPes(t('pages.sys.permission.menuPermission'), 'fuc')">
        <PlusOutlined /> {{ t('pages.sys.permission.addPermission') }}
      </NButton>
    </template>
    <NRow :gutter="[16, 16]">
      <NCol span="6">
        <NButton class="!mb-2" type="primary" @click="openConfigMenu">
          <SettingOutlined />{{ t('pages.sys.permission.configMenu') }}
        </NButton>
        <NTree
          v-if="data.menu.length > 0"
          :data="data.menu"
          default-expand-all
          :selected-keys="data.selectedKeys"
          @update:selected-keys="onSelect" />
      </NCol>
      <NCol span="18">
        <Draggable
          :animation="250"
          component="NGrid"
          :component-data="componentData"
          group="fuc"
          handle=".permission-drag-able"
          item-key="id"
          :list="data.fuc"
          tag="div"
          @update="drag('fuc')">
          <NGi v-for="item in data.fuc" :key="item.id">
            <ActionAlter :disabled="item.enable === 0" :message="item.name" @delete="delPes(item.id, 'fuc')" @edit="openEditPes(item.id)" />
          </NGi>
        </Draggable>
      </NCol>
    </NRow>
  </NCard>

  <Modal v-model:show="menuConfig.visible" :title="t('pages.sys.permission.configMenu')" @close="configClose" @confirm="configSure">
    <NTree
      v-if="menuConfig.tree.length > 0"
      v-model:checked-keys="menuConfig.checkedKeys"
      cascade
      checkable
      :data="menuConfig.tree"
      default-expand-all />
  </Modal>
  <Modal v-model:show="pes.visible" :title="pes.title" @close="pesClose" @confirm="pesSure">
    <NForm ref="formRef" :model="pes.dataForm" :rules="defaultRules">
      <NFormItem :label="t('pages.sys.permission.name')" path="name">
        <NInput
          v-model:value="pes.dataForm.name"
          clearable
          :maxlength="50"
          :placeholder="t('common.inputPlz', { name: t('pages.sys.permission.name') })" />
      </NFormItem>
      <NFormItem :label="t('pages.sys.permission.charm')" path="charm">
        <NInput
          v-model:value="pes.dataForm.charm"
          clearable
          :maxlength="100"
          :placeholder="t('common.inputPlz', { name: t('pages.sys.permission.charm') })" />
      </NFormItem>
      <div class="mb-2">{{ t('pages.sys.permission.targetUrl') }}</div>
      <NFormItem
        v-for="(item, index) in pes.dataForm.permissions"
        :key="item.key"
        :path="`permissions[${index}].target`"
        :rule="{
          required: false,
          message: t('pages.sys.permission.targetContent'),
          trigger: 'change'
        }"
        :show-label="false">
        <NInput
          v-model:value="item.target"
          autocomplete="off"
          :class="overOne ? 'w-11/12' : 'w-full'"
          clearable
          :placeholder="t('common.inputPlz', { name: t('pages.sys.permission.url') })" />
        <MinusCircleOutlined v-if="overOne" class="cursor-pointer ml-2" @click="removePes(item)" />
      </NFormItem>
      <NFormItem :show-label="false">
        <NButton :class="overOne ? '!w-11/12' : '!w-full'" dashed @click="addPes">
          <PlusOutlined />
          {{ t('pages.sys.permission.addPermission') }}
        </NButton>
      </NFormItem>

      <NFormItem :label="t('pages.sys.permission.enable')" path="enable">
        <NSwitch v-model:value="pes.dataForm.enable" :checked-value="1" :unchecked-value="0" />
      </NFormItem>
    </NForm>
  </Modal>
</template>
<script setup lang="ts">
  import { computed, onBeforeMount, reactive, ref, unref } from 'vue'
  import { VueDraggableNext as Draggable } from 'vue-draggable-next'
  import ActionAlter from '@/components/alter/ActionAlter.vue'
  import { getApps } from '@/api/modules/sys/app'
  import {
    getSys,
    getMenu,
    getFuc,
    getConfigMenu,
    saveMenu,
    savePes,
    getPes,
    del,
    moveOrder,
    type Permission,
    type PermissionDetail
  } from '@/api/modules/sys/permission'
  import Modal from '@/components/modal'
  import { SettingOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons-vue'
  import { isEqual, cloneDeep } from 'lodash-es'
  import { useI18n } from 'vue-i18n'
  import { toTree, getFirstAbleMenu } from '@/utils/base'
  import { defaultForm, defaultRules } from './constant'
  import { FormInst } from 'naive-ui'
  import { useNaive } from '@/hooks/setting/useNaive'

  interface Props {
    sys: Array<Permission>
    menu: Array<Menu>
    fuc: Array<Permission>
    menuId?: Key
    selectedKeys: Key[]
  }

  const { message } = useNaive()

  const { t } = useI18n()

  const data = reactive<Props>({
    sys: [],
    menu: [],
    fuc: [],
    menuId: undefined,
    selectedKeys: []
  })

  onBeforeMount(() => {
    appLoad().then(() => {
      pageLoad()
    })
  })

  const componentData = reactive({
    props: {
      cols: '4 s:3 l:4 xl:6',
      xGap: '16',
      yGap: '16',
      responsive: 'responsive'
    }
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
  const appLoad = async () => {
    const res = await getApps()
    const resData = res.data || []
    appData.apps = resData
    if (resData.length > 0) {
      appData.appId = resData[0].id
    }
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
    sysLoad()
    menuLoad()
  }

  /**
   * 系统权限加载
   */
  const sysLoad = () => {
    getSys(appData.appId).then((res) => {
      data.sys = res.data || []
    })
  }

  /**
   * 菜单权限加载
   */
  const menuLoad = () => {
    getMenu(appData.appId).then((res) => {
      const tree = res.data ?? []
      data.menu = toTree(tree, { label: 'name', key: 'id' }, (menu) => {
        delete menu.parent
        if (menu.children && menu.children.length > 0) {
          menu.disabled = true
          menu.selectable = false
        }
      })
      if (data.menu.length > 0) {
        const key = getFirstAbleMenu(data.menu, (menu) => !!menu.router)?.id
        if (key) {
          data.menuId = key
          data.selectedKeys = [key]
        }
        fucLoad()
      }
    })
  }

  /**
   * 菜单明细权限加载
   */
  const fucLoad = () => {
    getFuc(data.menuId).then((res) => {
      data.fuc = res.data || []
    })
  }

  /**
   * 点击树节点
   */
  const onSelect = (selectedKeys: Key[]) => {
    if (selectedKeys.length === 0 || isEqual(selectedKeys, data.selectedKeys)) {
      return
    }
    data.selectedKeys = selectedKeys
    data.menuId = selectedKeys[0]
    fucLoad()
  }

  // ============= 菜单配置 ============
  const menuConfig = reactive({
    visible: false,
    sureLoading: false,
    tree: [] as Menu[],
    checkedKeys: [] as Key[]
  })
  /**
   * 打开弹窗
   */
  const openConfigMenu = () => {
    menuConfig.visible = true
    getConfigMenu(appData.appId).then((res) => {
      menuConfig.tree = toTree(res.data ?? [], { label: 'name', key: 'id' }, (menu) => {
        delete menu.parent
        if (menu.checked) {
          menuConfig.checkedKeys.push(menu.id)
        }
      })
    })
  }
  /**
   * 关闭菜单配置
   */
  const configClose = () => {
    menuConfig.visible = false
    menuConfig.checkedKeys = []
  }

  /**
   * 保存菜单配置
   */
  const configSure = (done) => {
    if (!appData.appId) {
      return
    }

    saveMenu(appData.appId, menuConfig.checkedKeys)
      .then(() => {
        message.success(t('system.suc'))
        menuLoad()
        configClose()
        menuConfig.visible = false
      })
      .finally(() => {
        done()
      })
  }

  // ============= 权限配置 ============
  const pes = reactive({
    visible: false,
    title: '',
    sureLoading: false,
    dataForm: cloneDeep(defaultForm)
  })

  const formRef = ref<FormInst>()

  /**
   * 是否大于一个
   */
  const overOne = computed(() => {
    return pes.dataForm.permissions.length > 1
  })

  /**
   * 打开添加权限弹窗
   */
  const openNddPes = (title: string, type: Permission['type']) => {
    pes.visible = true
    pes.title = title
    pes.dataForm = {
      appId: appData.appId,
      menuId: data.menuId,
      type,
      enable: 1,
      permissions: []
    }
    addPes()
  }

  /**
   * 打开编辑权限弹窗
   */
  const openEditPes = (id?: Key) => {
    if (!id) {
      return
    }
    pes.visible = true
    pes.title = t('pages.sys.permission.editPermission')
    getPes(id).then((res) => {
      pes.dataForm = res.data ?? {}
      if (pes.dataForm.permissions.length === 0) {
        addPes()
      }
    })
  }

  /**
   * 删除权限
   */
  const delPes = (id: Key | undefined, type: Permission['type']) => {
    if (!id) {
      return
    }
    del(String(id)).then(() => {
      message.success(t('system.suc'))
      if (type === 'sys') {
        sysLoad()
      } else {
        fucLoad()
      }
    })
  }

  /**
   * 添加权限明细
   */
  const addPes = () => {
    const item: PermissionDetail = {
      key: Date.now(),
      target: ''
    }
    pes.dataForm.permissions.push(item)
  }

  /**
   * 删除权限明细
   * @param one 权限明细
   */
  const removePes = (one: PermissionDetail) => {
    const index = pes.dataForm.permissions.findIndex((item) => one.key === item.key)

    if (index !== -1) {
      pes.dataForm.permissions.splice(index, 1)
    }
  }

  /**
   * 关闭权限弹窗
   */
  const pesClose = () => {
    pes.visible = false
    unref(formRef)?.restoreValidation()
    pes.dataForm = cloneDeep(defaultForm)
  }

  /**
   * 保存权限弹窗
   */
  const pesSure = (done) => {
    pes.sureLoading = true
    const { type } = pes.dataForm
    unref(formRef)
      ?.validate()
      .then(() => {
        return savePes(pes.dataForm)
      })
      .then(() => {
        message.success(t('system.suc'))
        pesClose()
        if (type === 'sys') {
          sysLoad()
        } else {
          fucLoad()
        }
      })
      .finally(() => {
        done()
        pes.sureLoading = false
      })
  }

  const drag = (type: Permission['type']) => {
    const tmpPes = type === 'sys' ? data.sys : data.fuc
    tmpPes.forEach((item, index) => {
      item.orderNum = index + 1
    })
    moveOrder(tmpPes).then(() => {
      message.success(t('system.suc'))
    })
  }
</script>
