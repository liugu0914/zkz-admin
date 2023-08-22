import { DataTableBaseColumn, DataTableSelectionColumn, DataTableExpandColumn, PaginationProps, dataTableProps } from 'naive-ui'
import { ExtractPublicPropTypes, PropType, VNodeChild } from 'vue'

/**
 * 表格 props
 */
export const baseTableProps = {
  ...dataTableProps,

  // 自定义的字段列表
  columns: {
    type: Array as PropType<TableColumn[]>,
    require: true
  },
  pagination: {
    type: [Boolean, Object] as PropType<false | ZkzPageProps>,
    default: false
  },
  // 是否显示头部
  showHeader: {
    type: Boolean,
    default: () => true
  },
  // 是否显示搜索
  showSearch: {
    type: Boolean,
    default: () => true
  },
  //  搜索
  onSearch: {
    type: Function as PropType<(values: RecordAble<any>) => void>
  },
  // 重置
  onReset: {
    type: Function as PropType<(values: RecordAble<any>) => void>
  },
  // 分页变化
  onPageChange: {
    type: Function as PropType<(current: number, pageSize: number) => void>
  },
  // 是否显示设置
  showSetting: {
    type: Boolean,
    default: () => true
  },
  // 是否显示序号
  showOrder: {
    type: Boolean,
    default: () => false
  },
  // 是否显示序号
  orderConfig: {
    type: Object as PropType<Partial<TableColumn>>,
    default: () => ({})
  },
  // 选择配置
  selectConfig: {
    type: Object as PropType<Omit<DataTableSelectionColumn, 'type'>>,
    default: () => ({})
  }
}

export type BaseTableProps = ExtractPublicPropTypes<typeof baseTableProps>

export type SearchType =
  | 'input'
  | 'number'
  | 'select'
  | 'tree'
  | 'swith'
  | 'checkbox'
  | 'radio'
  | 'time'
  | 'date'
  | 'year'
  | 'quarter'
  | 'month'
  | 'custom' // 自定义

export type SearchOption = {
  label: string
  value: Key
  children?: SearchOptions
}

export type SearchOptions = Array<SearchOption>

interface SearchOuter {
  // 字段标识
  name?: string
  // 标题
  title?: string
  type?: SearchType
  disabled?: true
  // select tree etc.
  options?: (() => Promise<SearchOptions | any[]>) | SearchOptions | any[]
  multiple?: true
  // date time
  range?: true
  format?: string
  // 自定义 内容
  custom?: (item: SearchColumn) => VNodeChild
}

export interface SearchColumn extends Omit<SearchOuter, 'name' | 'options'> {
  async?: () => Promise<SearchOptions> // 异步加载
  options?: SearchOptions // 列表内容
  name: string // 名称
  value: any // 值
}

interface TableColumnType<T = any> extends Omit<DataTableBaseColumn<T>, 'type'> {
  type?: DataTableSelectionColumn['type'] | DataTableExpandColumn['type']
  children?: Array<TableColumnType<T>>
  searchAble?: true
  search?: SearchOuter
  show?: boolean
}

export type TableColumnFinalType<T = any> = TableColumnType<T>

/**
 * PageProps 分页数据
 *
 */
// export type ZkzPageParams = {
//   current?: number // 当前页
//   pageSize?: number // 每页带线啊哦
//   pages?: number // 总页数
//   total?: number // 总条数
// }

export type ZkzPageProps = PageParamProp & Omit<PaginationProps, 'page' | 'pageSize' | 'pageCount' | 'itemCount'>
