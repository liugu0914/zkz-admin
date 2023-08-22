import { PropType } from 'vue'
import { SearchColumn } from '../tableProps'

/**
 * 高级搜索 props
 */
export const searchProps = {
  // 自定义的字段列表
  columns: {
    type: Array as PropType<SearchColumn[]>,
    require: true
  },
  onSearch: {
    type: Function
  },
  onReset: {
    type: Function
  }
}
