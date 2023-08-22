export const menus = [
  {
    id: 842450108677,
    name: '文件管理',
    icon: 'cs-jiaoseguanli1',
    enable: 1,
    parent: 0,
    router: 'fileShow',
    superId: 0,
    orderNum: 1,
    appId: '123',
    checked: false
  },
  {
    id: 1,
    name: '系统管理',
    icon: 'cs-shezhi',
    enable: 1,
    parent: 1,
    superId: 0,
    orderNum: 8,
    appId: '123',
    children: [
      {
        id: 11352268528,
        name: '用户',
        icon: 'cs-user',
        enable: 1,
        parent: 0,
        router: 'user',
        superId: 1,
        orderNum: 1,
        appId: '123',
        checked: false
      },
      {
        id: 8914414988800,
        name: '组织管理',
        icon: 'cs-zuzhiqunzu',
        enable: 1,
        parent: 0,
        router: 'organization',
        superId: 1,
        orderNum: 1,
        appId: '123',
        checked: false
      },
      {
        id: 32107909926917,
        name: '部门',
        icon: 'cs-jiaoseguanli',
        enable: 1,
        parent: 0,
        router: 'dept',
        superId: 1,
        orderNum: 2,
        appId: '123',
        checked: false
      },
      {
        id: 8949967149801,
        name: '应用管理',
        icon: 'cs-yingyong',
        enable: 1,
        parent: 0,
        router: 'app',
        superId: 1,
        orderNum: 2,
        appId: '123',
        checked: false
      },
      {
        id: 2,
        name: '菜单管理',
        icon: 'cs-caidan',
        enable: 1,
        parent: 0,
        router: 'menu',
        superId: 1,
        orderNum: 3,
        appId: '123',
        checked: false
      },
      {
        id: 891996741802,
        name: '权限管理',
        icon: 'cs-authority',
        enable: 1,
        parent: 0,
        router: 'permission',
        superId: 1,
        orderNum: 4,
        appId: '123',
        checked: false
      },
      {
        id: 81761570816,
        name: '角色管理',
        icon: 'cs-jiaoseguanli1',
        enable: 1,
        parent: 0,
        router: 'role',
        superId: 1,
        orderNum: 5,
        appId: '123',
        checked: false
      },
      {
        id: 905760261,
        name: '系统日志',
        icon: 'cs-caidan',
        enable: 1,
        parent: 0,
        router: 'sysLog',
        superId: 1,
        orderNum: 6,
        appId: '123',
        checked: false
      },
      {
        id: 922823941,
        name: '在线用户',
        icon: 'cs-user',
        enable: 1,
        parent: 0,
        router: 'online',
        superId: 1,
        orderNum: 7,
        appId: '123',
        checked: false
      }
    ],
    checked: false
  }
]
