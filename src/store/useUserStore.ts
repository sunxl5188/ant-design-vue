import type { SiderTabType, UserInfoType } from '@/types/useAppStore.d.ts'
import { defineStore } from 'pinia'
import router, { constantRoutes, dynamicRoutes } from '@/router'
import type { RouteRecordRaw } from 'vue-router'
import { useAppStore } from '@/store/useAppStore'
import { icons } from '@/utils/antdIcon'
import { loginAccount } from '@/api/login'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '' as string,
    userInfo: {} as UserInfoType,
    permissions: [] as Array<string>, //权限点
    sidebarRouters: [] as Array<any>, //导航菜单路由
    routers: [] as Array<RouteRecordRaw> //当前用户可访问的路由
  }),
  getters: {},
  actions: {
    //登录
    async login(params: any): Promise<boolean> {
      const appStore = useAppStore()
      let boole: boolean = false
      if (params.userName && params.password) {
        const { code, data } = await loginAccount({
          userName: params.userName,
          password: params.password
        })
        if (code === 200) {
          this.token = data.token
          this.userInfo = data.userInfo
          this.permissions = data.permissions
          await this.generateRoutes()
          // 获取字典数据
          const dictRes = await appStore.setDictData()
          if (dictRes) {
            boole = true
          }
        }
      } else if (/^1[3-9]\d{9}$|^0\d{2,3}-\d{7,8}$/.test(params.phone)) {
        await this.generateRoutes()
        // 获取字典数据
        const dictRes = await appStore.setDictData()
        if (dictRes) {
          boole = true
        } else this.loginOut()
      }
      return boole
    },
    loginOut() {
      return new Promise(resolve => {
        this.token = ''
        this.userInfo = {}
        this.permissions = []
        resolve(true)
      })
    },
    //生成路由
    generateRoutes(): any {
      const appStore = useAppStore()
      return new Promise(resolve => {
        const asyncRoutes = this.filterDynamicRoutes(dynamicRoutes)
        const i = constantRoutes.findIndex(o => o.name === 'layout')
        asyncRoutes.forEach((item: RouteRecordRaw) => {
          router.addRoute(item)
          if (constantRoutes[i]?.children) {
            constantRoutes[i].children.push(item)
          }
        })
        //生成导航菜单
        const welcome = constantRoutes[i]?.children?.filter(
          o => o.name !== 'Welcome'
        )
        if (welcome && !appStore.tabs.length) {
          const { meta, path } = welcome[0] || {}
          appStore.setTabs([
            {
              title: meta?.title as string,
              label: meta?.title as string,
              key: path as string
            }
          ])
        }
        this.sidebarRouters = this.generateSidebar(
          constantRoutes[i]?.children || []
        )
        this.routers = router.getRoutes()
        //设置需要缓存的页面名称数组
        const keepAliveList: Array<string> = []
        this.routers.forEach(route => {
          if (route.meta?.keepAlive && route.name) {
            keepAliveList.push(route.name as string)
          }
        })
        appStore.setKeepAliveList(keepAliveList)
        resolve(true)
      })
    },
    // 动态路由遍历，验证是否具备权限
    filterDynamicRoutes(routes: RouteRecordRaw[]) {
      const routerList: RouteRecordRaw[] = []
      routes.forEach(route => {
        if (route.meta) {
          if (
            !route.meta.auth ||
            this.permissions.includes(route.meta.auth as string)
          ) {
            if (route.children) {
              route.children = this.filterDynamicRoutes(route.children)
            }
            routerList.push(route)
          }
        }
      })
      return routerList
    },
    //生成导航菜单
    generateSidebar(
      route: RouteRecordRaw[],
      prependPath = ''
    ): Array<SiderTabType> {
      const sidebar: Array<SiderTabType> = []
      route?.forEach(item => {
        let children: Array<SiderTabType> | undefined
        let icon = undefined
        if (item.meta?.icon) {
          icon = h(icons[item.meta?.icon as keyof typeof icons])
        }
        if (item.children?.length) {
          children = this.generateSidebar(item.children, item.path + '/')
        }
        sidebar.push({
          title: item.meta?.title as string,
          label: item.meta?.title as string,
          key: prependPath + item.path,
          icon,
          children
        })
      })
      return sidebar
    },
    //更新系统缓存数据
    updateSystemCache(): Promise<boolean> {
      return new Promise(resolve => {
        const appStore = useAppStore()
        appStore
          .setDictData()
          .then(() => resolve(true))
          .catch(() => resolve(false))
      })
    }
  },
  persist: {
    key: 'userStore' + __APP_VERSION__,
    pick: ['token', 'userInfo', 'permissions', 'sidebarRouters']
  }
})
