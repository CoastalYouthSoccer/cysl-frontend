import { registerPlugins } from '@/plugins'

import App from './App.vue'
import auth0 from './auth0'

import { createPinia } from 'pinia'

import { createApp } from 'vue'
import router from './router'

const app = createApp(App)

registerPlugins(app)
app.use(createPinia())
app.use(router)
app.use(auth0)

app.mount('#app')
