<template>
  <SettingItem :title="t('layout.setting.theme')">
    <ImgCheckboxGroup :default-value="theme" @change="changeTheme">
      <ImgCheckbox
        img-src="//gw.alipayobjects.com/zos/rmsportal/jpRkZQMyYRryryPNtyIC.svg"
        :title="t('layout.setting.light')"
        value="light" />
      <ImgCheckbox
        img-src="//gw.alipayobjects.com/zos/antfincdn/hmKaLQvmY2/LCkqqYNmvBEbokSDscrm.svg"
        :title="t('layout.setting.dark')"
        value="dark" />
    </ImgCheckboxGroup>
  </SettingItem>
  <SettingItem :title="t('layout.setting.themeColor')">
    <ColorCheckboxGroup v-model:color="color">
      <ColorCheckbox v-for="colorItem in themeColors" :color="colorItem.color" />
    </ColorCheckboxGroup>
  </SettingItem>
  <SettingItem>
    <NColorPicker v-model:value="defColor" :default-value="color" @complete="colorChange" />
  </SettingItem>
  <SettingItem :title="t('layout.setting.menuStyle')">
    <NRadioGroup v-model:value="mode">
      <NRadioButton value="inner">{{ t('layout.setting.inner') }}</NRadioButton>
      <NRadioButton value="outer">{{ t('layout.setting.outer') }}</NRadioButton>
      <NRadioButton value="top">{{ t('layout.setting.top') }}</NRadioButton>
      <NRadioButton value="mix">{{ t('layout.setting.mix') }}</NRadioButton>
    </NRadioGroup>
  </SettingItem>
  <SettingItem :title="t('layout.setting.boxStyle')">
    <NList :show-divider="false">
      <NListItem>
        <span>{{ t('layout.setting.sideDark') }}</span>
        <template #suffix>
          <NSwitch v-model:value="sideDark" />
        </template>
      </NListItem>
      <NListItem>
        <span>{{ t('layout.setting.compact') }}</span>
        <template #suffix>
          <NSwitch v-model:value="compact" />
        </template>
      </NListItem>
      <NListItem>
        <span>{{ t('layout.setting.rounded') }}</span>
        <template #suffix>
          <NSwitch v-model:value="isRound" />
        </template>
      </NListItem>
      <NListItem>
        <span>{{ t('layout.setting.shadow') }}</span>
        <template #suffix>
          <NSwitch v-model:value="shadow" />
        </template>
      </NListItem>
    </NList>
  </SettingItem>
  <NDivider />
  <SettingItem :title="t('layout.setting.feature')">
    <NList :show-divider="false">
      <NListItem>
        <span>{{ t('layout.setting.menuTabs') }}</span>
        <template #suffix>
          <NSwitch v-model:value="showTabs" />
        </template>
      </NListItem>
      <NListItem>
        <span>{{ t('layout.setting.footer') }}</span>
        <template #suffix>
          <NSwitch v-model:value="showFooter" />
        </template>
      </NListItem>
    </NList>
  </SettingItem>
  <NDivider />
  <SettingItem :title="t('layout.setting.other')">
    <NList :show-divider="false">
      <NListItem>
        <span>{{ t('layout.setting.animate') }}</span>
        <template #suffix>
          <NSelect v-model:value="animate" class="!w-[100px]" :options="animateOptions" />
        </template>
      </NListItem>
      <NListItem>
        <span>{{ t('layout.setting.watermark') }}</span>
        <template #suffix>
          <NSwitch v-model:value="showWatermark" :checked-value="true" :unchecked-value="false" />
        </template>
      </NListItem>
      <NListItem>
        <span>{{ t('layout.setting.grayMode') }}</span>
        <template #suffix>
          <NSwitch :value="gray" @update:value="(checked) => changeClass(checked, 'gray-mode')" />
        </template>
      </NListItem>
      <NListItem>
        <span>{{ t('layout.setting.colorWeak') }}</span>
        <template #suffix>
          <NSwitch :value="weak" @update:value="(checked) => changeClass(checked, 'color-weak')" />
        </template>
      </NListItem>
    </NList>
  </SettingItem>
</template>

<script lang="ts" setup>
  import SettingItem from './settingItem.vue'
  import { useI18n } from 'vue-i18n'
  import { ImgCheckbox, ImgCheckboxGroup } from '@/components/checkbox/ImgCheckbox'
  import { ColorCheckbox, ColorCheckboxGroup } from '@/components/checkbox/ColorCheckbox'
  import { useSettings } from '@/hooks/setting/useSettings'
  import { changeClassName } from '@/utils/domUtils'
  import { useColor } from '@/hooks/setting/useColor'
  import { ThemeType, animateLabels } from '@/enums/settings'
  import { computed, ref, watch } from 'vue'

  const { t } = useI18n()

  // 整体风格 主题切换
  const { theme, color, mode, compact, isRound, shadow, showTabs, animate, sideDark, showFooter, gray, weak, showWatermark } = useSettings()

  const { themeColors } = useColor()

  const changeTheme = (value: ThemeType) => {
    theme.value = value
  }

  const defColor = ref(color.value)

  const colorChange = (value: string) => {
    color.value = value
  }
  watch(color, (value) => {
    defColor.value = value
  })

  const changeClass = (checked: boolean, className: string) => {
    if (className === 'gray-mode') {
      gray.value = checked
    } else {
      weak.value = checked
    }
    changeClassName(className, checked)
  }

  const animateOptions = computed(() => {
    const data: { label: string; value?: string }[] = []
    data.push({ label: t('layout.setting.disabled') })
    Object.keys(animateLabels).map((key) => {
      data.push({ label: animateLabels[key], value: key })
    })
    return data
  })
</script>
