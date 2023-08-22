import { genMessage } from '../helper'
import { LOCALE } from '@/enums/locale'
import { zhCN, dateZhCN } from 'naive-ui'

const modules = import.meta.glob('./zh-CN/**/*.ts', { eager: true }) as RecordAble<any>

const data = genMessage(modules, LOCALE.ZH_CN)
export default {
  message: {
    ...data,
    nLocale: zhCN,
    ndateLocale: dateZhCN
  }
}
