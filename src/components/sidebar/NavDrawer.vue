<template>
  <v-navigation-drawer
    v-model="drawer"
    :rail="rail"
    :width="400"
    :rail-width="80"
    app
    permanent
    class="elevation-2"
  >
    <template #prepend>
      <div class="nav-header pa-4 d-flex align-center">
        <v-btn
          icon
          @click.stop="toggleRail"
          class="rail-toggle"
          size="small"
          variant="text"
        >
          <v-icon>mdi-menu</v-icon>
        </v-btn>
        <v-expand-x-transition>
          <div v-show="!rail" class="nav-title ml-3">
            <h3 class="text-h6 font-weight-bold text-primary">
              CYSL Management
            </h3>
            <p class="text-caption text-medium-emphasis mb-0">
              Game Management System
            </p>
          </div>
        </v-expand-x-transition>
      </div>
    </template>

    <v-list nav class="nav-list">
      <NavPublic/>
      <NavDocumentation/>
      <NavResource/>
      <NavTool/>
      <NavMaintenance/>
    </v-list>

    <!-- Optional: Add footer toggle button when in rail mode -->
    <template #append v-if="rail">
      <div class="pa-2 text-center">
        <v-btn
          icon
          @click.stop="toggleRail"
          size="small"
          variant="text"
        >
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>
    </template>
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
const rail = ref(false)

const toggleRail = () => {
  rail.value = !rail.value
}

defineExpose({
  toggleRail,
  rail,
  drawer
})

const items = [
  { title: 'Profile', icon: 'mdi-account', to: '/profile' },
  { title: 'Admin', icon: 'mdi-shield-account', to: '/admin' },
  { title: 'Settings', icon: 'mdi-cog', to: '/settings' }
]
</script>

<style scoped>
.rail-toggle {
  flex-shrink: 0;
  opacity: 1 !important;
}

.rail-toggle .v-icon {
  opacity: 1 !important;
}

.nav-title {
  min-width: 0; /* Allows text to truncate properly */
}

/* Reduce spacing between icons and text */
:deep(.v-list-item__prepend) {
  margin-inline-end: 4px !important;
}

:deep(.v-list-item) {
  padding-left: 0px !important;
  padding-right: 12px !important;
}

/* Ensure proper spacing in rail mode */
:deep(.v-navigation-drawer--rail) .v-list-item {
  padding-left: 6px !important;
  padding-right: 16px !important;
}

/* Custom styling for better rail mode appearance */
:deep(.v-navigation-drawer--rail) .nav-header {
  justify-content: center;
}

:deep(.v-navigation-drawer--rail) .rail-toggle {
  margin: 0 auto;
  opacity: 1 !important;
}

:deep(.v-navigation-drawer--rail) .rail-toggle .v-icon {
  opacity: 1 !important;
}
</style>
