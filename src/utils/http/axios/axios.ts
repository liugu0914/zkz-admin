import axios from 'axios'
import { cloneDeep, isFunction } from 'lodash-es'
import type { AxiosRequestConfig, AxiosError } from 'axios'
import type { CoverAxiosInstance, Result, UploadFileParams, CreateAxiosOptions } from './type'
import axiosInterceptors, { type Interceptors } from './axiosInterceptors'
import { Request, ContentType } from '@/enums/http'

/**
 * @description:  axios module
 */
export class OAxios {
  private axiosInstance: CoverAxiosInstance
  private readonly options: CreateAxiosOptions

  constructor(options: CreateAxiosOptions) {
    this.options = options
    this.axiosInstance = axios.create(options)
    this.setupInterceptors(axiosInterceptors)
  }

  /**
   * @description:  Create axios instance
   */
  private createAxios(config: CreateAxiosOptions): void {
    this.axiosInstance = axios.create(config)
  }

  getAxios(): CoverAxiosInstance {
    return this.axiosInstance
  }

  /**
   * @description: Reconfigure axios
   */
  configAxios(config: CreateAxiosOptions) {
    if (!this.axiosInstance) {
      return
    }
    this.createAxios(config)
  }

  /**
   * @description: Set general header
   */
  setHeader(headers: unknown): void {
    if (!this.axiosInstance) {
      return
    }
    Object.assign(this.axiosInstance.defaults.headers, headers)
  }

  /**
   * @description: Interceptor configuration
   */
  private setupInterceptors(interceptors: Interceptors) {
    const { request, response } = interceptors
    // 加载请求拦截器
    request.forEach((item) => {
      const { onFulfilled, onRejected } = item
      this.axiosInstance.interceptors.request.use(
        (config) => (onFulfilled && isFunction(onFulfilled) ? onFulfilled(config, this.options) : config),
        (error) => (onRejected && isFunction(onRejected) ? onRejected(error, this.options) : Promise.reject(error))
      )
    })
    // 加载响应拦截器
    response.forEach((item) => {
      const { onFulfilled, onRejected } = item
      this.axiosInstance.interceptors.response.use(
        (response) => (onFulfilled && isFunction(onFulfilled) ? onFulfilled(response, this.options) : response),
        (error) => (onRejected && isFunction(onRejected) ? onRejected(error, this.options) : error)
      )
    })
  }

  /**
   * @description:  File Upload
   */
  uploadFile<T = unknown>(config: AxiosRequestConfig, params: UploadFileParams) {
    const formData = new window.FormData()
    const customFilename = params.name || 'file'

    if (params.filename) {
      formData.append(customFilename, params.file, params.filename)
    } else {
      formData.append(customFilename, params.file)
    }

    if (params.data) {
      Object.keys(params.data).forEach((key) => {
        const value = params.data![key]
        if (Array.isArray(value)) {
          value.forEach((item) => {
            formData.append(`${key}[]`, item)
          })
          return
        }

        formData.append(key, value as string | Blob)
      })
    }

    return this.axiosInstance.request<T>({
      ...config,
      method: Request.POST,
      data: formData,
      headers: {
        'Content-type': ContentType.FORM_DATA,
        // @ts-ignore
        ignoreCancelToken: true
      }
    })
  }

  get<T = unknown>(url: string, params?: RecordAble, config?: CreateAxiosOptions): Promise<Result<T>> {
    return this.request({ ...config, params, method: Request.GET, url })
  }

  post<T = unknown>(url: string, data?: unknown, config?: CreateAxiosOptions): Promise<Result<T>> {
    return this.request({ ...config, data, method: Request.POST, url })
  }

  put<T = unknown>(url: string, data?: unknown, config?: CreateAxiosOptions): Promise<Result<T>> {
    return this.request({ ...config, data, method: Request.PUT, url })
  }

  delete<T = unknown>(url: string, data?: unknown, config?: CreateAxiosOptions): Promise<Result<T>> {
    return this.request({ ...config, data, method: Request.DELETE, url })
  }

  request<T = unknown>(config: CreateAxiosOptions): Promise<Result<T>> {
    const conf = cloneDeep(config)

    conf.requestOptions = { ...this.options?.requestOptions, ...config.requestOptions }

    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request<Result<T>>(conf)
        .then((res) => {
          resolve(res.data || res)
        })
        .catch((e: Error | AxiosError) => {
          reject(e)
        })
    })
  }
}
