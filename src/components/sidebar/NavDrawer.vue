<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    permanent
    class="bg-grey-lighten-4"
  >
    <v-list dense>
      <PublicNav/>
      <Documentation/>
      <Resource/>
      <Tool/>
      <Maintenance/>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue'
import PublicNav from './PublicNav.vue'
import Documentation from './Documentation.vue'
import Tool from './Tool.vue'
import Maintenance from './Maintenance.vue'
import Resource from './Resource.vue'

const drawer = ref(true)

const items = [
  { title: 'Profile', icon: 'mdi-account', to: '/profile' },
  { title: 'Admin', icon: 'mdi-shield-account', to: '/admin' },
  { title: 'Settings', icon: 'mdi-cog', to: '/settings' }
]
</script>
