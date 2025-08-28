<template>
  <!-- Resources Section Header -->
  <v-list-group value="documentation" class="nav-group">
    <template #activator="{ props, isResourceOpen }">
      <v-list-item
        v-bind="props"
        class="nav-activator"
        :class="{ 'group-active': isResourceOpen }"
      >
        <template #prepend>
          <v-avatar
            size="32"
            class="nav-icon"
            :color="isResourceOpen ? 'info' : 'surface-variant'"
            variant="tonal"
          >
            <v-icon
              :icon="isResourceOpen ? 'mdi-compass' : 'mdi-compass-outline'"
              size="small"
              :color="isResourceOpen ? 'info' : 'medium-emphasis'"
            ></v-icon>
          </v-avatar>
        </template>

        <v-list-item-title class="font-weight-medium">
          Resource Center
        </v-list-item-title>

        <v-list-item-subtitle class="text-caption text-medium-emphasis">
          Resources
        </v-list-item-subtitle>

        <template #append>
          <div class="d-flex align-center">
            <v-chip
              v-if="availableCount > 0"
              :color="isResourceOpen ? 'info' : 'surface-variant'"
              variant="tonal"
              size="x-small"
              class="mr-2 count-chip"
            >
              {{ availableCount }}
            </v-chip>
            <v-icon
              :icon="isResourceOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'"
              :color="isResourceOpen ? 'info' : 'medium-emphasis'"
              size="small"
              class="expand-icon"
            ></v-icon>
          </div>
        </template>
      </v-list-item>
    </template>


  <!-- Resources Navigation Items -->
    <!-- Make the Call -->
    <v-list-item
      v-if="isReferee || isAdmin || isAssignor"
      :class="{ 'v-list-item--active': currentRoute === 'assignr-assignors' }"
      class="nav-subitem"
      value="assignr-assignors"
      @click="navigateTo('TheCall')"
    >
      <template #prepend>
        <div class="subitem-connector"></div>
        <v-avatar
          size="28"
          class="subitem-icon"
          :color="currentRoute === 'assignr-assignors' ? 'primary' : 'surface'"
          variant="tonal"
        >
          <v-icon
            icon="mdi-account-supervisor-circle"
            size="x-small"
            :color="currentRoute === 'assignr-assignors' ? 'primary' : 'medium-emphasis'"
          ></v-icon>
        </v-avatar>
      </template>

      <v-list-item-title class="font-weight-regular">
        Make the Call
      </v-list-item-title>

      <v-list-item-subtitle class="text-caption text-medium-emphasis">
        Guidance on applying IFAB Laws
      </v-list-item-subtitle>
    </v-list-item>

    <!-- No Resources Available Message -->
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
              No resources available for your current role
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

<script setup>
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const userStore = useUserStore();
const {
  isAssignor,
  isReferee,
  isAdmin,
  isCoach,
  isLeagueRep,
  isAssociationRep
} = storeToRefs(userStore);

const route = useRoute();

// Check if current route is the call page
const isCallActive = computed(() => {
  return route.path === '/call' || route.name === 'call' || route.name === 'thecall';
});

// Check if user has access to any resources
const hasAnyResourceAccess = computed(() => {
  return isReferee.value || isAdmin.value || isAssignor.value;
});

// Count available resources for current user
const availableCount = computed(() => {
  let count = 0;
  if (isReferee.value || isAdmin.value || isAssignor.value) count++; // Make the Call
  // Add more resources as they become available
  if (isAdmin.value || isAssignor.value) count++; // Future: Referee Handbook
  return count;
});

// Get user role display for better UX
const primaryRole = computed(() => {
  if (isAdmin.value) return 'Administrator';
  if (isAssignor.value) return 'Assignor';
  if (isReferee.value) return 'Referee';
  if (isCoach.value) return 'Coach';
  if (isLeagueRep.value) return 'League Rep';
  if (isAssociationRep.value) return 'Association Rep';
  return 'User';
});
</script>

<style scoped>
/* Coming Soon Items */
.coming-soon {
  opacity: 0.6;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 4px,
    rgba(var(--v-theme-surface-variant), 0.1) 4px,
    rgba(var(--v-theme-surface-variant), 0.1) 8px
  );
}

.coming-soon:hover {
  transform: none;
  box-shadow: none;
}

/* Pulse animation for essential items */
@keyframes gentle-pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-success), 0.4);
  }
  50% {
    box-shadow: 0 0 0 4px rgba(var(--v-theme-success), 0.1);
  }
}
</style>
