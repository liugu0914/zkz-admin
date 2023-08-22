/* eslint-disable no-redeclare */

import { isObject, isString } from 'lodash-es'

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'

export function joinTimestamp(join: boolean): RecordAble<number> {
  if (!join) {
    return {}
  }
  const now = new Date().getTime()
  return { _t: now }
}

/**
 * @description: Format request parameter time
 */
export function formatRequestDate(params: RecordAble) {
  if (Object.prototype.toString.call(params) !== '[object Object]') {
    return
  }

  for (const key in params) {
    const paramKeyData = params[key] as RecordAble
    const format = paramKeyData?.format ?? null
    if (format && typeof format === 'function') {
      params[key] = format(DATE_TIME_FORMAT)
    }
    if (isString(key) && params[key]) {
      const value = params[key]
      try {
        params[key] = isString(value) ? value.trim() : value
      } catch (error: unknown) {
        throw new Error(error as string)
      }
    }
    if (isObject(params[key])) {
      formatRequestDate(paramKeyData)
    }
  }
}
