import { Ref, ref } from 'vue'

export type TabOption = {
  key: Key
  icon?: string
  name: string // 名称
  routeName: string // 路由导航的name
  closeAble?: boolean // 是否可关闭
  multi?: boolean // 是否允许多个
  params?: any
  query?: any
}

export const useTabs = () => {
  const tabs: Ref<Array<TabOption>> = ref([]) // 标签池
  const activeKey = ref<Key>() // 当前标签

  return { tabs, activeKey }
}
