<template>
  <!-- Documentation Section -->
  <v-list-group value="tools" class="nav-group">
    <template #activator="{ props, isOpen }">
      <v-list-item
        v-bind="props"
        class="nav-activator"
        :class="{ 'group-active': isOpen }"
      >
        <template #prepend>
          <v-avatar
            size="32"
            class="nav-icon"
            :color="isOpen ? 'info' : 'surface-variant'"
            variant="tonal"
          >
            <v-icon
              :icon="isOpen ? 'mdi-wrench' : 'mdi-wrench-outline'"
              size="small"
              :color="isOpen ? 'info' : 'medium-emphasis'"
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
              v-if="availableCount > 0"
              :color="isOpen ? 'info' : 'surface-variant'"
              variant="tonal"
              size="x-small"
              class="mr-2 count-chip"
            >
              {{ availableCount }}
            </v-chip>
            <v-icon
              :icon="isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'"
              :color="isOpen ? 'info' : 'medium-emphasis'"
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

    <v-card
      v-if="!hasAnyResourceAccess"
      variant="tonal"
      color="surface-variant"
      class="mx-4 my-2"
      density="compact"
    >
      <v-card-text class="py-3 px-4">
        <div class="d-flex align-center text-center">
          <v-icon
            icon="mdi-information-outline"
            size="small"
            class="mr-3"
            color="medium-emphasis"
          ></v-icon>
          <div class="flex-grow-1">
            <div class="text-caption font-weight-medium text-medium-emphasis">
              No Tools available for your current role
            </div>
            <div class="text-caption text-disabled mt-1">
              Contact your administrator for access
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
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

// Check if user has access to any resources
const hasAnyResourceAccess = computed(() => {
  return isAdmin.value || isAssignor.value;
});

// Count available resources for current user
const availableCount = computed(() => {
  let count = 0;
  if (isAdmin.value || isAssignor.value) count++; // Make the Call
  return count;
});

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
