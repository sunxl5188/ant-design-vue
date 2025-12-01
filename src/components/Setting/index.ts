import LocaleIcon from './LocaleIcon.vue'
import ThemeIcon from './ThemeIcon.vue'

import type { App } from 'vue'

const install = (app: App) => {
  app.component(LocaleIcon.name || 'LocaleIcon', LocaleIcon)
  app.component(ThemeIcon.name || 'ThemeIcon', ThemeIcon)
}

export { LocaleIcon, ThemeIcon, install }

export default { LocaleIcon, ThemeIcon, install }
