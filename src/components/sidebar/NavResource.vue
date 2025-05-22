<template>
  <v-list-subheader>
    <v-icon
      icon="mdi-flashlight"
      start
    ></v-icon>RESOURCES</v-list-subheader>

  <v-list-item
    v-if="isReferee || isAdmin || isAssignor"
    subtitle="Make the Call"
    key='thecall'
    to='/call'
    link
    data-test='nav-item-make-call'
  />
</template>

<script setup>
  import { storeToRefs } from 'pinia';
  import { useUserStore } from '@/stores/user';

  const userStore = useUserStore()
  const { isAssignor, isReferee, isAdmin, isCoach, isLeagueRep,
          isAssociationRep } = storeToRefs(userStore)
</script>
