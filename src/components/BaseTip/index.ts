import BaseTip from './index.vue'
import type { App } from 'vue'

BaseTip.install = (app: App) => {
  app.component(BaseTip.name || 'BaseTip', BaseTip)
}

export default BaseTip
