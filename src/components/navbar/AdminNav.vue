<template>
  <v-btn id="menu-activator" data-test="admin-btn">Admin</v-btn>
  <v-menu activator="#menu-activator" open-on-hover>
    <v-list bg-color="primary" :nav=true>
      <v-list-item to="/assignr-referee">
        <v-list-item-title>Assignr Documentation</v-list-item-title>
      </v-list-item>
      <v-list-item href="/spring2024rules">
        <v-list-item-title>CYSL 2024 Spring Rules</v-list-item-title>
      </v-list-item>
      <v-list-item href="/call">
        <v-list-item-title>Make the Call</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
</script>
