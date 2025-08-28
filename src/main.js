import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { registerPlugins } from './plugins'

import App from './App.vue'
import auth0 from './auth/auth0'

import router from './router'

import 'vuetify/styles'
import './assets/css/main.css';
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
    theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1976d2',
          secondary: '#424242',
          accent: '#82b1ff',
          error: '#ff5252',
          info: '#2196f3',
          success: '#4caf50',
          warning: '#ffc107',
        },
      },
    },
  },
})

const app = createApp(App)

registerPlugins(app)
app.use(createPinia())
app.use(router)
app.use(auth0)
app.use(vuetify)

app.mount('#app')
