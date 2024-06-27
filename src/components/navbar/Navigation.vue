<template>
  <v-app-bar
    color="primary"
    dark
    prominent
    height="50"
  >
    <v-btn href="/" size="350">CYSL Referee Resources</v-btn>
    <v-spacer></v-spacer>
<!--    <Referee v-if="isReferee" />
    <ContactButton/>
      <FAQButton/> -->
    <Assignor v-if="isAssignor" />
    <Profile v-if="isAuthenticated"/>
    <LoginButton v-if="!isAuthenticated"/>
  </v-app-bar>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue';
import useUserStore from '@/stores/user';
//import Referee from './Referee.vue';
import { computed, watch } from 'vue';
import LoginButton from "../buttons/LoginButton.vue";
import Profile from './Profile.vue';
import Assignor from './Assignor.vue';
//import FAQButton from '@/components/FAQButton.vue';
//import ContactButton from "@/components/ContactButton.vue";

const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();

const store = useUserStore();
const { setAuthenticated, setAccessToken } = store

watch(user, function() {
  store.setUser(user);
});

watch(isAuthenticated, async function() {
  if (isAuthenticated) {
    const accessToken = isAuthenticated ? await getAccessTokenSilently() : null;
    setAccessToken(accessToken);
    setAuthenticated(isAuthenticated.value);
  } else {
    setAccessToken(null);
    setAuthenticated(false);
  }
});

const isReferee = computed(() => {
  return store.isReferee;
});

const isAssignor = computed(() => {
  return store.isAssignor;
});
</script>
