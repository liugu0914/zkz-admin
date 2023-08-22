import { computed, defineComponent, ref, unref } from 'vue'
import { useRouter } from 'vue-router'
import {
  UserOutlined,
  ReloadOutlined,
  SettingOutlined,
  LogoutOutlined,
  SkinOutlined,
  BellOutlined,
  TranslationOutlined
} from '@ant-design/icons-vue'
import { MenuOption, DropdownOption, NBadge, NDropdown, NAvatar, NDrawer, NDrawerContent, NIcon } from 'naive-ui'
import Setting from '@/components/setting/index.vue'
import { Locales } from '@/enums/locale'
import { useLocale } from '@/i18n/useLocale'
import { useI18n } from 'vue-i18n'
import { useStoreWithOut } from '@/store/modules/accout'
import { useRedo } from '@/hooks/system/useRedo'
import { useLogin } from '@/hooks/accout/useLogin'
import { isFunction } from 'lodash-es'
export default defineComponent({
  name: 'Info',
  setup() {
    const { changeLocale } = useLocale()
    const { t } = useI18n()
    const router = useRouter()

    const visible = ref(false)
    const toggleVisible = () => (visible.value = !unref(visible))

    const { getUser: user } = useStoreWithOut()
    const { logout } = useLogin()
    const userLogout = async () => {
      await logout()
      router.push({ name: 'login' })
    }

    const { reflesh, loading } = useRedo()

    const i18nOptions: MenuOption[] = []

    Locales.forEach((item) => {
      i18nOptions.push({
        key: item.lang,
        label: item.label,
        icon: () => <>{item.icon}</>,
        handle: () => changeLocale(item.lang)
      })
    })

    // 右侧菜单选择
    const menuOptions = computed<MenuOption[]>(() => [
      {
        key: 'user',
        label: t('layout.header.userInfo'),
        icon: () => <SettingOutlined />
      },
      {
        key: 'personalConfig',
        label: t('layout.header.personalConfig'),
        icon: () => <SkinOutlined />,
        handle: () => toggleVisible()
      },
      {
        key: 'logout',
        label: t('layout.header.logout'),
        icon: () => <LogoutOutlined />,
        handle: () => userLogout()
      }
    ])
    const selectOption = (key: Key, option: DropdownOption) => {
      const handle = option.handle as () => void
      isFunction(handle) && handle()
    }

    return () => (
      <>
        <div class='header__actions'>
          <div class='header__actions__item'>
            <NBadge count='5' dot>
              <BellOutlined class='text-[1rem]' />
            </NBadge>
          </div>

          <div class='header__actions__item' onClick={reflesh}>
            <ReloadOutlined class='text-[1rem]' spin={loading.value} />
          </div>
          <NDropdown trigger='click' options={i18nOptions} onSelect={selectOption}>
            <div class='header__actions__item'>
              <TranslationOutlined class='text-[1rem]' />
            </div>
          </NDropdown>

          <NDropdown trigger='click' options={menuOptions.value} onSelect={selectOption}>
            <div class='header__actions__item actions__item--wm' title={user?.userName}>
              <NAvatar size='small' src={user?.imgUrl || 'empty'} class='flex items-center justify-center'>
                {{
                  fallback: () => (
                    <NIcon>
                      <UserOutlined />
                    </NIcon>
                  )
                }}
              </NAvatar>
              <span class='mx-2 max-w-[100px] truncate'>{user?.userName}</span>
            </div>
          </NDropdown>
        </div>

        <NDrawer show={visible.value} width={380} onUpdateShow={(value) => (visible.value = value)}>
          <NDrawerContent title={t('layout.header.personalConfig')} closable native-scrollbar={false}>
            <Setting />
          </NDrawerContent>
        </NDrawer>
      </>
    )
  }
})
