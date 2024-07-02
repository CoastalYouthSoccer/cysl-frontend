<template>
  <v-app-bar
    color="primary"
    dark
    prominent
    height="50"
  >
    <v-btn href="/" size="350">CYSL Referee Resources</v-btn>
    <v-spacer></v-spacer>
<!--    <RefereeNav v-if="isReferee" />
    <ContactButton/>
      <FAQButton/> -->
    <AssignorNav v-if="isAssignor" data-test="AssignorNav"/>
    <ProfileNav v-if="isAuthenticated" data-test="ProfileNav"/>
    <LoginButton data-test="LoginButton"/>
  </v-app-bar>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue';
//import RefereeNav from './RefereeNav.vue';
import { watch, ref, onBeforeMount } from 'vue';
import LoginButton from "../buttons/LoginButton.vue";
import ProfileNav from './ProfileNav.vue';
import AssignorNav from './AssignorNav.vue';
//import FAQButton from '@/components/FAQButton.vue';
//import ContactButton from "@/components/ContactButton.vue";

const { isAuthenticated, user } = useAuth0();

const isReferee = ref(false);
const isAssignor = ref(false);

async function setValues() {
  isReferee.value = user.value?.user_roles.includes("referee");
  isAssignor.value = user.value?.user_roles.includes("assignor");
}

watch(user, function() {
  setValues()
});


onBeforeMount(() => {
  setValues();
});

</script>
