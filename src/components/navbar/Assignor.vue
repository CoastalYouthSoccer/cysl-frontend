<template>
  <v-btn id="assignor-activator">Assignor</v-btn>
  <v-menu activator="#assignor-activator" open-on-hover>
    <v-list bg-color="primary" :nav=true>
      <v-list-item to="/assignr-assignor">
        <v-list-item-title>Assignr Documentation</v-list-item-title>
      </v-list-item>
      <v-list-item href="/spring2024rules">
        <v-list-item-title>CYSL 2024 Spring Rules</v-list-item-title>
      </v-list-item>
      <v-list-item href="/field-coordinator">
        <v-list-item-title>Field Coordinator</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
</script>
