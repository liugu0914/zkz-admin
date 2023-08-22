/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ThemeType } from '@/enums/settings'
import { FormRules } from 'naive-ui'
import type { TableColumnFinalType, ZkzPageProps } from '@/components/table/TableProps'
import { MaybeRef } from 'vue'
import { Page } from '@/utils/http/axios'

declare global {
  declare type Key = string | number

  /**
   * 主体数据字段
   */
  declare interface Base {
    // 主键ID
    id: Key
    // 组织ID
    organizationId?: Key
    // 创建时间
    createTime?: string
    // 更新时间
    updateTime?: string

    [key: string]: any
  }

  /**
   * 文件
   */
  declare interface FileResult extends Base {
    // 文件地址
    url: string
    // 文件名称
    fileName: string
    // 文件大写
    size: string
    // md5
    md5: string
    // 文件类型
    type: string
  }

  /**
   * 用户
   */
  declare interface User extends Base {
    imgUrl: string
    userName: string
    account: string
    idCard: string
    phone: string
    deptName: string
    deptId: string
    email: string
    userType: string
    enable: number
  }

  /**
   * 组织
   */
  declare interface Organization extends Base {
    alias: string
    name: string
    des: string
  }

  /**
   * 应用
   */
  declare interface App extends Base {
    name: string
    des: string
    enable: number
  }

  /**
   * 菜单
   */
  declare interface Menu extends Base {
    name: string
    orderNum?: number
    router?: string
    parent?: number
    superId: Key
    path?: string
    isLink?: boolean
    isInner?: boolean
    url?: string
    icon?: string
    children?: Menu[]
    appId?: Key
    enable?: number
    disabled?: boolean
    [key: string]: any
  }

  /**
   * 角色
   */
  declare interface Role extends Base {
    name: string
    des: string
    superId: Key
    orderNum: number
    enable: number
  }

  /**
   * 用户state
   */
  declare interface UserState {
    user: User | undefined
    token: string | undefined
    organization: Organization | undefined
    permissions: string[] | undefined
    roles: Role[] | Role | undefined
    menus: Menu[] | undefined
  }

  /**
   * 主题颜色 同ant
   */
  declare type ThemeColor =
    | 'red'
    | 'volcano'
    | 'orange'
    | 'yellow'
    | 'lime'
    | 'green'
    | 'cyan'
    | 'blue'
    | 'geekblue'
    | 'purple'
    | 'magenta'
    | 'grey'
  /**
   * 动画效果
   */
  declare type AnimateType = 'zoom-fade' | 'zoom-out' | 'fade-slide' | 'fade' | 'fade-bottom' | 'fade-scale'

  declare type LocaleType = 'zh-CN' | 'en-US'

  type ZkzVarsValueType = string | number
  type ZkzVarsType = {
    '--zkz-color': string
    '--zkz-padding': ZkzVarsValueType
    '--zkz-radius': ZkzVarsValueType
    '--zkz-header-height': ZkzVarsValueType
    '--zkz-header-z-index': number
    '--zkz-tabs-height': ZkzVarsValueType
    '--zkz-tabs-z-index': number
    '--zkz-footer-height': ZkzVarsValueType
    '--zkz-footer-z-index': number

    '--zkz-sider-width': ZkzVarsValueType
    '--zkz-sider-collapsed-icon-size': number
    '--zkz-sider-collapsed-width-number': number
    '--zkz-sider-collapsed-width': ZkzVarsValueType
    '--zkz-sider-mix-width': ZkzVarsValueType
    '--zkz-sider-mix-sub-width': ZkzVarsValueType
    '--zkz-sider-mix-collapsed-width-number': number
    '--zkz-sider-mix-collapsed-width': ZkzVarsValueType
    '--zkz-sider-z-index': number
  } & RecordAble<string | number>

  /**
   * 设置state
   */
  declare interface Settings {
    collapsed: boolean
    showExtra: boolean
    theme: ThemeType
    animate: AnimateType | undefined
    color: string
    mode: 'inner' | 'outer' | 'top' | 'mix'
    shadow: boolean
    compact: boolean
    isRound: boolean
    vars: ZkzVarsType
    sideDark: boolean
    gray: boolean
    weak: boolean
    showTabs: boolean
    showFooter: boolean
    showWatermark: boolean
    watermarkContent: string
  }

  /**
   * Column类型
   *
   */
  declare type TableColumn<T = any> = TableColumnFinalType<T>

  /**
   * Column类型
   *
   */
  declare type TableColumns<T = any> = Array<TableColumn<T>>

  /**
   * pagination 类型
   *
   */
  declare type PageProps = ZkzPageProps

  /**
   * pagination 类型
   *
   */
  declare type PageParamProp = Omit<Partial<Page>, 'records'>

  /**
   * talbe需求的参数
   * T ： 表单详情数据
   * B : 是否使用dataForm
   * C : 是否使用params
   */
  declare type PageData<T = any, B extends boolean = false, C extends boolean = true> = isDataForm<T, B> &
    RecordAble<any> &
    BasePage<T> &
    isPageParams<C>

  declare type BasePage<T = any> = {
    dataSource?: T[]
    columns?: SearchColumn[]
    selectedRows?: Key[]
    loading?: boolean

    rules?: MaybeRef<FormRules>
    title?: string
    visible?: boolean
    sureLoading?: boolean
  }

  type isPageParams<B> = B extends true ? PageParams : Partial<PageParams>

  type PageParams = {
    params: {
      page?: {
        current?: number
        pageSize?: number
        pages?: number
        total?: number
      }
      query?: RecordAble
      [T: string]: RecordAble
    }
  }

  type isDataForm<T = any, B extends boolean = false> = B extends true ? DataForm<T> : Partial<DataForm<T>>

  type DataForm<T = any> = {
    dataForm: Partial<T> & RecordAble<any>
  }

  type TreeNode = {
    children?: Array<TreeNode>
    [key: string]: any
  }
}
