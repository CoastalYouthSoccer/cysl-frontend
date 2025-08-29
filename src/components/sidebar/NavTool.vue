<template>
  <!-- Documentation Section -->
  <v-list-group value="tools" class="nav-group">
    <template #activator="{ props, IsToolsOpen }">
      <v-list-item
        v-bind="props"
        class="nav-activator"
        :class="{ 'group-active': IsToolsOpen }"
      >
        <template #prepend>
          <v-avatar
            size="32"
            class="nav-icon"
            :color="IsToolsOpen ? 'info' : 'surface-variant'"
            variant="tonal"
          >
            <v-icon
              :icon="IsToolsOpen ? 'mdi-wrench' : 'mdi-wrench-outline'"
              size="small"
              :color="IsToolsOpen ? 'info' : 'medium-emphasis'"
            ></v-icon>
          </v-avatar>
        </template>
        <v-list-item-title class="font-weight-medium">
          Tools
        </v-list-item-title>

        <v-list-item-subtitle class="text-caption text-medium-emphasis">
          Screens to help Assignors
        </v-list-item-subtitle>
        <template #append>
          <div class="d-flex align-center">
            <v-chip
              v-if="visibleCount > 0"
              :color="IsToolsOpen ? 'info' : 'surface-variant'"
              variant="tonal"
              size="x-small"
              class="mr-2 count-chip"
            >
              {{ visibleCount }}
            </v-chip>
            <v-icon
              :icon="IsToolsOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'"
              :color="IsToolsOpen ? 'info' : 'medium-emphasis'"
              size="small"
              class="expand-icon"
            ></v-icon>
          </div>
        </template>
      </v-list-item>
    </template>
   <!-- Field Coordinator -->
    <v-list-item
      v-if="isAssignor || isAdmin"
      :class="{ 'v-list-item--active': currentRoute === 'field-coordinator' }"
      class="nav-subitem"
      value="field-coordinator"
      data-test="nav-field-coordinator"
      @click="navigateTo('FieldCoordinator')"
    >
      <template #prepend>
        <div class="subitem-connector"></div>
        <v-avatar
          size="28"
          class="subitem-icon"
          :color="currentRoute === 'field-coordinator' ? 'primary' : 'surface'"
          variant="tonal"
        >
          <v-icon
            icon="mdi-account-supervisor-circle"
            size="x-small"
            :color="currentRoute === 'field-coordinator' ? 'primary' : 'medium-emphasis'"
          ></v-icon>
        </v-avatar>
      </template>

      <v-list-item-title class="font-weight-regular">
        Field Coordinator
      </v-list-item-title>

      <v-list-item-subtitle class="text-caption text-medium-emphasis">
        View Referees assigned at a Venue
      </v-list-item-subtitle>
    </v-list-item>
  </v-list-group>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user'

const route = useRoute();
const router = useRouter();

// Constants
const ROUTES = {
  FIELD_COORDINATOR: '/assignor/field-coordinator'
} as const

// Store
const userStore = useUserStore()
const { isAssignor, isAdmin } = storeToRefs(userStore)

// Computed properties
const hasFieldCoordinatorAccess = computed(() =>
  isAssignor.value || isAdmin.value
)

const currentRoute = computed(() => route.name);

const navigateTo = (routeName) => {
  // Add loading state or analytics here if needed
  router.push({ name: routeName });
};

</script>

<style scoped>
.tools-header {
  font-weight: 600;
  letter-spacing: 0.025em;
}
</style>
