<template>
  <v-app-bar
    color="primary"
    dark
    prominent
    height="50"
  >
    <v-btn href="/" size="350">CYSL Referee Resources</v-btn>
    <v-spacer></v-spacer>
    <AssignorNav v-if="isAssignor && !isLoading" data-test="AssignorNav"/>
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

const { isAuthenticated, isLoading, user } = useAuth0();

const isReferee = ref(false);
const isAssignor = ref(false);

async function setValues() {
  const user_roles = user.value?.user_roles || [];
  isReferee.value = user_roles.includes("referee");
  isAssignor.value = user_roles.includes("assignor");
}

watch(user, function() {
  setValues()
});


onBeforeMount(() => {
  setValues();
});

</script>
