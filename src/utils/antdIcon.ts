import * as IconList from '@ant-design/icons-vue'
import type { App } from 'vue'

// 所有 antd 图标组件数组
const iconsMap: { [key: string]: any } = {}
for (const key in IconList) {
  iconsMap[key] = IconList[key as keyof typeof IconList]
}

export const icons = iconsMap

// 作为插件批量注册所有图标
export default {
  install(app: App) {
    for (const key in iconsMap) {
      app.component(key, iconsMap[key])
    }
  }
}
