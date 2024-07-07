<template>
  <v-container>
    <h2>Assignr</h2>
    <vue-pdf-embed :source=AssignrAssignorPDF />
  </v-container>
</template>

<script setup>
  import VuePdfEmbed from 'vue-pdf-embed'
  import AssignrAssignorPDF from "../assets/assignr/assignor.pdf"
</script>
