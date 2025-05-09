<template>
  <v-app-bar
    color="primary"
    dense
    dark
    prominent
    height="48"
  >
    <v-btn href="/" size="280">CYSL Game Management Site</v-btn>
    <v-spacer></v-spacer>
    <AssignorNav v-if="isAssignor || isAdmin"/>
    <RefereeNav v-if="isReferee || isAdmin"/>
    <ProfileNav v-if="isAuthenticated"/>
    <LoginButton v-if="!isAuthenticated"/>
  </v-app-bar>
</template>

<script setup>
import LoginButton from "../buttons/LoginButton.vue";
import ProfileNav from './ProfileNav.vue';
import AssignorNav from './AssignorNav.vue';
import RefereeNav from './RefereeNav.vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore()
const { isAssignor, isReferee, isAdmin, isAuthenticated } = storeToRefs(userStore)

</script>
