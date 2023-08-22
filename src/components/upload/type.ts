import { Result } from '@/utils/http/axios'
import { UploadProps, uploadProps } from 'naive-ui'
import { ExtractPublicPropTypes, PropType } from 'vue'
// import { Result } from '@/utils/http/axios/type'

/**
 * 文件后缀类型
 */
const allType = {
  app: ['wgt', 'wgtu', 'apk'],
  pdf: ['pdf'],
  excel: ['xls', 'xlsx'],
  word: ['doc', 'docx'],
  ppt: ['ppt', 'pptx'],
  image: ['jpg', 'jpeg', 'png'],
  audio: ['audio/*'],
  video: ['video/*'],
  all: [] as string[]
}
/**
 * 所有的类型
 */
const fileTypes = () => {
  const all: string[] = []
  Object.keys(allType).forEach((item) => {
    all.push(...allType[item])
  })
  allType.all = all
  return allType
}

/**
 * 计算所有的类型
 */
export const types = fileTypes()

export type FileType = keyof typeof allType

/**
 * 表格 props
 */
export const upProps = {
  ...uploadProps,
  // 是否显示头部
  fileType: {
    type: [String, Array] as PropType<FileType | FileType[]>,
    default: () => 'all'
  },
  onFinish: {
    type: Function as PropType<(options: UploadOptions, data: FileResData) => void>
  }
}

export type UpProps = ExtractPublicPropTypes<typeof upProps>

export type UploadOptions = First<Parameters<Required<UploadProps>['onFinish']>>

export type FileResData = Result<FileResult>
