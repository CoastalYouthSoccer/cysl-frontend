<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    permanent
    class="bg-grey-lighten-4"
  >
    <v-list dense>
      <NavPublic/>
      <NavDocumentation/>
      <NavResource/>
      <NavTool/>
      <NavMaintenance/>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue'
import NavPublic from './NavPublic.vue'
import NavDocumentation from './NavDocumentation.vue'
import NavTool from './NavTool.vue'
import NavMaintenance from './NavMaintenance.vue'
import NavResource from './NavResource.vue'

const drawer = ref(true)

const items = [
  { title: 'Profile', icon: 'mdi-account', to: '/profile' },
  { title: 'Admin', icon: 'mdi-shield-account', to: '/admin' },
  { title: 'Settings', icon: 'mdi-cog', to: '/settings' }
]
</script>
