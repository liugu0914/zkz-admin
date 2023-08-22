import { useStoreWithOut } from '@/store/modules/accout'
import { storeToRefs } from 'pinia'

export function useAccout() {
  const accout = storeToRefs(useStoreWithOut())
  return {
    ...accout
  }
}
