<template>
  <!-- Section Header -->
  <v-list-subheader class="text-uppercase font-weight-bold text-medium-emphasis px-4 py-3">
    <v-icon
      icon="mdi-cog-outline"
      size="small"
      class="mr-3"
      color="primary"
    ></v-icon>
    System Maintenance
  </v-list-subheader>

  <v-divider class="mx-4 mb-2" opacity="0.3"></v-divider>

  <!-- Navigation Items -->
  <div class="maintenance-nav-group">
    <!-- Associations -->
    <v-list-item
      v-if="isAdmin || isLeagueRep"
      key="association"
      to="/admin/association"
      link
      data-test="nav-item-association"
      class="nav-item"
      :class="{ 'v-list-item--active': $route.path === '/admin/association' }"
    >
      <template v-slot:prepend>
        <v-avatar size="32" class="nav-icon" color="primary" variant="tonal">
          <v-icon icon="mdi-domain" size="small" color="primary"></v-icon>
        </v-avatar>
      </template>

      <v-list-item-title class="font-weight-medium">
        Associations
      </v-list-item-title>

      <v-list-item-subtitle class="text-caption text-medium-emphasis">
        Manage organization groups
      </v-list-item-subtitle>

      <template v-slot:append>
        <v-icon
          icon="mdi-chevron-right"
          size="small"
          class="nav-chevron"
        ></v-icon>
      </template>
    </v-list-item>

    <!-- Seasons -->
    <v-list-item
      v-if="isAdmin || isLeagueRep"
      key="season"
      to="/admin/season"
      link
      data-test="nav-item-season"
      class="nav-item"
      :class="{ 'v-list-item--active': $route.path === '/admin/season' }"
    >
      <template v-slot:prepend>
        <v-avatar size="32" class="nav-icon" color="success" variant="tonal">
          <v-icon icon="mdi-calendar-month" size="small" color="success"></v-icon>
        </v-avatar>
      </template>

      <v-list-item-title class="font-weight-medium">
        Seasons
      </v-list-item-title>

      <v-list-item-subtitle class="text-caption text-medium-emphasis">
        Configure season schedules
      </v-list-item-subtitle>

      <template v-slot:append>
        <v-icon
          icon="mdi-chevron-right"
          size="small"
          class="nav-chevron"
        ></v-icon>
      </template>
    </v-list-item>

    <!-- Venues -->
    <v-list-item
      v-if="isAdmin || isAssociationRep"
      key="venue"
      to="/admin/venue"
      link
      data-test="nav-item-venue"
      class="nav-item"
      :class="{ 'v-list-item--active': $route.path === '/admin/venue' }"
    >
      <template v-slot:prepend>
        <v-avatar size="32" class="nav-icon" color="info" variant="tonal">
          <v-icon icon="mdi-map-marker" size="small" color="info"></v-icon>
        </v-avatar>
      </template>

      <v-list-item-title class="font-weight-medium">
        Venues
      </v-list-item-title>

      <v-list-item-subtitle class="text-caption text-medium-emphasis">
        Manage facility locations
      </v-list-item-subtitle>

      <template v-slot:append>
        <v-icon
          icon="mdi-chevron-right"
          size="small"
          class="nav-chevron"
        ></v-icon>
      </template>
    </v-list-item>

    <!-- Users -->
    <v-list-item
      v-if="isAdmin"
      key="user"
      to="/admin/user"
      link
      data-test="nav-item-user"
      class="nav-item"
      :class="{ 'v-list-item--active': $route.path === '/admin/user' }"
    >
      <template v-slot:prepend>
        <v-avatar size="32" class="nav-icon" color="warning" variant="tonal">
          <v-icon icon="mdi-account-multiple" size="small" color="warning"></v-icon>
        </v-avatar>
      </template>

      <v-list-item-title class="font-weight-medium">
        Users
      </v-list-item-title>

      <v-list-item-subtitle class="text-caption text-medium-emphasis">
        User account management
      </v-list-item-subtitle>

      <template v-slot:append>
        <v-badge
          v-if="isAdmin"
          content="Admin"
          color="error"
          offset-x="-8"
          offset-y="8"
        >
          <v-icon
            icon="mdi-chevron-right"
            size="small"
            class="nav-chevron"
          ></v-icon>
        </v-badge>
        <v-icon
          v-else
          icon="mdi-chevron-right"
          size="small"
          class="nav-chevron"
        ></v-icon>
      </template>
    </v-list-item>
  </div>

  <!-- Permission Info Footer -->
  <v-card
    v-if="showPermissionInfo"
    variant="tonal"
    color="info"
    class="mx-4 mt-4 mb-2"
    density="compact"
  >
    <v-card-text class="py-2 px-3">
      <div class="d-flex align-center">
        <v-icon icon="mdi-shield-account" size="small" class="mr-2" color="info"></v-icon>
        <span class="text-caption">
          Access level:
          <span class="font-weight-bold">
            {{ userRoleDisplay }}
          </span>
        </span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const userStore = useUserStore();
const { isAssociationRep, isAdmin, isLeagueRep } = storeToRefs(userStore);
const route = useRoute();

// Computed properties for better UX
const userRoleDisplay = computed(() => {
  if (isAdmin.value) return 'Administrator';
  if (isLeagueRep.value) return 'League Representative';
  if (isAssociationRep.value) return 'Association Representative';
  return 'User';
});

const showPermissionInfo = computed(() => {
  return isAdmin.value || isLeagueRep.value || isAssociationRep.value;
});

// You could also add a computed for visible items count
const visibleItemsCount = computed(() => {
  let count = 0;
  if (isAdmin.value || isLeagueRep.value) count += 2; // Associations & Seasons
  if (isAdmin.value || isAssociationRep.value) count += 1; // Venues
  if (isAdmin.value) count += 1; // Users
  return count;
});
</script>

<style scoped>
.maintenance-nav-group {
  padding: 0 8px;
}

.nav-item {
  border-radius: 12px;
  margin-bottom: 4px;
  padding: 8px 12px;
  transition: all 0.2s ease-in-out;
}

.nav-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.08);
  transform: translateX(4px);
}

.nav-item.v-list-item--active {
  background-color: rgba(var(--v-theme-primary), 0.12);
  border-left: 3px solid rgb(var(--v-theme-primary));
}

.nav-icon {
  margin-right: 12px;
  transition: all 0.2s ease-in-out;
}

.nav-item:hover .nav-icon {
  transform: scale(1.1);
}

.nav-chevron {
  opacity: 0.6;
  transition: all 0.2s ease-in-out;
}

.nav-item:hover .nav-chevron {
  opacity: 1;
  transform: translateX(2px);
}

.v-list-subheader {
  background-color: rgba(var(--v-theme-surface-variant), 0.5);
  border-radius: 8px;
  margin: 8px 8px 16px 8px;
  letter-spacing: 0.5px;
}

/* Dark theme adjustments */
.v-theme--dark .nav-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.15);
}

.v-theme--dark .nav-item.v-list-item--active {
  background-color: rgba(var(--v-theme-primary), 0.2);
}

/* Animation for permission info card */
.v-card {
  transition: all 0.3s ease-in-out;
}

.v-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .nav-item {
    padding: 12px;
  }

  .v-list-item-subtitle {
    display: none;
  }
}
</style>
