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
import { watch, computed } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';
import useUserStore from '@/stores/user';

const { user, logout } = useAuth0();
const store = useUserStore();

watch(user, function() {
  store.setUser(user);
});

function clickLogout() {
  logout({ returnTo: window.location.origin });
}

const userName = computed(() => {
  return store.fullName;
});

</script>
