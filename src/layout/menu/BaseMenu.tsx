import { NMenu, MenuOption, menuProps } from 'naive-ui'
import { defineComponent, PropType, ref, toRefs, watch } from 'vue'
import { useRouter, useRoute, RouteLocationNormalizedLoaded } from 'vue-router'
import IconFont from '@/components/icon/IconFont.vue'
// import { useSettings } from '@/hooks/setting/useSettings'

type Props = MenuOption & {
  menus: Menu[]
}

export default defineComponent({
  name: 'BaseMenu',
  inheritAttrs: false,
  props: {
    ...menuProps,
    menus: {
      type: Array as PropType<Props['menus']>,
      default: () => []
    }
  },
  setup(props) {
    const { menus } = toRefs(props)

    const router = useRouter()
    const currentRoute = useRoute()

    // 菜单
    const menuRef = ref()
    // 选中的值
    const selectedKey = ref<Key | null>(null)

    /**
     * 路由选中
     * @param newRouter 路由
     */
    const setKeys = (newRouter: RouteLocationNormalizedLoaded) => {
      const { key = '' } = newRouter.meta
      selectAndExpand(key)
    }
    /**
     * 选中并展开展开
     * @param key 选中的值
     */
    const selectAndExpand = (key: Key) => {
      selectedKey.value = key
      menuRef.value?.showOption(key)
    }

    /**
     * 监听路由变化
     */
    watch(() => currentRoute, setKeys, { deep: true, immediate: true })
    // 点击子菜单
    const clickMenuItem = (key: Key, san: MenuOption) => {
      const item = san as Menu
      const { meta = {} } = currentRoute
      if (item.id === meta.key) {
        return
      }
      if (!item.path) {
        // 如果点击的子菜单没有path 则表示无效
        return
      }
      if (item.isLink && !item.isInner) {
        if (item.url && /http(s)?:/.test(item.url)) {
          window.open(item.url)
        }
      } else {
        router.push({ name: item.router })
      }
    }

    const renderIcon = (option: MenuOption) => {
      const item = option as Menu
      return <IconFont type='menu' value={item.icon} />
    }

    return () => (
      <NMenu
        {...props}
        keyField='id'
        labelField='name'
        ref={menuRef}
        value={selectedKey.value}
        onUpdateValue={clickMenuItem}
        options={menus.value as MenuOption[]}
        renderIcon={renderIcon}
      />
    )
  }
})
