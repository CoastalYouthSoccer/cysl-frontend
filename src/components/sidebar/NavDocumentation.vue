<template>
  <!-- Documentation Section -->
  <v-list-group value="documentation">
    <template #activator="{ props }">
      <v-list-item
        v-bind="props"
        prepend-icon="mdi-file-document-outline"
        title="Documentation"
      ></v-list-item>
    </template>

    <v-list-item
      v-if="isAssignor || isAdmin"
      :class="{ 'v-list-item--active': currentRoute === 'assignr-assignors' }"
      prepend-icon="mdi-account-supervisor-outline"
      title="Assignr for Assignors"
      value="assignr-assignors"
      class="nav-subitem"
      @click="navigateTo('assignr-assignors')"
    ></v-list-item>

    <v-list-item
      v-if="isReferee || isAdmin || isAssignor"
      :class="{ 'v-list-item--active': currentRoute === 'assignr-referees' }"
      prepend-icon="mdi-whistle-outline"
      title="Assignr for Referees"
      value="assignr-referees"
      class="nav-subitem"
      @click="navigateTo('assignr-referees')"
    ></v-list-item>

    <v-list-item
      v-if="isReferee || isAdmin || isAssignor || isCoach || isAssociationRep || isLeagueRep"
      :class="{ 'v-list-item--active': currentRoute === 'spring-rules' }"
      prepend-icon="mdi-book-open-variant"
      title="2024 Spring Rules"
      value="spring-rules"
      class="nav-subitem"
      @click="navigateTo('spring-rules')"
    ></v-list-item>
  </v-list-group>
</template>

<script setup>
  import { storeToRefs } from 'pinia';
  import { useUserStore } from '@/stores/user';
  import { useRouter, useRoute } from 'vue-router'
  import { computed } from 'vue'

  const router = useRouter()
  const route = useRoute()

  const userStore = useUserStore()
  const { isAssignor, isReferee, isAdmin, isCoach, isLeagueRep,
          isAssociationRep } = storeToRefs(userStore)

  // Get current route for active state
  const currentRoute = computed(() => route.name)

  const navigateTo = (routeName) => {
    router.push({ name: routeName })
  }
</script>

<style scoped>
.nav-subitem {
  padding-left: 56px !important;
  font-size: 0.875rem;
}
</style>
