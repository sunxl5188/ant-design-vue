import type { App } from 'vue'
const modules = import.meta.glob('./*.ts', { eager: true })

export default {
  install(app: App) {
    for (const path in modules) {
      const module = modules[path] as any
      app.use(module.default)
    }
  }
}
