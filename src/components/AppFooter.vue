<template>
    <v-footer class="d-flex flex-column bg-blue-darken-1">
      <v-row>
        <v-btn
          v-for="link in links"
          :key="link.title"
          color="white"
          variant="text"
          class="mx-2"
          rounded="xl"
          :href="link.link"
        >
          {{ link.title }}
        </v-btn>
      </v-row>
      <v-row>
        {{ new Date().getFullYear() }} — <strong>Hanover Soccer Referee</strong>
      </v-row>
    </v-footer>
</template>

<script setup>
  const links = [
    { title: "Home", link: "/" },
//     { title: "About", link: "/about" },
  ]
</script>
