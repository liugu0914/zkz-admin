import { defineComponent, PropType, toRefs, unref } from 'vue'
import { ConfigRole } from '@/api/modules/sys/role'
import { parents } from '@/utils/domUtils'
import { useI18n } from 'vue-i18n'
import { NAnchor, NAnchorLink } from 'naive-ui'

/**
 * 菜单锚点
 * @author lyc
 * @date 2023-03-01
 */
export default defineComponent({
  name: 'MenuAnchor',
  props: {
    menus: {
      type: Array as PropType<ConfigRole['menu']>,
      default: () => []
    }
  },
  setup(props) {
    const { menus } = toRefs(props)
    const { t } = useI18n()
    const renderMenu = (items = unref(menus)) => {
      return items.map((item) => {
        const isParent = item.parent === 1
        const children = item.children || []
        return (
          <NAnchorLink href={`#role_menu${item.id}`} title={item.name}>
            {{
              default: () => (isParent ? renderMenu(children) : null)
            }}
          </NAnchorLink>
        )
      })
    }

    const getContainer = () => {
      const el = parents(window.document.getElementById('menu-anchor'), '.n-drawer-body-content-wrapper')[0] as HTMLElement
      return el
    }

    return () => (
      <NAnchor listenTo={getContainer} offset-target={getContainer} id='menu-anchor' affix top={70} show-rail={true} ignoreGap={true}>
        <NAnchorLink href='#role_sys' title={t('pages.sys.permission.sysPermission')} />
        <NAnchorLink href='#role_menu' title={t('pages.sys.permission.menuPermission')}>
          {renderMenu()}
        </NAnchorLink>
      </NAnchor>
    )
  }
})
