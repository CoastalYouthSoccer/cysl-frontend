<template>
  <v-app>
    <Navigation app/>
    <v-main>
      <v-container fluid>
        <RouterView/>
      </v-container>
    </v-main>
    <AppFooter/>
  </v-app>
</template>

<script setup>
  import Navigation from "@/components/navbar/Navigation.vue"
  import AppFooter from "@/components/AppFooter.vue";
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
