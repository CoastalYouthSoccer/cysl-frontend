<template>
  <v-list-subheader>
    <v-icon
      icon="mdi-file-document"
      start
    ></v-icon>DOCUMENTATION</v-list-subheader>

  <v-list-item
    v-if="isAssignor || isAdmin"
    subtitle="Assignr for Assignors"
    key='assignr-assignor'
    to='/assignr-assignor'
    link
    data-test='nav-item-assignor-documentation'
  />
  <v-list-item
    v-if="isReferee || isAdmin || isAssignor"
    subtitle="Assignr for Referees"
    key='assignr-referee'
    to='/assignr-referee'
    link
    data-test='nav-item-referee-documentation'
  />
  <v-list-item
    v-if="isReferee || isAdmin || isAssignor || isCoach || isAssociationRep || isLeagueRep"
    subtitle="2024 Spring Rules"
    key='spring2024rules'
    to='/spring2024rules'
    link
    data-test='nav-item-rule-documentation'
  />
</template>

<script setup>
  import { storeToRefs } from 'pinia';
  import { useUserStore } from '@/stores/user';

  const userStore = useUserStore()
  const { isAssignor, isReferee, isAdmin, isCoach, isLeagueRep,
          isAssociationRep } = storeToRefs(userStore)
</script>
