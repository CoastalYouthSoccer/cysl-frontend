<template>
  <v-btn color="primary" @click="handleLogout" data-test="logout-btn">Log Out</v-btn>
</template>

<script setup>
  import { useAuth0 } from "@auth0/auth0-vue";

  const { logout } = useAuth0();

  const handleLogout = () =>
    logout({
      returnTo: window.location.origin,
    });
</script>
