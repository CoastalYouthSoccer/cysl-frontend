<template>
  <v-container>
    This is the home page of CYSL Management system
    <VenueData />
  </v-container>
</template>
<script setup>
  import VenueData from '@/components/venue/VenueData.vue';
  import { ref } from 'vue';

  const isAlert = ref(true)
  const errorMessage = ref('This is a test')
</script>
