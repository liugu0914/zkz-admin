<template>
  <NLayoutHeader class="zkz-header zkz-layout-shadow">
    <NRow class="h-full">
      <NCol :span="24">
        <div class="header__actions justify-between">
          <div class="header__actions">
            <div v-if="showHeaderLog" class="header__logo">
              <NIcon :color="color" size="30">
                <SvgIcon name="logo" />
              </NIcon>
              <span v-if="!collapsed" class="font-bold ml-2 text-2xl">{{ appName }}</span>
            </div>
            <div class="actions__item--wm header__actions__item" @click="changeCollapsed">
              <MenuUnfoldOutlined v-if="collapsed" class="text-[1rem]" />
              <MenuFoldOutlined v-else class="text-[1rem]" />
            </div>
          </div>
          <div v-if="showHeaderMenu" class="grow header__actions overflow-hidden px-[10px]">
            <HeaderMenu />
          </div>
          <div class="header__actions">
            <Info />
          </div>
        </div>
      </NCol>
    </NRow>
  </NLayoutHeader>
</template>
<script lang="ts" setup>
  import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'
  import Info from './info'
  import HeaderMenu from '@/layout/menu/headerMenu.vue'
  import { useSettings } from '@/hooks/setting/useSettings'
  import { useThemeVars } from 'naive-ui'
  import SvgIcon from '@/components/svgIcon'
  import { computed } from 'vue'

  const appName = computed(() => import.meta.env.VITE_APP_NAME)

  const themeVars = useThemeVars()
  const { collapsed, showHeaderLog, showHeaderMenu, color } = useSettings()

  const changeCollapsed = () => {
    collapsed.value = !collapsed.value
  }
</script>
<style lang="postcss">
  .zkz-header {
    @apply p-0 m-0  h-full overflow-hidden transition-all duration-300;

    border-radius: var(--zkz-radius);

    .header__actions {
      @apply flex h-full;

      .header__actions__item {
        @apply flex items-center justify-center px-2 cursor-pointer;

        &.actions__item--wm {
          @apply px-4;
        }

        &:hover {
          background-color: v-bind('themeVars.hoverColor');
        }
      }
    }

    .header__logo {
      @apply h-full transition-all duration-300 flex items-center justify-center;

      width: var(--zkz-sider-width);
    }
  }
</style>
