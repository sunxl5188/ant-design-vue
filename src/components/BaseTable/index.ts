import BaseTable from './index.vue'
import type { App } from 'vue'

BaseTable.install = (app: App) => {
  app.component(BaseTable.name || 'BaseTable', BaseTable)
}

export default BaseTable
