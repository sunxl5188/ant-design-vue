import { createApp } from 'vue'
import App from './App.vue'
import 'virtual:svg-icons-register'
import SvgIcon from './components/icons'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import i18n from './i18n'
import router from './router'
import './assets/styles/base.less'
import './assets/styles/tailwind.css'
import Icons from './utils/antdIcon'

const app = createApp(App)
app.component('SvgIcon', SvgIcon)

const pinia = createPinia()
pinia.use(createPersistedState())
app.use(Icons)
app.use(pinia)
app.use(i18n)
app.use(router)
app.mount('#app')
