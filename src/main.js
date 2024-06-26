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
//    domain: import.meta.env.AUTH0_DOMAIN,
//    client_id: import.meta.env.AUTH0_CLIENT_ID,
//    redirect_uri: import.meta.env.AUTH0_CALLBACK_URL,
//    audience: import.meta.env.AUTH0_AUDIENCE,
//    scope: import.meta.env.AUTH0_SCOPE
    domain: 'hanover-referee.us.auth0.com',
    clientId: 'tJR9OaGGwTwobEAlzKNiJxhsEXR90Vbh',
    authorizationParams: {
      redirect_uri: window.location.origin
    },
    scope: 'read:game'
  })

)
app.mount('#app')
