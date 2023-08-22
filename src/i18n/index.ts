import type { App } from 'vue'
import type { I18n, I18nOptions, Locale } from 'vue-i18n'
import { createI18n } from 'vue-i18n'
import { useLocaleStoreWithOut } from '@/store/modules/locale'
import { LOCALE } from '@/enums/locale'
import { setHtmlPageLang, setLoadLocalePool } from './helper'

export let i18n: I18n<{}, {}, {}, Locale, false>

async function createI18nOptions(): Promise<I18nOptions> {
  const localeStore = useLocaleStoreWithOut()
  const locale = localeStore.getLocale
  const defaultLocal = await import(`./lang/${locale}.ts`)
  const message = defaultLocal.default?.message ?? {}

  setHtmlPageLang(locale)
  setLoadLocalePool((loadLocalePool) => {
    if (!loadLocalePool.includes(locale)) {
      loadLocalePool.push(locale)
    }
  })

  return {
    legacy: false, // true is options Api  ,  false is composition Api
    locale,
    fallbackLocale: LOCALE.ZH_CN,
    messages: {
      [locale]: message
    },
    availableLocales: [LOCALE.ZH_CN, LOCALE.EN_US],
    sync: true, // If you don’t want to inherit locale from global scope, you need to set sync of i18n component option to false.
    silentTranslationWarn: true, // true - warning off
    missingWarn: false,
    silentFallbackWarn: true
  }
}

// setup i18n instance with glob
export async function setupI18n(app: App) {
  const options = await createI18nOptions()
  i18n = createI18n(options)
  app.use(i18n)
}
