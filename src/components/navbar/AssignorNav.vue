<template>
  <v-btn id="assignor-activator" data-test="assignor-btn">Assignor</v-btn>
  <v-menu activator="#assignor-activator" open-on-hover data-test="assignor-activator">
    <v-list bg-color="primary" :nav=true>
      <v-list-item to="/assignr-assignor" data-test="assignor-list-item">
        <v-list-item-title>Assignr Documentation</v-list-item-title>
      </v-list-item>
      <v-list-item href="/spring2024rules">
        <v-list-item-title>CYSL 2024 Spring Rules</v-list-item-title>
      </v-list-item>
      <v-list-item href="/assignor/field-coordinator">
        <v-list-item-title>Field Coordinator</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
</script>
