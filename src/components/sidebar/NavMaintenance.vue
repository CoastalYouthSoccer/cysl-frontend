<template>
  <!-- Resources Section Header -->
  <v-list-group value="documentation" class="nav-group">
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
              :icon="isOpen ? 'mdi-cog' : 'mdi-cog-outline'"
              size="small"
              :color="isOpen ? 'info' : 'medium-emphasis'"
            ></v-icon>
          </v-avatar>
        </template>

        <v-list-item-title class="font-weight-medium">
          System Maintenance
        </v-list-item-title>

        <v-list-item-subtitle class="text-caption text-medium-emphasis">
          Maintenance of System Resources
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

    <!-- Association -->
    <v-list-item
      v-if="isAdmin || isLeagueRep"
      :class="{ 'v-list-item--active': currentRoute === 'admin/association' }"
      class="nav-subitem"
      value="association"
      data-test="nav-item-association"
      @click="navigateTo('Association')"
    >
      <template #prepend>
        <div class="subitem-connector"></div>
        <v-avatar
          size="28"
          class="subitem-icon"
          :color="currentRoute === 'admin/association' ? 'primary' : 'surface'"
          variant="tonal"
        >
          <v-icon
            icon="mdi-domain"
            size="x-small"
            :color="currentRoute === 'admin/association' ? 'primary' : 'medium-emphasis'"
          ></v-icon>
        </v-avatar>
      </template>

      <v-list-item-title class="font-weight-regular">
        Associations
      </v-list-item-title>

      <v-list-item-subtitle class="text-caption text-medium-emphasis">
        Manage Organization
      </v-list-item-subtitle>
    </v-list-item>

    <!-- Season -->
    <v-list-item
      v-if="isAdmin"
      :class="{ 'v-list-item--active': currentRoute === 'admin/season' }"
      class="nav-subitem"
      value="season"
      data-test="nav-item-season"
      @click="navigateTo('Season')"
    >
      <template #prepend>
        <div class="subitem-connector"></div>
        <v-avatar
          size="28"
          class="subitem-icon"
          :color="currentRoute === 'admin/season' ? 'primary' : 'surface'"
          variant="tonal"
        >
          <v-icon
            icon="mdi-calendar-month"
            size="x-small"
            :color="currentRoute === 'admin/season' ? 'primary' : 'medium-emphasis'"
          ></v-icon>
        </v-avatar>
      </template>

      <v-list-item-title class="font-weight-regular">
        Seasons
      </v-list-item-title>

      <v-list-item-subtitle class="text-caption text-medium-emphasis">
        Configure Season information
      </v-list-item-subtitle>
    </v-list-item>

    <!-- Venue -->
    <v-list-item
      v-if="isAdmin || isAssociationRep"
      :class="{ 'v-list-item--active': currentRoute === 'admin/venue' }"
      class="nav-subitem"
      value="venue"
      data-test="nav-item-venue"
      @click="navigateTo('Venue')"
    >
      <template #prepend>
        <div class="subitem-connector"></div>
        <v-avatar
          size="28"
          class="subitem-icon"
          :color="currentRoute === 'admin/venue' ? 'primary' : 'surface'"
          variant="tonal"
        >
          <v-icon
            icon="mdi-map-marker"
            size="x-small"
            :color="currentRoute === 'admin/venue' ? 'primary' : 'medium-emphasis'"
          ></v-icon>
        </v-avatar>
      </template>

      <v-list-item-title class="font-weight-regular">
        Venues
      </v-list-item-title>

      <v-list-item-subtitle class="text-caption text-medium-emphasis">
        Manage Venues
      </v-list-item-subtitle>
    </v-list-item>

    <!-- User -->
    <v-list-item
      v-if="isAdmin"
      :class="{ 'v-list-item--active': currentRoute === 'admin/user' }"
      class="nav-subitem"
      value="user"
      data-test="nav-item-user"
      @click="navigateTo('User')"
    >
      <template #prepend>
        <div class="subitem-connector"></div>
        <v-avatar
          size="28"
          class="subitem-icon"
          :color="currentRoute === 'admin/user' ? 'primary' : 'surface'"
          variant="tonal"
        >
          <v-icon
            icon="mdi-account-multiple"
            size="x-small"
            :color="currentRoute === 'admin/user' ? 'primary' : 'medium-emphasis'"
          ></v-icon>
        </v-avatar>
      </template>

      <v-list-item-title class="font-weight-regular">
        Users
      </v-list-item-title>

      <v-list-item-subtitle class="text-caption text-medium-emphasis">
        Manage User Accounts
      </v-list-item-subtitle>
    </v-list-item>

    <!-- No Maintenance Available Message -->
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
              No maintenance options available for your current role
            </div>
            <div class="text-caption text-disabled mt-1">
              Contact your administrator for access
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-list-group>

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

const hasAnyResourceAccess = computed(() => {
  return isAdmin.value;
});

const availableCount = computed(() => {
  let count = 0;
  if (isAdmin.value || isLeagueRep.value) count++;
  if (isAdmin.value) count++;
  if (isAdmin.value || isAssociationRep.value) count++;
  if (isAdmin.value) count++;
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
