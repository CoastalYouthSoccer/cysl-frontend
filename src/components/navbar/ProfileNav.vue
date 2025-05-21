<template>
  <v-btn id="profile-activator" data-test="profile-btn">
    {{ userName }}
  </v-btn>

  <v-menu activator="#profile-activator" open-on-hover>
    <v-list bg-color="primary" :nav=true>
      <v-list-item href="#" @click="clickLogout">
        <v-list-item-title>Logout</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
import { watch, ref, onBeforeMount } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';
const { user, logout } = useAuth0();

const userName = ref(null);

function clickLogout() {
  logout({ returnTo: window.location.origin });
}

async function setValues() {
  userName.value = user.value?.name ? user.value?.name : user.value?.given_name + ' ' + user.value?.family_name;
}
watch(user, function() {
  setValues();
});

onBeforeMount(() => {
  setValues();
});

</script>
