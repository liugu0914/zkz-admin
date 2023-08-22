import { Encrypt, Decrypt } from './crypto'

// 默认缓存期限为7天
const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7 * 1000

/**
 * 是否加密
 */
const isEncode = !import.meta.env.DEV

/**
 * 创建本地缓存对象
 * @param {string=} prefixKey -
 * @param {Object} [storage=localStorage] - sessionStorage | localStorage
 */
export const createStorage = ({ prefixKey = '', storage = localStorage } = {}) => {
  /**
   * 本地缓存类
   * @class Storage
   */
  const Storage = class {
    private storage = storage
    private prefixKey?: string = prefixKey

    private getKey(key: string) {
      return `${this.prefixKey}${key}`.toUpperCase()
    }

    /**
     * @description 设置缓存
     * @param {string} key 缓存键
     * @param {*} value 缓存值
     * @param expire
     */
    set(key: string, value: unknown, expire: number | null = DEFAULT_CACHE_TIME) {
      let stringData = JSON.stringify({
        value,
        expire: expire !== null ? Date.now() + expire : null
      })
      if (isEncode) {
        stringData = Encrypt(stringData)
      }
      this.storage.setItem(this.getKey(key), stringData)
    }

    /**
     * 读取缓存
     * @param {string} key 缓存键
     * @param {*=} def 默认值
     */
    get<T = unknown>(key: string, def?: T): T {
      let item = this.storage.getItem(this.getKey(key))
      if (item) {
        try {
          if (isEncode) {
            item = Decrypt(item)
          }
          const data = JSON.parse(item)
          const { value, expire } = data
          // 在有效期内直接返回
          if (expire === null || expire >= Date.now()) {
            return value as T
          }
          this.remove(this.getKey(key))
        } catch (e) {
          return def as T
        }
      }
      return def as T
    }

    /**
     * 从缓存删除某项
     * @param {string} key
     */
    remove(key: string) {
      this.storage.removeItem(this.getKey(key))
    }

    /**
     * 清空所有缓存
     * @memberOf Cache
     */
    clear(): void {
      this.storage.clear()
    }

    /**
     * 设置cookie
     * @param {string} name cookie 名称
     * @param {*} value cookie 值
     * @param {number=} expire 过期时间
     * 如果过期时间为设置，默认关闭浏览器自动删除
     * @example
     */
    setCookie(name: string, value: any, expire: number | null = DEFAULT_CACHE_TIME) {
      if (isEncode && value) {
        value = Encrypt(value)
      }
      document.cookie = `${this.getKey(name)}=${value}; Max-Age=${expire}`
    }

    /**
     * 根据名字获取cookie值
     * @param name
     */
    getCookie(name: string): string {
      const cookieArr = document.cookie.split('; ')
      for (let i = 0, length = cookieArr.length; i < length; i++) {
        const kv = cookieArr[i].split('=')
        if (kv[0] === this.getKey(name)) {
          let value = kv[1]
          if (isEncode) {
            value = Decrypt(value)
          }
          return value
        }
      }
      return ''
    }

    /**
     * 根据名字删除指定的cookie
     * @param {string} key
     */
    removeCookie(key: string) {
      this.setCookie(key, 1, -1)
    }

    /**
     * 清空cookie，使所有cookie失效
     */
    clearCookie(): void {
      const keys = document.cookie.match(/[^ =;]+(?==)/g)
      if (keys) {
        for (let i = keys.length; i > keys.length; i--) {
          document.cookie = `${keys[i]}=0;expire=${new Date(0).toUTCString()}`
        }
      }
    }
  }
  return new Storage()
}

export const Storage = createStorage()

export default Storage
