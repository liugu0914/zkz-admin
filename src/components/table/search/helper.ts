// import { DataTableBaseColumn } from 'naive-ui'
import type { SearchColumn } from '../tableProps'
import { isFunction } from 'lodash-es'

export const getSearchAbleColumns = (columns: TableColumns, arr: SearchColumn[] = []) => {
  columns.forEach((item) => {
    if (item.children && item.children.length > 0) {
      getSearchAbleColumns(item.children, arr)
    } else if (item.searchAble) {
      const search = item.search || {}
      const searchOption = (item.search || {}) as SearchColumn
      if (search.options) {
        if (isFunction(search.options)) {
          searchOption.async = search.options
          searchOption.options = undefined
        } else {
          searchOption.options = searchOption.options || []
        }
      }
      // if (isDateType(searchOption.type) && !searchOption.format) {
      //   searchOption.format = getDefaultFormat(searchOption.type)
      // }
      searchOption.title = searchOption.title ? searchOption.title : isFunction(item.title) ? '' : item.title
      searchOption.name = searchOption.name ? searchOption.name : (item.key as string)
      searchOption.value = undefined
      arr.push(searchOption)
    }
  })
  return arr
}

/**
 * 判断是否为时间类型
 * @param type 搜索类型
 * @returns
 */
export const isDateType = (type: SearchColumn['type']) => {
  switch (type) {
    case 'time':
    case 'date':
    case 'year':
    case 'quarter':
    case 'month':
      return true
    default:
      return false
  }
}

/**
 * 判断是否为DatePicker
 * @param type 搜索类型
 * @returns
 */
export const isDatePicker = (type: SearchColumn['type']) => {
  switch (type) {
    case 'date':
    case 'year':
    case 'quarter':
    case 'month':
      return true
    default:
      return false
  }
}

/**
 * 判断是否为时间类型
 * @param type 搜索类型
 * @returns
 */
export const getDefaultFormat = (type: SearchColumn['type']) => {
  let format: string | undefined = undefined
  switch (type) {
    case 'time':
      format = 'HH:mm:ss'
      break
    case 'date':
      format = 'yyyy-MM-dd'
      break
    case 'year':
      format = 'yyyy'
      break
    case 'quarter':
      format = 'yyyy-Q'
      break
    case 'month':
      format = 'yyyy-MM'
      break
    default:
      format = 'yyyy-MM-dd'
  }
  return format
}
