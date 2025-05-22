<template>
  <v-list-subheader>
    <v-icon
      icon="mdi-tooltip-outline"
      start
    ></v-icon>TOOLS</v-list-subheader>
  <v-list-item
    v-if="isAssignor || isAdmin"
    subtitle="Field Coordinator"
    key='field-coordinator'
    to='/assignor/field-coordinator'
    link
    data-test='nav-item-field-coordinator'
  />
</template>

<script setup>
  import { storeToRefs } from 'pinia';
  import { useUserStore } from '@/stores/user';

  const userStore = useUserStore()
  const { isAssignor, isAdmin } = storeToRefs(userStore)
</script>
