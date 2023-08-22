import http from '@/utils/http/axios'

const isDev = import.meta.env.DEV
const PREFIX = import.meta.env.VITE_BASE_API_PREFIX
const apiUrl = import.meta.env.VITE_BASE_API || ''

const BaseApi = isDev ? PREFIX : apiUrl

/**
 * 单文件上传
 */
export const uploadFileUrl = BaseApi + '/file/upload'

/**
 * 多文件上传
 */
export const uploadFilesUrl = BaseApi + '/file/uploads'

// 查看、下载文件地址
const BaseIp = import.meta.env.VITE_BASE_IP || ''

export const downloadUrl = !BaseIp.endsWith('/') ? BaseIp + '/' : BaseIp

/**
 * 删除已上传的文件
 * @param fileIds 文件ID
 * @returns
 */
export const delFile = (fileIds: Array<Key>) => http.post<boolean>('/file/del', fileIds)

// =============== ds 相关 ===================

// 获取onlyOffice 配置
export const getDsConfig = (fileId: Key, mode: DsAPI.mode, theme: DsAPI.theme, permission: DsAPI.Permission = {}) =>
  http.post<DsAPI.FileModel>('/file/ds/config', permission, { params: { fileId, theme, mode } })

// 历史记录
export const openHistories = (fileId: Key) => http.get<DsAPI.History[]>('/file/ds/openHistories', { fileId })

// 打开历史数据
export const openHistoryData = (fileVersionId: Key) => http.get<DsAPI.HistoryData>('/file/ds/openHistoryData', { fileVersionId })

// 修改名称
export const rename = (fileId: Key, fileName: string) => http.get<boolean>('/file/ds/rename', { fileId, fileName })
