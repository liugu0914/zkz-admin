import { defineComponent, PropType, reactive, toRefs, unref, watch } from 'vue'
import { ConfigRole } from '@/api/modules/sys/role'
import { useI18n } from 'vue-i18n'
import { NA, NCard, NCheckbox, NCheckboxGroup, NTag } from 'naive-ui'

type MenuPesType = {
  [key: Key]: { permissionId: Key; pes: Key[]; all: Key[]; checked: boolean; allChecked: boolean }
}
/**
 * 角色权限配置
 * @author lyc
 * @date 2023-03-01
 */
export default defineComponent({
  name: 'MenuPes',
  props: {
    menu: {
      type: Array as PropType<ConfigRole['menu']>,
      default: () => []
    },
    fuc: {
      type: Object as PropType<ConfigRole['fuc']>,
      default: () => ({})
    },
    pes: {
      type: Array as PropType<ConfigRole['pes']>,
      default: () => []
    }
  },
  emits: ['change', 'update:pes'],
  setup(props, { emit }) {
    const { menu, fuc, pes } = toRefs(props)

    const { t } = useI18n()

    const data = reactive({
      menuPes: {} as MenuPesType
    })

    watch(pes, () => {
      loadConfig()
    })

    const loadConfig = () => {
      initData()
      loadAllCheck()
    }

    /**
     *  初始化渲染数据
     * @param menus 菜单
     */
    const initData = (menus = unref(menu)) => {
      menus.forEach((item) => {
        const isParent = item.parent === 1
        const children = item.children || []

        if (isParent) {
          data.menuPes[item.id] = {
            permissionId: item.permissionId,
            pes: [],
            all: [],
            checked: unref(pes).includes(item.permissionId),
            allChecked: false // 初始化
          }
          initData(children)
        } else {
          const all = (unref(fuc)[item.id] ?? []).map((item) => item.id) // 所有
          data.menuPes[item.id] = {
            permissionId: item.permissionId,
            all,
            pes: all.filter((p) => unref(pes).includes(p)),
            checked: unref(pes).includes(item.permissionId),
            allChecked: false // 初始化
          }
          data.menuPes[item.id].allChecked = judgeSingleAllCheck(item)
        }
      })
    }

    /**
     *  处理全部选中
     * @param menus 菜单
     */
    const loadAllCheck = (menus = unref(menu)) => {
      menus.forEach((item) => {
        const isParent = item.parent === 1
        const children = item.children || []
        if (isParent) {
          data.menuPes[item.id].allChecked = judgeSuperAllCheck(item)
          data.menuPes[item.id].checked = judgeChildCheck(children)
          loadAllCheck(children)
        } else {
          const menuData = data.menuPes[item.id]
          menuData.allChecked = judgeSingleAllCheck(item)
        }
      })
    }

    /**
     * 判断子菜单是否有选中
     * @param menus 菜单
     * @returns  boolean
     */
    const judgeChildCheck = (menus: Menu[]) => {
      let flag = false
      menus.forEach((item) => {
        const isParent = item.parent === 1
        const children = item.children || []
        flag = flag || data.menuPes[item.id].checked
        if (isParent) {
          flag = flag || judgeChildCheck(children)
        }
        if (flag) {
          return flag
        }
      })
      return flag
    }

    /**
     * render menu tree
     */
    const renderMenu = (menus = unref(menu)) => {
      return menus.map((item) => {
        const isParent = item.parent === 1
        const children = item.children || []
        let nodes: JSX.Element
        if (isParent) {
          nodes = (
            <NCard class='mb-2' id={`role_menu${item.id}`}>
              {{
                default: () => renderMenu(children),
                header: () => (
                  <>
                    <NCheckbox checked={data.menuPes[item.id].checked} disabled class='mr-2'></NCheckbox>
                    <span class='font-medium'>
                      <span class='mr-2'>{item.name}</span>
                      <NTag type='primary' bordered={false} round>
                        {t('pages.sys.role.menu')}
                      </NTag>
                    </span>
                  </>
                ),
                'header-extra': () => (
                  <NA onClick={() => checkAllChange([item], data.menuPes[item.id].allChecked)}>
                    {data.menuPes[item.id].allChecked ? t('pages.sys.role.cancelCheckAll') : t('pages.sys.role.checkAll')}
                  </NA>
                )
              }}
            </NCard>
          )
        } else {
          nodes = (
            <NCard class='mb-2' id={`role_menu${item.id}`}>
              {{
                default: () => renderMenuPes(item),
                header: () => (
                  <NCheckbox
                    checked={data.menuPes[item.id].checked}
                    onUpdateChecked={(checked) => {
                      data.menuPes[item.id].checked = checked
                      change()
                    }}>
                    <span class='font-medium'>
                      <span class='mr-2'>{item.name}</span>
                      <NTag type='primary' bordered={false} round>
                        {t('pages.sys.role.menu')}
                      </NTag>
                    </span>
                  </NCheckbox>
                ),
                'header-extra': () => (
                  <NA onClick={() => checkAllChange([item], data.menuPes[item.id].allChecked)}>
                    {data.menuPes[item.id].allChecked ? t('pages.sys.role.cancelCheckAll') : t('pages.sys.role.checkAll')}
                  </NA>
                )
              }}
            </NCard>
          )
        }
        return <>{nodes}</>
      })
    }

    /**
     *  render menu's pes
     * @param menu menu info
     * @returns menu's pes jsx
     */
    const renderMenuPes = (menu: Menu) => {
      const { id } = menu
      const options = (unref(fuc)[id] ?? []).map((item) => {
        return { label: item.name, value: item.id ?? '' }
      })
      return options.length > 0 ? (
        <NCheckboxGroup
          value={data.menuPes[id].pes}
          options={options}
          onUpdateValue={(arr) => {
            data.menuPes[id].pes = arr
            change()
          }}>
          {options.map((item) => (
            <NCheckbox value={item.value} label={item.label} />
          ))}
        </NCheckboxGroup>
      ) : null
    }

    /**
     * 全选
     * @param menus 菜单
     *  @param flag false 全选 true 取消全选
     */
    const checkAllChange = (menus: Menu[], flag: boolean) => {
      checkAll(menus, flag)
      emitChange()
    }

    /**
     * 全选
     * @param menus 菜单
     *  @param flag false 全选 true 取消全选
     */
    const checkAll = (menus: Menu[], flag: boolean) => {
      menus.forEach((item) => {
        const isParent = item.parent === 1
        const children = item.children || []
        if (!flag) {
          data.menuPes[item.id].checked = true
          data.menuPes[item.id].pes = data.menuPes[item.id].all
        } else {
          data.menuPes[item.id].checked = false
          data.menuPes[item.id].pes = []
        }
        if (!isParent) {
          loadAllCheck()
        } else {
          checkAll(children, flag)
        }
      })
    }

    /**
     * 判断子菜单是否全部选中
     * @param item 菜单
     */
    const judgeSingleAllCheck = (item: Menu) => {
      const { id } = item
      const menuData = data.menuPes[id]
      return menuData.all.length === menuData.pes.length && menuData.checked
    }

    /**
     * 判断父级菜单是否全部选中
     * @param item 菜单
     */
    const judgeSuperAllCheck = (item: Menu) => {
      const { children = [] } = item
      return findChildAllCheck(children)
    }

    const findChildAllCheck = (menus: Menu[]) => {
      let flag = true
      menus.forEach((item) => {
        const isParent = item.parent === 1
        const children = item.children || []
        if (isParent) {
          flag = flag && findChildAllCheck(children)
        } else {
          flag = flag && judgeSingleAllCheck(item)
        }
      })
      return flag
    }

    /**
     * 权限变化
     */
    const change = () => {
      loadAllCheck()
      emitChange()
    }

    /**
     * change回调事件
     */
    const emitChange = () => {
      const result: Key[] = []
      for (const item in data.menuPes) {
        const menuData = data.menuPes[item]
        if (menuData.checked && menuData.permissionId) {
          result.push(menuData.permissionId)
        }
        result.push(...menuData.pes)
      }

      emit('update:pes', result)
      emit('change', result)
    }

    loadConfig()

    return () => renderMenu()
  }
})
