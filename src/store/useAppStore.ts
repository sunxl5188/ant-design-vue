import type { ThemeTokenType, SiderTabType } from '@/types/useAppStore.d.ts'
import { defineStore } from 'pinia'
import { fetch } from '@/utils/request'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import enUS from 'ant-design-vue/es/locale/en_US'

type ThemeType = 'light' | 'dark'
export type LanguageType = 'zh-CN' | 'en-US'

export const useAppStore = defineStore('app', {
  state: () => ({
    theme: 'light' as ThemeType,
    themeToken: {} as ThemeTokenType,
    language: 'zh-CN' as LanguageType, //语言
    antdLocale: zhCN, //antd语言包
    collapsed: false as boolean, //侧边栏折叠状态
    openKeys: [] as Array<string>, //当前展开的菜单项
    selectedKeys: [] as Array<string>, //当前选中的菜单项
    tabs: [] as Array<SiderTabType>, //标签页数据
    refreshKey: {} as Record<string, number>, // 用于强制刷新页面的 key
    refreshState: false as boolean, // 强制刷新状态
    keepAliveList: [] as Array<string>, //需要缓存的路由名称
    dictData: {} as Record<string, Array<{ text: string; value: any }>> //数据字典
  }),
  actions: {
    // 设置主题
    setTheme(theme: ThemeType) {
      this.theme = theme
    },
    // 设置主题变量
    setThemeToken(token: any) {
      this.themeToken = token
    },
    // 设置语言
    setLanguage(lang: LanguageType) {
      this.language = lang
      this.antdLocale = lang === 'zh-CN' ? zhCN : enUS
    },
    // 侧边栏折叠切换
    toggleCollapsed(boole: boolean) {
      this.collapsed = boole
    },
    // 设置侧边栏菜单选中状态
    setSelectKeys(key: string) {
      this.selectedKeys = [key]
    },
    // 设置侧边栏菜单展开状态
    setOpenKeys(openKeys: Array<string>) {
      this.openKeys = openKeys
    },
    // 设置标签页数据
    setTabs(tabData: Array<SiderTabType>) {
      // 让 key === '/workplace' 的标签排在第一位
      tabData.sort((a, b) => {
        if (a.key === '/workplace') return -1
        if (b.key === '/workplace') return 1
        return 0
      })
      this.tabs = tabData
    },
    // 强制刷新页面
    refreshPage(keepName: string) {
      this.refreshState = true
      const list = [...this.keepAliveList]
      const index = list.indexOf(keepName)
      if (index > -1) {
        this.refreshKey[keepName] = Date.now()
        this.refreshState = false
      } else {
        this.refreshKey[keepName] = Date.now()
        list.splice(index, 1)
        this.keepAliveList = list
        setTimeout(() => {
          this.keepAliveList = [...list, keepName]
          this.refreshState = false
        }, 500)
      }
    },
    //设置需要缓存的页面名称数组
    setKeepAliveList(list: Array<string>) {
      this.keepAliveList = list
    },
    // 设置字典数据
    async setDictData(): Promise<boolean> {
      return new Promise(resolve => {
        fetch('/home/index/webSystemDictAll')
          .then(res => {
            if (res.code === 200) {
              this.dictData = res.data
              resolve(true)
            } else resolve(false)
          })
          .catch(() => resolve(false))
      })
    }
  },
  getters: {
    /**
     * 获取当前激活的标签页
     */
    currentTab: state => {
      return state.selectedKeys[0]
    }
  },
  persist: {
    key: 'appStore' + __APP_VERSION__,
    pick: [
      'theme',
      'language',
      'themeToken',
      'collapsed',
      'menuState',
      'tabs',
      'selectedKeys',
      'openKeys',
      'dictData'
    ]
  }
})
