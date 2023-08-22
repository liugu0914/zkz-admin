import { getDeptTree } from '@/api/modules/sys/dept'
import { useI18n } from '@/hooks/locale/useI18n'
import to from '@/utils/await-to'
import { toTree } from '@/utils/base'
import { FormRules } from 'naive-ui'
import { computed } from 'vue'

const { t } = useI18n()

/**
 * 获取部门树
 */
export const getDepts = async () => {
  const [, res] = await to(getDeptTree())
  const resData = res ? res.data : []
  return toTree(resData, { label: 'name', value: 'id', key: 'id' })
}

export const columns = computed<TableColumns<User>>(() => [
  {
    title: t('pages.sys.user.avatar'),
    key: 'imgUrl',
    width: 80,
    fixed: 'left'
  },
  {
    title: t('pages.sys.user.userName'),
    key: 'userName'
  },
  {
    title: t('pages.sys.user.account'),
    key: 'account',
    searchAble: true
  },
  {
    title: t('pages.sys.user.deptName'),
    key: 'deptName',
    searchAble: true,
    search: {
      type: 'tree',
      name: 'deptId',
      options: getDepts
    }
  },
  {
    title: t('pages.sys.user.email'),
    key: 'email',
    searchAble: true
  },
  {
    title: t('pages.sys.user.options'),
    width: 100,
    key: 'actions'
  }
])

export const defaultRules = computed<FormRules>(() => ({
  userName: [
    {
      required: true,
      trigger: 'change',
      message: t('common.inputPlz', { name: t('pages.sys.user.userName') })
    }
  ],
  account: [
    {
      required: true,
      trigger: 'change',
      message: t('common.inputPlz', { name: t('pages.sys.user.account') })
    }
  ],
  password: [
    {
      required: true,
      trigger: 'change',
      message: t('common.inputPlz', { name: t('pages.sys.user.password') })
    }
  ],
  confirmPassword: [
    {
      required: true,
      trigger: 'change',
      message: t('common.inputPlz', { name: t('pages.sys.user.confirmPassword') })
    }
  ],
  phone: [
    {
      required: true,
      trigger: 'change',
      message: t('common.inputPlz', { name: t('pages.sys.user.phone') })
    }
  ],
  idCard: [
    {
      required: true,
      trigger: 'change',
      message: t('common.inputPlz', { name: t('pages.sys.user.idCard') })
    }
  ],
  deptId: [
    {
      required: true,
      trigger: 'change',
      message: t('common.selectPlz', { name: t('pages.sys.user.deptName') })
    }
  ],
  email: [
    {
      required: false,
      message: t('common.inputPlz', { name: t('pages.sys.user.email') })
    }
  ],
  enable: [
    {
      required: true,
      type: 'number',
      message: t('common.selectPlz', { name: t('pages.sys.user.enable') })
    }
  ]
}))

export const defaultForm: Partial<User> = {
  id: undefined,
  imgUrl: undefined,
  userName: undefined,
  account: undefined,
  idCard: undefined,
  phone: undefined,
  deptName: undefined,
  deptId: undefined,
  email: undefined,
  enable: undefined
}
