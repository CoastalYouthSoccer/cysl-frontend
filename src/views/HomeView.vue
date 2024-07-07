<template>
  <v-container>
    Home
  </v-container>
</template>

<script setup>
  console.log(import.meta.env.VITE_AUTH0_DOMAIN);
  console.log(import.meta.env.VITE_AUTH0_CLIENT_ID);
  console.log(import.meta.env.VITE_AUTH0_SCOPE);
</script>
