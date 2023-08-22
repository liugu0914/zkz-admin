import type { AxiosError, AxiosResponse } from 'axios'
import qs from 'qs'
import { ContentType, HttpStatus, Request } from '@/enums/http'
import { Encrypt } from '@/utils/crypto'
import { parseUrlParams } from '@/utils/base'
// import { Storage } from '@/utils/Storage'
import { joinTimestamp } from './helper'
import { useAccout } from '@/hooks/accout/useAccout'
import type { Result, CreateAxiosOptions } from './type'
import { router } from '@/router/index'
import { useNaive } from '@/hooks/setting/useNaive'
import { useI18n } from '@/hooks/locale/useI18n'
import { isEmpty, isObject } from 'lodash-es'

export type requestInterceptors = {
  onFulfilled: (config: CreateAxiosOptions, options: CreateAxiosOptions) => CreateAxiosOptions
  onRejected?: (error: AxiosError<Result>, options?: CreateAxiosOptions) => Promise<AxiosError<Result>>
}

export type responseInterceptors = {
  onFulfilled?: (response: AxiosResponse<Result>, options?: CreateAxiosOptions) => AxiosResponse | Promise<AxiosResponse>
  onRejected?: (error: AxiosError<Result>, options?: CreateAxiosOptions) => Promise<AxiosError<Result>>
}

export type Interceptors = {
  request: Array<requestInterceptors>
  response: Array<responseInterceptors>
}

const { message } = useNaive()

const reqAuthorization: requestInterceptors = {
  /**
   * 发送请求之前做些什么
   * @param config axios config
   * @param options
   * @returns {AxiosRequestConfig}
   */
  onFulfilled(config, options) {
    // 请求之前处理config
    const token = useAccout().getToken.value
    const { Authorization = import.meta.env.VITE_AUTHORIZATION_KEY } = options
    if (config?.headers) {
      const authorizationValue = config?.headers[Authorization]?.toString()
      if (authorizationValue && authorizationValue.startsWith('Basic')) {
        // 登录Basic 认证
        return config
      }
      if (token) {
        // jwt token
        config.headers[Authorization] = token
      }
    }
    return config
  }
}

// 请求前
const reqCommon: requestInterceptors = {
  /**
   * 发送请求之前做些什么
   * @param config axios config
   * @param options
   * @returns {AxiosRequestConfig}
   */
  onFulfilled(config) {
    const { requestOptions = {} } = config
    const { joinTime, isEncrypted } = requestOptions
    let params = config.params

    const urlParams = parseUrlParams(config.url)
    config.url = config.url && config.url.split('?')[0]
    params = { ...urlParams, ...params }
    if (isEncrypted && !isEmpty(params)) {
      params = Encrypt(params)
      config.params = { params }
    }
    if (config.method?.toUpperCase() === Request.GET) {
      // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
      config.params = { ...config.params, ...joinTimestamp(!!joinTime) }
      return config
    }
    const headers = config.headers
    const contentType = headers?.['Content-Type']

    if (isEncrypted && !isEmpty(config.data)) {
      config.data = {
        data: Encrypt(config.data)
      }
    }

    if (config.data && contentType === ContentType.FORM_URLENCODED) {
      config.data = qs.stringify(config.data, { arrayFormat: 'brackets' })
    }
    return config
  }
}

/**
 *  401处理 登录失效
 */
const resp401: responseInterceptors = {
  /**
   *  响应数据之前做点什么
   * @param error 响应对象
   * @returns {*}
   */
  onRejected(error) {
    if (!error) {
      return Promise.reject(error)
    }
    const { response } = error
    if (response && response.status === HttpStatus.UNAUTHORIZATION) {
      const { t } = useI18n()
      let msg = t('system.ex401')
      if (response.data && response.data.message) {
        msg = response.data.message
      }
      router.push('/login')
      message.warning(msg)
      return Promise.reject(false)
    }
    return Promise.reject(error)
  }
}

/**
 * 500 处理 服务内部错误
 */
const resp500: responseInterceptors = {
  /**
   *  响应数据之前做点什么
   * @param error 响应对象
   * @param options 应用配置 包含: {router, i18n, store, message}
   * @returns {Promise}
   */
  onRejected(error) {
    if (!error) {
      return Promise.reject(error)
    }
    const { response } = error
    if (response && response.status === HttpStatus.ERROR) {
      const { t } = useI18n()
      let msg = t('system.ex500')
      if (response.data && response.data.message) {
        msg = response.data.message
      }
      message.error(msg)
      return Promise.reject(false)
    }
    return Promise.reject(error)
  }
}

// 公共响应拦截
const respCommon: responseInterceptors = {
  /**
   * 响应数据之前做点什么
   * @param response 响应对象
   * @returns {Promise}
   */
  onFulfilled(response) {
    const { t } = useI18n()
    const DefaultMsg = t('system.err')
    const data = response.data
    if (isObject(data) && data.status === HttpStatus.SUCCESS) {
      return response
    }
    const msg = data.message || DefaultMsg
    message.error(msg)
    return Promise.reject(response)
  },
  /**
   * 容错处理
   * 响应出错时执行
   * @param error 错误对象
   * @returns {Promise}
   */
  onRejected(error) {
    if (!error) {
      return Promise.reject(error)
    }
    const { response, code } = error
    const { t } = useI18n()
    if (response) {
      let msg = t('system.err')
      if (response && response.data && response.data.message) {
        msg = response.data.message
      }
      message.error(msg)
    } else if (code === 'ECONNABORTED') {
      message.error(t('system.netError'))
    } else {
      message.error(t('system.unknown'))
    }
    return Promise.reject(error)
  }
}

/**
 * 洋葱圈模式
 */
export default {
  request: [reqCommon, reqAuthorization], // 请求拦截
  response: [resp401, resp500, respCommon] // 响应拦截
} as Interceptors
