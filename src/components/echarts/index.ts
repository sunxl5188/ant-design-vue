import BasePic from './BasePic.vue'
import BaseLine from './BaseLine.vue'
import BaseBar from './BaseBar.vue'
import type { App } from 'vue'

const install = (app: App) => {
  app.component(BasePic.name || 'BasePic', BasePic)
  app.component(BaseLine.name || 'BaseLine', BaseLine)
  app.component(BaseBar.name || 'BaseBar', BaseBar)
}

export { BasePic, BaseLine, BaseBar, install }
