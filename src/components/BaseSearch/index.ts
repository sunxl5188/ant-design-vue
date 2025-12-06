import BaseSearch from './index.vue'
import type { App } from 'vue'

BaseSearch.install = (app: App) => {
  app.component(BaseSearch.name || 'BaseSearch', BaseSearch)
}

export default BaseSearch
