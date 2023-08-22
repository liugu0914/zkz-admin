import { ThemeType } from '@/enums/settings'
import { isArray } from 'lodash-es'

/**
 * 解析 url 中的参数
 * @param url
 * @returns params
 */
export function parseUrlParams(url: string | undefined): Record<string, string | number | boolean | undefined> {
  const params: Record<string, string | number | boolean | undefined> = {}
  if (!url || typeof url !== 'string' || url === '') {
    return params
  }
  const paramsStr = url.split('?')[1]
  if (!paramsStr) {
    return params
  }
  const paramsArr = paramsStr.replace(/&|=/g, ' ').split(' ')
  for (let i = 0; i < paramsArr.length / 2; i++) {
    const value = paramsArr[i * 2 + 1]
    params[paramsArr[i * 2]] = value === 'true' ? true : value === 'false' ? false : value
  }
  return params
}

/**
 * 找到第一个树节点
 * @param menus 菜单树
 * @param callback 回调函数
 * @returns menu
 */
export const getFirstAbleMenu = (menus: Menu[], callback?: (menu: Menu) => boolean): Menu | undefined => {
  if (!callback) {
    callback = (menu) => (menu.path && menu.router ? true : false)
  }
  if (!menus || menus.length === 0) {
    return undefined
  }
  for (let index = 0; index < menus.length; index++) {
    const item = menus[index]
    if (callback(item)) {
      return item
    }
    if (item.children && item.children.length > 0) {
      const result = getFirstAbleMenu(item.children, callback)
      if (result) {
        return result
      }
    }
  }
  return undefined
}

/**
 *  树节点处理
 * @param menus 菜单树
 * @param callback 回调函数
 * @returns menu
 */
export const doTree = (menus: TreeNode[], callback?: (menu: TreeNode) => void): TreeNode | undefined => {
  if (!menus || menus.length === 0) {
    return
  }
  for (let index = 0; index < menus.length; index++) {
    const item = menus[index]
    if (callback) {
      callback(item)
    }
    if (item.children && item.children.length > 0) {
      doTree(item.children, callback)
    }
  }
}

export function toTree<T = any>(datas: T[], replaceFields?: RecordAble<string>, removeFields?: string[]): T[]

export function toTree<T = any>(datas: T[], replaceFields?: RecordAble<string>, callback?: (data: T) => void): T[]

export function toTree<T = any>(datas: T[], replaceFields?: RecordAble<string>, callback?: ((data: T) => void) | string[]): T[]

/**
 * 递归树形结构数据做处理
 * @param {Array} datas 递归数据
 * @param {Object} replaceFields 替换datas 中的字段
 * @param {Array} callback 需要删除的字段 或执行函数
 */
export function toTree<T = any>(datas: T[], replaceFields?: RecordAble<string>, callback?: ((data: T) => void) | string[]): T[] {
  const DefaultKeys = {
    children: 'children',
    label: 'title',
    value: 'value',
    ...replaceFields
  }
  return datas.map((data) => {
    const item = {
      ...data,
      children: data[DefaultKeys.children]
    }
    Object.keys(DefaultKeys).forEach((key) => {
      item[key] = data[DefaultKeys[key]]
    })
    if (item.children && item.children.length > 0) {
      item.children = toTree(item.children, replaceFields, callback)
    }

    if (callback) {
      if (isArray<string>(callback)) {
        callback && callback.forEach((key) => delete item[key])
      } else {
        callback(item)
      }
    }
    return item
  })
}

/**
 * 组装分页器
 * @param page 分页数据
 * @returns ant 分页器
 */
export const boxPagination = (page: PageParams['params']['page']) => {
  if (!page) {
    return {}
  }
  const { current, pageSize, total } = page
  return { current, pageSize, total }
}

/**
 * 表单规则查找
 * @param rules 规则数据
 * @param name 参数名称
 * @returns rule 表单规则
 */
export const findFormRule = (rules: any, name: string) => {
  if (!rules) {
    return {}
  }
  const iconRule = rules[name]

  if (isArray(iconRule)) {
    return iconRule[0]
  }
  return iconRule
}

/**
 * 执行函数
 * @param funcs 函数/函数数组
 * @param args 参数
 */
export const call = (funcs: Function | Function[] | undefined, ...args: any[]) => {
  if (!funcs) {
    return
  }
  if (Array.isArray(funcs)) {
    funcs.forEach((func) => call(func, ...args))
  } else {
    return funcs(...args)
  }
}

/**
 *  判断颜色是亮色还是深色
 * @param color 颜色
 */
export const lightOrDark = (color): ThemeType => {
  let r, g, b

  // Check the format of the color, HEX or RGB?
  if (color.match(/^rgb/)) {
    // If HEX --> store the red, green, blue values in separate variables
    color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/)

    r = color[1]
    g = color[2]
    b = color[3]
  } else {
    // If RGB --> Convert it to HEX: http://gist.github.com/983661
    color = +('0x' + color.slice(1).replace(color.length < 5 && /./g, '$&$&'))

    r = color >> 16
    g = (color >> 8) & 255
    b = color & 255
  }

  // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
  const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b))

  // Using the HSP value, determine whether the color is light or dark 127.5
  if (hsp > 155.5) {
    return 'light'
  }
  return 'dark'
}
