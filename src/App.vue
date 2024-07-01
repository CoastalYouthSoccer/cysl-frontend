<template>
  <v-app>
    <Navigation/>
    <v-container>
      <v-row></v-row>
    </v-container>
    <RouterView/>
  </v-app>
</template>

<script setup>
  import Navigation from "@/components/navbar/Navigation.vue"
</script>

<style>
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
