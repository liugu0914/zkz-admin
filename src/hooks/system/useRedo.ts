import { ref, nextTick } from 'vue'

const alive = ref(true)

const loading = ref(false)

export const useRedo = () => {
  const load = () => {
    alive.value = false
    loading.value = true
    nextTick(() => {
      alive.value = true
      setTimeout(() => {
        loading.value = false
      }, 1000)
    })
  }

  /**
   * 刷新页面
   */
  const reflesh = () => {
    if (loading.value) {
      return
    }
    load()
  }

  return { alive, loading, reflesh }
}
