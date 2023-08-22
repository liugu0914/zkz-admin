import { defineComponent, nextTick, PropType, reactive, unref, watch } from 'vue'
import { CloseOutlined, ArrowRightOutlined, PicCenterOutlined, CloseCircleOutlined } from '@ant-design/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { MenuOption, NTabs, NTab, NDropdown } from 'naive-ui'
import { computed } from 'vue'
import { isFunction, isString } from 'lodash-es'
import { useSettings } from '@/hooks/setting/useSettings'
import IconFont from '@/components/icon/IconFont.vue'
import { TabOption, useTabs } from './helper'
import css from './index.module.css'

export default defineComponent({
  name: 'Tabs',
  props: {
    options: {
      type: Array as PropType<TabOption[]>,
      default: () => []
    }
  },
  setup() {
    const { t } = useI18n()
    const currentRoute = useRoute()
    const router = useRouter()
    const { vars } = useSettings()

    const { tabs, activeKey } = useTabs()

    /**
     * 打开新的tab
     * @param tab tab信息
     */
    const openTab = (tab: TabOption) => {
      activeKey.value = tab.key
      tabs.value.push({ ...tab, closeAble: tab.closeAble ?? true })
    }

    watch(
      () => currentRoute,
      (route) => {
        const { meta = {} } = route
        if (route.name && meta.name) {
          const tab: TabOption = {
            key: meta.key || route.fullPath,
            name: meta.name,
            icon: meta.icon,
            routeName: route.name as string,
            closeAble: meta.closeAble ?? true,
            params: route.params,
            query: route.query
          }
          const isAble = tabs.value.findIndex((item) => item.key === tab.key) === -1 // 是否可以新增tab

          if (isAble) {
            openTab(tab)
          } else {
            activeKey.value = tab.key
          }
        }
      },
      { deep: true, immediate: true }
    )

    /**
     * 关闭tab
     */
    const closeTab = (targetKey: Key, action?: 'self' | 'right' | 'other' | 'all', e?: Event) => {
      e && e.stopPropagation()
      let value = tabs.value
      let index = value.findIndex((item) => item.key === targetKey)

      switch (action) {
        case 'right': {
          const rights = value.slice(index + 1).filter((item) => item.closeAble)
          tabs.value = value.filter((item) => !rights.some((san) => san.key === item.key))
          break
        }
        case 'other':
          tabs.value = value.filter((item) => !item.closeAble || item.key === targetKey)
          break
        case 'all':
          tabs.value = value.filter((item) => !item.closeAble)
          break
        default:
        case 'self':
          value[index].closeAble && value.splice(index, 1)
          break
      }
      value = tabs.value
      if (value.length === 0) {
        activeKey.value = undefined
      } else {
        index = value.findIndex((item) => item.key === unref(activeKey)) // 判断是否存在
        if (index < 0) {
          index = value.findIndex((item) => item.key === targetKey)
          activeKey.value = index > -1 ? targetKey : value[0].key
        }
      }
      changeTab(activeKey.value)
    }

    const changeTab = (targetKey: Key | undefined) => {
      if (!targetKey) {
        router.push({ name: 'root' })
      }
      const tab = tabs.value.find((item) => item.key === targetKey)
      if (tab && tab.routeName) {
        router.push({ name: tab.routeName, params: tab.params, query: tab.query })
      }
    }

    // watch(activeKey, changeTab)

    // tab 右键菜单
    const data = reactive({
      x: 0,
      y: 0,
      show: false,
      tab: {} as TabOption
    })

    /**
     * 右键菜单触发
     * @param tab 触发的tab
     * @param e 鼠标事件
     */
    const handleContextMenu = (tab: TabOption, e: MouseEvent) => {
      e.preventDefault()
      data.show = false
      data.tab = tab
      nextTick().then(() => {
        data.show = true
        data.x = e.clientX
        data.y = e.clientY
      })
    }

    const tabMenus = computed<MenuOption[]>(() => [
      {
        label: t('layout.tabs.close'),
        key: '1',
        icon: () => <CloseOutlined />,
        handle: () => closeTab(data.tab.key)
      },
      {
        label: t('layout.tabs.closeRight'),
        key: '2',
        icon: () => <ArrowRightOutlined />,
        handle: () => closeTab(data.tab.key, 'right')
      },
      {
        label: t('layout.tabs.closeOther'),
        key: '3',
        icon: () => <PicCenterOutlined />,
        handle: () => closeTab(data.tab.key, 'other')
      },
      {
        label: t('layout.tabs.closeAll'),
        key: '4',
        icon: () => <CloseCircleOutlined />,
        handle: () => closeTab(data.tab.key, 'all')
      }
    ])

    const onClickoutside = () => {
      data.show = false
    }
    const onSelect = (key: Key, option: MenuOption) => {
      const handle = option.handle as () => void
      isFunction(handle) && handle()
      onClickoutside()
    }

    /**
     * 切换路由
     */
    const clickTab = (key: Key) => {
      activeKey.value = key
      changeTab(key)
    }

    const tabsPadding = computed(() => {
      let padding = vars.value['--zkz-padding']
      if (isString(padding)) {
        padding = parseInt(padding.replace('px', '') || 0)
      }
      return padding === 0 ? 10 : padding
    })

    return () => (
      <div class={css.zkzTabs}>
        <NTabs type='card' animated value={activeKey.value} onUpdateValue={clickTab} tabsPadding={tabsPadding.value}>
          {tabs.value.map((tab) => (
            <NTab class='group zkz-layout-shadow' name={tab.key} onContextmenu={(e) => handleContextMenu(tab, e)}>
              <span>
                <IconFont type='menu' value={tab.icon} /> {tab.name}
              </span>
              {tab.closeAble ? (
                <CloseOutlined
                  class={{
                    'tab-icon w-0 opacity-0 group-hover:w-[1rem] group-hover:opacity-100': true,
                    'tab-icon-active': activeKey.value === tab.key
                  }}
                  onClick={(e) => closeTab(tab.key, 'self', e)}
                />
              ) : null}
            </NTab>
          ))}
        </NTabs>
        <NDropdown
          placement='bottom-start'
          options={tabMenus.value}
          trigger='manual'
          show={data.show}
          x={data.x}
          y={data.y}
          onClickoutside={onClickoutside}
          onSelect={onSelect}
        />
      </div>
    )
  }
})
