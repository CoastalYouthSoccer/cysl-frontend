<template>
  <v-btn id="profile-activator">
    {{ userName }}
  </v-btn>

  <v-menu activator="#profile-activator" open-on-hover>
    <v-list bg-color="primary" :nav=true>
      <v-list-item to="/profile">
        <v-list-item-title>Profile</v-list-item-title>
      </v-list-item>
      <v-list-item href="#" @click="clickLogout">
        <v-list-item-title>Logout</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
import { watch, ref } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';
const { user, logout } = useAuth0();

const userName = ref(null);

function clickLogout() {
  logout({ returnTo: window.location.origin });
}
watch(user, function() {
  console.log(user.value);
  userName.value = user.value?.name ? user.value?.name : user.value?.given_name + ' ' + user.value?.family_name;
});

</script>
