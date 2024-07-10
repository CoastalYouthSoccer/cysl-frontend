<template>
  <v-container>
    Home
  </v-container>
</template>

<script setup>
  console.log('domain');
  console.log(import.meta.env.VITE_AUTH0_DOMAIN);
  console.log('client id');
  console.log(import.meta.env.VITE_AUTH0_CLIENT_ID);
  console.log('scope');
  console.log(import.meta.env.VITE_AUTH0_SCOPE);
</script>
