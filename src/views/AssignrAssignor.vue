<template>
  <v-container>
    <h2>Assignr</h2>
    <vue-pdf-embed :source=usingAssignrRefereePDF />
  </v-container>
</template>

<script setup>
  import VuePdfEmbed from 'vue-pdf-embed'
  import usingAssignrRefereePDF from "@/assets/assignr/UsingAssignrAssignor.pdf"
</script>
