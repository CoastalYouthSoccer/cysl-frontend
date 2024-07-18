import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { registerPlugins } from './plugins'

import App from './App.vue'
import auth0 from './auth0'

import router from './router'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App)

registerPlugins(app)
app.use(createPinia())
app.use(router)
app.use(auth0)
app.use(vuetify)

app.mount('#app')
