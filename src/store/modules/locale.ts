import { defineStore } from 'pinia'
import { store } from '@/store'
import { LOCALE } from '@/enums/locale'
import { Storage } from '@/utils/Storage'

interface LocaleState {
  locale: LocaleType
}

export const useLocaleStore = defineStore({
  id: 'locale',
  state: (): LocaleState => ({
    locale: Storage.get(import.meta.env.VITE_LOCALE_KEY, LOCALE.ZH_CN)
  }),
  getters: {
    getLocale(): LocaleType {
      return this.locale ?? LOCALE.ZH_CN
    }
  },
  actions: {
    setLocale(locale: LocaleType) {
      this.locale = locale
      Storage.set(import.meta.env.VITE_LOCALE_KEY, locale, null)
    }
  }
})

// Need to be used outside the setup
export function useLocaleStoreWithOut() {
  return useLocaleStore(store)
}
