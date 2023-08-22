import CryptoJS from 'crypto-js'
import { isString } from 'lodash-es'

/**
 * 必须16位
 */
const crpytoConfig = {
  AES_KEY: '1234123412ABCDEF',
  AES_IV: 'ABCDEF1234123412'
}

/**
 * @description aes加密
 * @param {string} word 需要加密的字符串
 */

export const Encrypt = (word: RecordAble | string | number) => {
  // if (!word) {
  //   return word
  // }
  const { AES_IV, AES_KEY } = crpytoConfig
  const key = CryptoJS.enc.Utf8.parse(AES_KEY)
  const iv = CryptoJS.enc.Utf8.parse(AES_IV)
  const srcs = CryptoJS.enc.Utf8.parse(!isString(word) ? JSON.stringify(word) : word)

  const encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.ciphertext.toString(CryptoJS.enc.Base64)
}

/**
 * @description aes解密
 * @param {string} word 需要解密的字符串
 */

export const Decrypt = (word: string) => {
  if (!word) {
    return word
  }
  const { AES_IV, AES_KEY } = crpytoConfig
  const key = CryptoJS.enc.Utf8.parse(AES_KEY)
  const iv = CryptoJS.enc.Utf8.parse(AES_IV)
  const encryptedHexStr = CryptoJS.enc.Base64.parse(word)
  const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)

  const decrypt = CryptoJS.AES.decrypt(srcs, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return decrypt.toString(CryptoJS.enc.Utf8).toString()
}
