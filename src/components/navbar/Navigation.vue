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
    <AssignorNav v-if="(isAssignor || isAdmin) && !isLoading" data-test="AssignorNav"/>
    <RefereeNav v-if="(isReferee || isAdmin) && !isLoading" data-test="RefereeNav"/>
    <ProfileNav v-if="isAuthenticated && !isLoading" data-test="ProfileNav"/>
    <LoginButton v-if="!isAuthenticated && !isLoading" data-test="LoginButton"/>
  </v-app-bar>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue';
import { watch, ref, onBeforeMount } from 'vue';
import LoginButton from "../buttons/LoginButton.vue";
import ProfileNav from './ProfileNav.vue';
import AssignorNav from './AssignorNav.vue';
import RefereeNav from './RefereeNav.vue';

const { isAuthenticated, isLoading, user } = useAuth0();

const isReferee = ref(false);
const isAssignor = ref(false);
const isAdmin = ref(false);
const isCoach = ref(false);

async function setValues() {
  const user_roles = user.value?.user_roles || [];
  isReferee.value = user_roles.includes("referee");
  isAdmin.value = user_roles.includes("admin");
  isAssignor.value = user_roles.includes("assignor");
  isCoach.value = user_roles.includes("coach");
}

watch(user, function() {
  setValues()
});


onBeforeMount(() => {
  setValues();
});

</script>
