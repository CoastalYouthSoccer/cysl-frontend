<template>
  <v-container>
    This is the home page of CYSL Management system
    <VenueSelect :selected="venue" @venueChange="(val) => venue = val" />
  </v-container>
</template>
<script setup>
import VenueSelect from '@/components/venue/VenueSelect.vue';
const venue = ref('Some Venue')

</script>
