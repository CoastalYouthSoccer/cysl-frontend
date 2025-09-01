<template>
  <v-btn id="admin-activator" data-test="admin-btn">Administrator</v-btn>
  <v-menu activator="#admin-activator" open-on-hover>
    <v-list bg-color="primary" :nav=true>
      <v-list-item to="/admin/user">
        <v-list-item-title class="font-weight-medium">Users</v-list-item-title>
      </v-list-item>
      <v-list-item href="/admin/venues">
        <v-list-item-title class="font-weight-medium">Venues</v-list-item-title>
      </v-list-item>
      <v-list-item href="/call">
        <v-list-item-title class="font-weight-medium">Make the Call</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
</script>
