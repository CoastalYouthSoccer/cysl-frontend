<template>
  <v-list-subheader>
    <v-icon
      icon="mdi-binoculars"
      start
    ></v-icon>MAINTENANCE</v-list-subheader>
  <v-list-item
    v-if="isAdmin || isLeagueRep"
    subtitle="Associations"
    key='association'
    to='/admin/association'
    link
    data-test='nav-item-association'
  />
  <v-list-item
    v-if="isAdmin || isLeagueRep"
    subtitle="Seasons"
    key='season'
    to='/admin/season'
    link
    data-test='nav-item-season'
  />
  <v-list-item
    v-if="isAdmin || isAssociationRep"
    subtitle="Venues"
    key='venue'
    to='/admin/venue'
    link
    data-test='nav-item-venue'
  />
  <v-list-item
    v-if="isAdmin"
    subtitle="Users"
    key='user'
    to='/admin/user'
    link
    data-test='nav-item-user'
  />
</template>

<script setup>
  import { storeToRefs } from 'pinia';
  import { useUserStore } from '@/stores/user';

  const userStore = useUserStore()
  const { isAssociationRep, isAdmin, isLeagueRep } = storeToRefs(userStore)
</script>
