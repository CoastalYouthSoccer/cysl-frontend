<template>
  <v-container>
    <h2>Assignr</h2>
    <vue-pdf-embed :source=AssignrRefereePDF />
  </v-container>
</template>

<script setup>
  import VuePdfEmbed from 'vue-pdf-embed'
  import AssignrRefereePDF from "@/assets/assignr/referee.pdf"
</script>
