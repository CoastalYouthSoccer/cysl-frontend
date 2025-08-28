<template>
  <v-list-item
    key="home"
    to="/"
    link
    data-test="nav-item-home"
    class="nav-item"
    :class="{ 'v-list-item--active': isHomeActive }"
    @click="handleHomeClick"
  >
    <template v-slot:prepend>
      <v-avatar
        size="32"
        class="nav-icon"
        :color="isHomeActive ? 'primary' : 'surface-variant'"
        variant="tonal"
      >
        <v-icon
          :icon="isHomeActive ? 'mdi-home' : 'mdi-home-outline'"
          size="small"
          :color="isHomeActive ? 'primary' : 'medium-emphasis'"
        ></v-icon>
      </v-avatar>
    </template>

    <v-list-item-title class="font-weight-medium">
      Home
    </v-list-item-title>

    <v-list-item-subtitle class="text-caption text-medium-emphasis">
      Dashboard overview
    </v-list-item-subtitle>

    <template v-slot:append>
      <v-fade-transition>
        <v-icon
          v-if="isHomeActive"
          icon="mdi-circle-small"
          size="small"
          color="primary"
          class="active-indicator"
        ></v-icon>
        <v-icon
          v-else
          icon="mdi-chevron-right"
          size="small"
          class="nav-chevron"
        ></v-icon>
      </v-fade-transition>
    </template>
  </v-list-item>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// Computed property to check if home is active
const isHomeActive = computed(() => {
  return route.path === '/' || route.name === 'home';
});

// Optional: Handle click event for analytics or other purposes
const handleHomeClick = () => {
  // You can add analytics tracking here
  // console.log('Home navigation clicked');

  // Optional: Add custom behavior for home navigation
  if (route.path === '/') {
    // If already on home, you might want to scroll to top or refresh data
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

// Optional: You could also emit events for parent components
const emit = defineEmits(['navigate']);

// Emit navigation event (uncomment if needed)
// const handleHomeClick = () => {
//   emit('navigate', { route: '/', name: 'home' });
// };
</script>
