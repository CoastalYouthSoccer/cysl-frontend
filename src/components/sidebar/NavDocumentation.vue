<template>
  <!-- Documentation Section -->
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
              :icon="isOpen ? 'mdi-file-document' : 'mdi-file-document-outline'"
              size="small"
              :color="isOpen ? 'info' : 'medium-emphasis'"
            ></v-icon>
          </v-avatar>
        </template>

        <v-list-item-title class="font-weight-medium">
          Documentation
        </v-list-item-title>

        <v-list-item-subtitle class="text-caption text-medium-emphasis">
          Documentation & Guides
        </v-list-item-subtitle>

        <template #append>
          <div class="d-flex align-center">
            <v-chip
              v-if="visibleDocsCount > 0"
              :color="isOpen ? 'info' : 'surface-variant'"
              variant="tonal"
              size="x-small"
              class="mr-2 count-chip"
            >
              {{ visibleDocsCount }}
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

    <!-- Assignr for Assignors -->
    <v-list-item
      v-if="isAssignor || isAdmin"
      :class="{ 'v-list-item--active': currentRoute === 'assignr-assignors' }"
      class="nav-subitem"
      value="assignr-assignors"
      data-test="nav-item-assignor-documentation"
      @click="navigateTo('AssignrDocumentation')"
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
        Assignr for Assignors
      </v-list-item-title>

      <v-list-item-subtitle class="text-caption text-medium-emphasis">
        Assignment management guide
      </v-list-item-subtitle>
    </v-list-item>

    <!-- Assignr for Referees -->
    <v-list-item
      v-if="isReferee || isAdmin || isAssignor"
      :class="{ 'v-list-item--active': currentRoute === 'assignr-referees' }"
      class="nav-subitem"
      value="assignr-referees"
      data-test="nav-item-referee-documentation"
      @click="navigateTo('AssignrReferee')"
    >
      <template #prepend>
        <div class="subitem-connector"></div>
        <v-avatar
          size="28"
          class="subitem-icon"
          :color="currentRoute === 'assignr-referees' ? 'success' : 'surface'"
          variant="tonal"
        >
          <v-icon
            icon="mdi-whistle"
            size="x-small"
            :color="currentRoute === 'assignr-referees' ? 'success' : 'medium-emphasis'"
          ></v-icon>
        </v-avatar>
      </template>

      <v-list-item-title class="font-weight-regular">
        Assignr for Referees
      </v-list-item-title>

      <v-list-item-subtitle class="text-caption text-medium-emphasis">
        Referee workflow guide
      </v-list-item-subtitle>
    </v-list-item>

    <!-- Spring Rules -->
    <v-list-item
      v-if="isReferee || isAdmin || isAssignor || isCoach || isAssociationRep || isLeagueRep"
      :class="{ 'v-list-item--active': currentRoute === 'spring-rules' }"
      class="nav-subitem"
      value="spring-rules"
      data-test="nav-item-rule-documentation"
      @click="navigateTo('CYSLSpring2025Rules')"
    >
      <template #prepend>
        <div class="subitem-connector last-connector"></div>
        <v-avatar
          size="28"
          class="subitem-icon"
          :color="currentRoute === 'spring-rules' ? 'warning' : 'surface'"
          variant="tonal"
        >
          <v-icon
            icon="mdi-book-open-page-variant"
            size="x-small"
            :color="currentRoute === 'spring-rules' ? 'warning' : 'medium-emphasis'"
          ></v-icon>
        </v-avatar>
      </template>

      <v-list-item-title class="font-weight-regular">
        2025 Spring Rules
      </v-list-item-title>

      <v-list-item-subtitle class="text-caption text-medium-emphasis">
        Official season regulations
      </v-list-item-subtitle>
    </v-list-item>

    <!-- No Access Message -->
    <v-list-item
      v-if="visibleDocsCount === 0"
      class="no-access-item"
      disabled
    >
      <template #prepend>
        <div class="subitem-connector last-connector"></div>
        <v-avatar size="28" color="surface" variant="tonal">
          <v-icon icon="mdi-lock-outline" size="x-small" color="disabled"></v-icon>
        </v-avatar>
      </template>

      <v-list-item-title class="text-disabled text-caption">
        No documentation available for your role
      </v-list-item-title>
    </v-list-item>
  </v-list-group>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';
import { useRouter, useRoute } from 'vue-router';
import { computed } from 'vue';

const router = useRouter();
const route = useRoute();

const userStore = useUserStore();
const {
  isAssignor,
  isReferee,
  isAdmin,
  isCoach,
  isLeagueRep,
  isAssociationRep
} = storeToRefs(userStore);

// Get current route for active state
const currentRoute = computed(() => route.name);

// Count visible documentation items
const visibleDocsCount = computed(() => {
  let count = 0;
  if (isAssignor.value || isAdmin.value) count++;
  if (isReferee.value || isAdmin.value || isAssignor.value) count++;
  if (isReferee.value || isAdmin.value || isAssignor.value || isCoach.value || isAssociationRep.value || isLeagueRep.value) count++;
  return count;
});

const navigateTo = (routeName) => {
  // Add loading state or analytics here if needed
  router.push({ name: routeName });
};
</script>
