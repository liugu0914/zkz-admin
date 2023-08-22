import { UploadProps } from 'naive-ui'
import { computed } from 'vue'
import { UpProps, types } from './type'
import { uploadFileUrl } from '@/api/common/file'
import { isString } from 'lodash-es'
import { call } from '@/utils/base'
import { useNaive } from '@/hooks/setting/useNaive'
import { useI18n } from '@/hooks/locale/useI18n'
import { useAccout } from '@/hooks/accout/useAccout'

export const getUploadProps = (props: UpProps) => {
  const { message } = useNaive()

  const { t } = useI18n()

  const { getToken } = useAccout()
  /**
   * 请求头
   */
  const headers = computed(() => {
    // 请求头添加token
    const Authorization = import.meta.env.VITE_AUTHORIZATION_KEY

    return {
      ...props.headers,
      [Authorization]: getToken.value
    }
  })

  /**
   * 接受的文件类型
   */
  const accept = computed(() => {
    if (props.accept) {
      // 执行自定义函数
      return props.accept
    }
    const type = props.fileType || 'all'
    const arr = isString(type) ? [type] : type
    const fileTypes = arr.includes('all') ? Object.keys(types) : arr
    const ss = fileTypes.reduce((arr: string[], curr) => {
      const items = types[curr].map((item) => `.${item}`)
      items.forEach((item) => {
        if (!arr.includes(item)) {
          arr.push(item)
        }
      })
      return arr
    }, [])

    const str = arr
      .filter((item) => {
        return item === 'audio' || item === 'video'
      })
      .map((item) => `${item}/*`)
      .concat(ss)
      .join(',')

    return str
  })

  /**
   * 文件上传前的回调
   */
  const onBeforeUpload: UploadProps['onBeforeUpload'] = (options) => {
    if (props.onBeforeUpload) {
      // 执行自定义函数
      return call(props.onBeforeUpload, options)
    }
    const fileInfo = options.file
    const { file } = fileInfo
    if (!file) {
      return false
    }
    const size = file.size / 1024 / 1024
    const type = props.fileType || 'all'
    const typeArr =
      typeof type === 'string'
        ? types[type]
        : type.reduce((arr: string[], curr) => {
            arr = arr.concat(types[curr])
            return arr
          }, [])
    const err = typeArr.join(',')
    const fileStr = file.name.split('.')
    const suffix = fileStr[fileStr.length - 1].toLocaleLowerCase()
    const isErrFormat = !typeArr.some((item) => suffix === item)
    if (isErrFormat) {
      message.error(t('component.upload.uploadPlz', { name: err }))
      return false
    }
    if (size > 150) {
      message.error(t('component.upload.uploadWarn'))
      return false
    }
    return true
  }

  /**
   * 文件上传失败的回调
   */
  const onError: UploadProps['onError'] = (options) => {
    const event = options.event
    const response = getResponse(event)

    if (response && response.message) {
      message.error(response.message)
    }
    if (props.onError) {
      call(props.onError, options)
    }
  }

  /**
   * 上传文件成功回调
   */
  const onFinish: UploadProps['onFinish'] = (options) => {
    const event = options.event
    const response = getResponse(event)

    if (props.onFinish) {
      call(props.onFinish, options, response)
    }
  }

  return computed(() => {
    return {
      ...props,
      action: props.action ? props.action : uploadFileUrl,
      withCredentials: true,
      accept: accept.value,
      onError,
      onFinish,
      onBeforeUpload,
      headers: headers.value
    } as UploadProps
  })
}

/**
 *  获取请求数据
 */
const getResponse = (event: ProgressEvent<EventTarget> | Event | undefined) => {
  if (!event) {
    return
  }
  if (!event.target) {
    return
  }
  const responseStr = (event?.target as XMLHttpRequest).response
  if (!responseStr) {
    return
  }
  const response = isString(responseStr) ? JSON.parse(responseStr) : undefined
  return response
}
