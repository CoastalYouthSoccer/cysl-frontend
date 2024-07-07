<template>
  <v-container>
    <vue-pdf-embed :source=rulePDF />
  </v-container>
</template>

<script setup>
  import VuePdfEmbed from 'vue-pdf-embed'
  import rulePDF from "../assets/Spring2024GameRules.pdf"
</script>
