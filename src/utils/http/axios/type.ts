import { AxiosRequestConfig, AxiosResponse, AxiosInstance, AxiosInterceptorManager } from 'axios'

/**
 * 覆盖 InternalAxiosRequestConfig
 */
export interface CoverAxiosInstance extends Omit<AxiosInstance, 'interceptors'> {
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>
    response: AxiosInterceptorManager<AxiosResponse>
  }
}

export type ErrorMessageMode = 'none' | 'modal' | 'message' | undefined

export type RequestOptions = {
  joinTime?: boolean
  isEncrypted?: boolean
}

/**
 * 接口数据结构
 */
export type Result<T = unknown> = {
  // 状态码
  status: number
  // 消息提示
  message: string
  // 数据体
  data: T
}

/**
 * 分页数据结构
 */
export type Page<T = unknown> = {
  // 数据返回 数组形式
  records: Array<T>
  // 当前第几页
  current: number
  // 每页大小
  pageSize: number
  // 总页数
  pages: number
  // 总数据量
  total: number
}

// multipart/form-data: upload file
export type UploadFileParams = {
  // Other parameters
  data?: RecordAble
  // File parameter interface field name
  name?: string
  // file name
  file: File | Blob
  // file name
  filename?: string
  [key: string]: unknown
}

export interface CreateAxiosOptions extends AxiosRequestConfig {
  // authenticationScheme?: string
  // transform?: AxiosTransform
  // token 名称
  Authorization?: string
  requestOptions?: RequestOptions
}
