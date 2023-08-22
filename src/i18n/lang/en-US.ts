import { genMessage } from '../helper'
import { LOCALE } from '@/enums/locale'
import { enUS, dateEnUS } from 'naive-ui'

const modules = import.meta.glob('./en-US/**/*.ts', { eager: true }) as RecordAble<any>

const data = genMessage(modules, LOCALE.EN_US)

export default {
  message: {
    ...data,
    nLocale: enUS,
    ndateLocale: dateEnUS
  }
}
