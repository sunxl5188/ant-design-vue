import type { Locale } from 'ant-design-vue/es/locale-provider'
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
    antdLocale: zhCN as Locale, //antd语言包
    keepArray: [] as Array<string>, //需要缓存的页面名称数组
    collapsed: false as boolean, //侧边栏折叠状态
    openKeys: [] as Array<string>, //当前展开的菜单项
    selectedKeys: [] as Array<string>, //当前选中的菜单项
    tabs: [] as Array<SiderTabType>, //标签页数据
    refreshKey: 0 as number, // 用于强制刷新页面的 key
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
    refreshPage() {
      this.refreshKey = Date.now()
    },
    // 设置需要缓存的页面名称数组
    setKeepArray(keepArray: Array<string>) {
      this.keepArray = keepArray
    },
    // 设置字典数据
    async setDictData() {
      return new Promise((resolve, reject) => {
        fetch('/home/index/getSystemDictAll')
          .then(res => {
            if (res.code === 200) {
              this.dictData = res.data
              resolve(true)
            } else resolve(false)
          })
          .catch(err => reject(err))
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
