import { defineStore } from 'pinia'
import { store } from '@/store'

export type IconType = 'menu' | 'jojo'

interface Common {
  icon: IconData
}

export const useCommonStore = defineStore({
  id: 'common',
  state: (): Common => ({
    icon: {}
  }),
  getters: {
    getIcon(): Common['icon'] {
      return this.icon
    }
  },
  actions: {
    setIcon(icon: Common['icon']) {
      this.icon = icon
    }
  }
})

// Need to be used outside the setup
export function useCommonStoreWithOut() {
  return useCommonStore(store)
}
