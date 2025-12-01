import BasePic from './BasePic.vue'
import type { App } from 'vue'

const install = (app: App) => {
  app.component(BasePic.name || 'BasePic', BasePic)
}

export { BasePic, install }
