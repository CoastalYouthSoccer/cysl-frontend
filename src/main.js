import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'
import { createPinia } from 'pinia'

// Composables
import { createApp } from 'vue'

const app = createApp(App)

registerPlugins(app)

app.use(createPinia())
app.mount('#app')
