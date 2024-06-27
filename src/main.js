import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'
import { createAuth0 } from "@auth0/auth0-vue";

import { createPinia } from 'pinia'

// Composables
import { createApp } from 'vue'
import router from './router'

const app = createApp(App)

registerPlugins(app)
app.use(createPinia())
app.use(router)

app.use(
  createAuth0({
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
    authorizationParams: {
      redirect_uri: window.location.origin,
      scope: import.meta.env.VITE_AUTH0_SCOPE
    }
  })
)
app.mount('#app')
