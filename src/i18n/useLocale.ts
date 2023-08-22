import { NLocale, NDateLocale } from 'naive-ui'

import { i18n } from './index'
import { useLocaleStoreWithOut } from '@/store/modules/locale'
import { unref, computed, Ref } from 'vue'
import { loadLocalePool, setHtmlPageLang } from './helper'
import { useNaive } from '@/hooks/setting/useNaive'

interface LangModule {
  message: any
  dateLocale: RecordAble
  dateLocaleName: string
}

function setI18nLanguage(locale: LocaleType) {
  const localeStore = useLocaleStoreWithOut()

  ;(i18n.global.locale as unknown as Ref<LocaleType>).value = locale

  localeStore.setLocale(locale)
  setHtmlPageLang(locale)
}

export function useLocale() {
  const localeStore = useLocaleStoreWithOut()
  const nLocale = computed(() => {
    const localeMsg = i18n.global.getLocaleMessage(localeStore.getLocale) as any
    const data = {
      locale: localeMsg.nLocale as NLocale,
      dateLocale: localeMsg.ndateLocale as NDateLocale
    }
    return data
  })

  // Switching the language will change the locale of useI18n
  // And submit to configuration modification
  async function changeLocale(locale: LocaleType) {
    const { message } = useNaive()
    const globalI18n = i18n.global

    const currentLocale = unref(globalI18n.locale)
    if (currentLocale === locale) {
      return locale
    }
    const loading = message.loading(globalI18n.t('layout.header.changing'), { duration: 0 })

    setTimeout(async () => {
      if (!loadLocalePool.includes(locale)) {
        const langModule = ((await import(`./lang/${locale}.ts`)) as any).default as LangModule
        if (!langModule) {
          return
        }
        const { message } = langModule

        globalI18n.setLocaleMessage(locale, message)
        loadLocalePool.push(locale)
      }

      setI18nLanguage(locale)
      loading.destroy()
      message.success(globalI18n.t('layout.header.changeI18nSuc'))
    }, 1000)
    // nextTick(() => {
    //   window.location.reload()
    // })
    return locale
  }

  return {
    locale: localeStore.getLocale,
    nLocale,
    changeLocale
  }
}
