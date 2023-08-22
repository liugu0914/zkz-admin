import { ContentType } from '@/enums/http'
import { OAxios } from './axios'

export * from './type'

export * from '@/enums/http'

const isDev = import.meta.env.DEV

const PREFIX = import.meta.env.VITE_BASE_API_PREFIX

const apiUrl = import.meta.env.VITE_BASE_API

function createAxios() {
  return new OAxios({
    // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
    // authentication schemes，e.g: Bearer
    // authenticationScheme: 'Bearer',
    Authorization: import.meta.env.VITE_AUTHORIZATION_KEY,
    // 20秒超时
    timeout: 20 * 1000,
    // 基础接口地址
    baseURL: isDev ? PREFIX : apiUrl,
    // 如果是form-data格式
    // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
    headers: { 'Content-Type': ContentType.JSON },
    // 表示跨域请求时是否需要使用凭证
    withCredentials: true,
    // 配置项，下面的选项都可以在独立的接口请求中覆盖
    requestOptions: {
      // 是否加入时间戳 防止get缓存
      joinTime: false,
      // 是否加密数据
      isEncrypted: false
    }
  })
}

const http = createAxios()

export default http
