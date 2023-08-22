import { toRefs, defineComponent, ref, reactive, onMounted, watch, computed, PropType, onBeforeUnmount } from 'vue'
import { useSettings } from '@/hooks/setting/useSettings'
import { NList, NListItem, NTooltip, NScrollbar } from 'naive-ui'
import { useRoute, RouteLocationNormalizedLoaded, useRouter } from 'vue-router'
import css from './index.module.css'
import { useMouseInElement } from '@vueuse/core'
import IconFont from '@/components/icon/IconFont.vue'
import BaseMenu from '../BaseMenu'
import { cloneDeep } from 'lodash-es'

interface Props {
  menus: Menu[]
}

/**
 * 混合菜单
 */
export default defineComponent({
  name: 'MixMenu',
  props: {
    menus: {
      type: Array as PropType<Props['menus']>,
      default: () => []
    },
    tigger: {
      type: String as PropType<'hover' | 'click'>,
      default: 'click'
    }
  },
  setup(props) {
    const { menus, tigger } = toRefs(props)

    const { collapsed, showExtra, sideDark } = useSettings()

    const router = useRouter()

    const currentRoute = useRoute()

    const activeMenu = ref<Menu | undefined>()

    const sideRef = ref()

    /**
     * 触发主菜单事件
     * @param item 菜单数据
     */
    const clickMenuItem = (item: Menu) => {
      if (item.disabled) {
        return
      }

      if (item.parent === 0 && item.router) {
        showExtra.value = false
        // 子节点 ,有路由
        if (item.isLink && !item.isInner) {
          // 链接路由
          if (item.url && /http(s)?:/.test(item.url)) {
            window.open(item.url)
          }
        } else if (activeMenu.value?.id !== item.id) {
          // 非链接  不是当前则跳转
          router.push({ name: item.router })
        }
        return
      }

      if (!showExtra.value) {
        showExtra.value = true
      }
      if (tigger.value === 'hover' && activeMenu.value?.id === item.id) {
        return
      }

      activeMenu.value = cloneDeep(item)
    }

    const showExtraComputed = computed(() => {
      return showExtra.value && activeMenu.value && activeMenu.value.children && activeMenu.value.children.length > 0
    })
    const subMenuData = computed(() => {
      const data = activeMenu?.value || ({} as Menu)
      data.type = 'group'
      return [data]
    })

    /**
     * 监听是否在菜单之外
     */
    onMounted(() => {
      const mouse = reactive(useMouseInElement(sideRef.value))
      watch(
        () => mouse.isOutside,
        (value) => {
          if (showExtra.value && value) {
            showExtra.value = false
            currentMenu()
          }
        }
      )
    })

    /**
     * 获取当前菜单
     * @param newRouter 路由变化
     */
    const currentMenu = (newRouter: RouteLocationNormalizedLoaded = currentRoute) => {
      const { breadcrumb = [] } = newRouter.meta
      if (breadcrumb.length > 0) {
        const { id } = breadcrumb[0]
        const index = menus.value.findIndex((menu) => menu.id === id)
        if (index >= 0) {
          activeMenu.value = cloneDeep(menus.value[index])
        }
      }
    }

    /**
     * 监听路由变化
     */
    watch(currentRoute, currentMenu, { deep: true, immediate: true })

    /**
     * 销毁之前
     */
    onBeforeUnmount(() => {
      showExtra.value = false
    })

    /**
     * 菜单触发方式
     * @param item 菜单数据
     */
    const tiggerMethod = (item: Menu) => {
      return { [tigger.value === 'hover' ? 'onMouseover' : 'onClick']: () => clickMenuItem(item) }
    }

    /**
     * 子菜单
     * @param item 菜单数据
     * @returns 菜单节点
     */
    const renderItem = (item: Menu) => {
      return (
        <NListItem
          class={{ '!cursor-not-allowed opacity-[0.45]': item.disabled, active: activeMenu?.value?.id === item.id }}
          {...tiggerMethod(item)}>
          <div class='flex flex-col py-2'>
            <div class='text-2xl flex justify-center items-center'>
              <IconFont type='menu' value={item.icon} />
            </div>
            {collapsed.value ? null : <div class='text-center pt-[4px] text-xs'>{item.name}</div>}
          </div>
        </NListItem>
      )
    }

    /**
     * 渲染菜单
     */
    const renderMenu = () => {
      return menus.value.map((item) => {
        return (
          <div class='p-[4px]'>
            {collapsed.value ? (
              <NTooltip trigger='hover' placement='right'>
                {{
                  trigger: () => renderItem(item),
                  default: () => <span>{item.name}</span>
                }}
              </NTooltip>
            ) : (
              renderItem(item)
            )}
          </div>
        )
      })
    }

    return () => (
      <div class={css.mixMenu} ref={sideRef}>
        <div class={{ [css.mixMenuMain]: true, 'flex-1': true }}>
          <NScrollbar class='h-full'>
            <NList hoverable clickable>
              {renderMenu()}
            </NList>
          </NScrollbar>
        </div>
        <div class={{ [css.mixMenuExtra]: true, [css.showSubExtra]: showExtraComputed.value }}>
          <NScrollbar class='h-full'>
            {showExtraComputed.value ? (
              <BaseMenu root-indent={18} indent={10} collapsed={false} menus={subMenuData.value} inverted={sideDark.value} />
            ) : null}
          </NScrollbar>
        </div>
      </div>
    )
  }
})
