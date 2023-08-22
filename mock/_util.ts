// Interface data format used to return a unified format
// http://mockjs.com/examples.html#String
import { Result, Page } from '@/utils/http/axios'
import { HttpStatus } from '@/enums/http'
import type { MockMethod } from 'vite-plugin-mock'
import { isFunction } from 'lodash-es'

const defaultSucMessage = '操作成功'

const defaultFailMessage = '操作失败'

const PREFIX = process.env.VITE_BASE_API_PREFIX ?? ''

/**
 *
 * @param data 后端返回
 * @param states 返回状态
 * @returns
 */
export function result<T = RecordAble>(data: T, { message = defaultSucMessage, status = HttpStatus.SUCCESS } = {}): Result<T> {
  return {
    status,
    data,
    message
  }
}

/**
 * 成功
 * @param fn 数据
 * @returns
 */
export function suc<T = RecordAble>(fn: () => T): Result<T>
/**
 * 成功
 * @param data 数据
 * @returns
 */
export function suc<T = RecordAble>(data: T): Result<T>

/**
 * 成功
 * @param data 数据
 * @returns
 */
export function suc<T = RecordAble>(data: T | (() => T)) {
  return result(isFunction(data) ? data() : data)
}

/**
 * 失败
 * @param fn 数据
 * @returns
 */
export function fail<T = RecordAble>(fn: () => T): Result<T>
/**
 * 失败
 * @param data 数据
 * @returns
 */
export function fail<T = RecordAble>(data: T): Result<T>
/**
 * 失败
 * @param data 数据
 * @returns
 */
export function fail<T = RecordAble>(data: T) {
  return result(isFunction(data) ? data() : data, {
    message: defaultFailMessage,
    status: HttpStatus.SUCCESS
  })
}

/**
 * 分页结果
 * @param current  第几页
 * @param pageSize  每页大小
 * @param array 总数据
 * @returns
 */
export function pages<T = RecordAble>(array: Array<T>, current = 1, pageSize = 10) {
  const datas = pagination(current, pageSize, array)
  const total = array.length
  const tmp = parseInt(total / pageSize)
  const moreTmp = tmp + 1
  const pages = total % pageSize === 0 ? tmp : moreTmp
  const data: Page<T> = {
    records: datas,
    // 当前第几页
    current,
    // 每页大小
    pageSize,
    // 总页数
    pages,
    // 总数据量
    total
  }
  return suc(data)
}

/**
 * 计算分页结果
 * @param current  第几页
 * @param pageSize  每页大小
 * @param array 总数据
 * @returns
 */
export function pagination<T = RecordAble>(current: number, pageSize: number, array: T[]): T[] {
  const offset = (current - 1) * Number(pageSize)
  const ret = offset + Number(pageSize) >= array.length ? array.slice(offset, array.length) : array.slice(offset, offset + Number(pageSize))
  return ret
}

export interface requestParams {
  method: string
  body: unknown
  headers?: { authorization?: string }
  query: unknown
}

/**
 * @description 本函数用于从request数据中获取token，请根据项目的实际情况修改
 *
 */
export function getRequestToken({ headers }: requestParams): string | undefined {
  return headers?.authorization
}

/**
 * 返回mock数据集
 * @param mocks 模拟数据
 */
export function defineMockData(mocks: MockMethod[]): MockMethod[] {
  return mocks.map((item) => {
    const mock = {
      ...item,
      url: PREFIX + (item.url.startsWith('/') ? item.url : '/' + item.url)
    }
    return mock
  })
}
