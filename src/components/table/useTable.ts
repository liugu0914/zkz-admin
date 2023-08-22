import { DataTableProps, PaginationProps } from 'naive-ui'
import { Ref, computed } from 'vue'
import { useI18n } from '@/hooks/locale/useI18n'
import { call } from '@/utils/base'
import type { BaseTableProps } from './tableProps'
import { cloneDeep } from 'lodash-es'

const { t } = useI18n()

export const useTable = (props: BaseTableProps, slots: any) => {
  const slotKeys = Object.keys(slots)

  /**
   * 分页配置
   */
  const initPagination = computed(() => {
    const pagination = props.pagination

    if (pagination === null || pagination === undefined) {
      return false
    }
    if (typeof pagination === 'boolean') {
      return pagination
    }
    const onUpdatePageFn = props.onUpdatePage || props['onUpdate:page']

    const onUpdatePageSizeFn = props.onUpdatePageSize || props['onUpdate:pageSize']

    const onUpdatePage = (page: number) => {
      if (onUpdatePageFn) {
        call(onUpdatePageFn, pageSize)
      }
      if (props.onPageChange) {
        call(props.onPageChange, page, pagination.pageSize)
      }
    }

    const onUpdatePageSize = (pageSize: number) => {
      if (onUpdatePageSizeFn) {
        call(onUpdatePageSizeFn, pageSize)
      }
      if (props.onPageChange) {
        call(props.onPageChange, 1, pageSize)
      }
    }
    const { current, pageSize, total = 0, ...pageData } = pagination

    const pageProps: PaginationProps = {
      showSizePicker: true,
      page: current, // 当前页
      pageSizes: [10, 20, 30, 40, 50, 100], // 每页条数
      pageSize, // 每页分页大小
      itemCount: total, // 总条数
      // disabled: false,
      onUpdatePage,
      onUpdatePageSize,
      prefix: () => t('component.table.total', { total })
    }

    const paginationData = { ...pageData, ...pageProps }

    return paginationData
  })

  /**
   * 是否可选
   */
  const selection = computed(() => {
    if (!props.columns || !Array.isArray(props.columns)) {
      return []
    }
    const index = props.columns.findIndex((item) => item.type === 'selection')

    const selectOptionProp = index >= 0 ? props.columns[index] : {}

    const selectOption = {
      type: 'selection',
      ...props.selectConfig,
      ...selectOptionProp
    } as TableColumn
    return props.checkedRowKeys ? [selectOption] : []
  })

  /**
   * 显示顺序号
   */
  const indexOrder = computed<TableColumn>(() => {
    return {
      title: t('component.table.index'),
      key: '_index_',
      width: 80,
      ...props.orderConfig,
      render: (rowData, rowIndex) => {
        const tmp =
          initPagination.value && initPagination.value.page && initPagination.value.pageSize
            ? (initPagination.value.page - 1) * initPagination.value.pageSize
            : 0
        return tmp + rowIndex + 1
      }
    }
  })

  /**
   * 最终 columns
   */
  const columns = computed(() => {
    if (!props.columns || !Array.isArray(props.columns)) {
      return undefined
    }
    // 深复制
    let fColumns = cloneDeep(props.columns?.filter((item) => item.show !== false)) as TableColumns

    const columnSlots = (cols: TableColumns) => {
      cols.forEach((item) => {
        if (item.children && item.children.length > 0) {
          columnSlots(item.children)
        } else if (slotKeys.includes(`${item.key}`) && !item.render) {
          item.render = (row, index) => slots[item.key]({ row, text: row[item.key], index, column: item })
        }
      })
    }

    columnSlots(fColumns)

    if (props.showOrder) {
      fColumns = [indexOrder.value, ...fColumns]
    }

    return [...selection.value, ...fColumns]
  })

  const getRowKey = () => {
    return props.rowKey ? props.rowKey : (data) => data.id
  }

  const tableAttrs = computed(() => {
    return {
      ...props,
      onPageChange: undefined, // 清空table 上的 onPageChange
      bordered: props.bordered !== undefined ? props.bordered : false,
      singleLine: props.singleLine !== undefined ? props.singleLine : true,
      loading: false,
      rowKey: getRowKey(),
      remote: true, // 表单异步 分页
      pagination: initPagination.value,
      columns: columns.value
    } as DataTableProps
  })

  return tableAttrs
}

/**
 * 返回 select 相关数据
 * @param emit 自定义事件
 * @param selectedRows props中的selectedRows
 */
export const useSelectRows = (props: BaseTableProps) => {
  const checkedRowKeys: BaseTableProps['checkedRowKeys'] = props.checkedRowKeys
  const onUpdateCheckedRowKeys: BaseTableProps['onUpdate:checkedRowKeys'] = props['onUpdate:checkedRowKeys']

  const hasSelect = computed(() => {
    return checkedRowKeys && Array.isArray(checkedRowKeys)
  })

  const clearSelectRows = () => {
    if (hasSelect.value && onUpdateCheckedRowKeys) {
      call(onUpdateCheckedRowKeys, [], 'uncheck')
    }
  }
  return {
    hasSelect,
    // selectedRows,
    clearSelectRows
  }
}

/**
 *
 *  动态获取table高度
 * @param tableRef 表单
 * @param headerRef 头部
 */
export const getTableFlexHeight = (tableRef: Ref<any>, headerRef: Ref<HTMLElement>) => {
  const tableDom = tableRef.value.$el as HTMLElement
  const headerDom = headerRef.value as HTMLElement
  const content = tableDom.parentElement

  const data = { heigth: undefined, width: undefined } as { heigth: number | undefined; width: number | undefined }

  if (!content) {
    return data
  }

  const style = window.getComputedStyle(content)
  const top = parseFloat(style.getPropertyValue('padding-top'))
  const left = parseFloat(style.getPropertyValue('padding-left'))
  const bottom = parseFloat(style.getPropertyValue('padding-bottom'))
  const right = parseFloat(style.getPropertyValue('padding-right'))

  const width = content.clientWidth - left - right

  const heigth = content.clientHeight - top - bottom

  const headerHeight = headerDom ? headerDom.offsetHeight || 0 : 0

  const finalHeight = heigth - headerHeight
  data.heigth = finalHeight
  data.width = width
  return data
}
