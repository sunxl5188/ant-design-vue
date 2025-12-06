import BaseSelect from './index.vue'
import type { App } from 'vue'

BaseSelect.install = (app: App) => {
  app.component(BaseSelect.name || 'BaseSelect', BaseSelect)
}

export default BaseSelect
